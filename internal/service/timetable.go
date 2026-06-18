package service

import (
	"context"
	"fmt"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/bytedance/gopkg/util/logger"
	"github.com/xuri/excelize/v2"
	"go.uber.org/zap"

	"crypto/sha256"
	"io"
	"os"

	"github.com/chromedp/cdproto/browser"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
	"github.com/extrame/xls"
)

var (
	SHEET_NAME       = "anualReportSubject"
	ROW_START_OFFSET = 7
	LAST_CHANGE_CELL = "J1"
)

type TimetableService struct {
	logger         *zap.Logger
	downloadPath   string
	screenshotPath string
}

func NewTimetableService(logger *zap.Logger) TimetableService {
	return TimetableService{
		logger: logger,
	}
}

type Dimensions struct {
	Height int
	Width  int
}

type CourseType int

const (
	RV CourseType = iota
	PR
	LV
	SV
)

var courseType = map[CourseType]string{
	RV: "Racunalniske vaje",
	PR: "Predavanje",
	LV: "Laboratoriske vaje",
	SV: "Seminarske Vaje",
}

func (ct CourseType) String() string {
	return courseType[ct]
}

type Course struct {
	Type CourseType
	Name string
}

type Day struct {
	Entries []TimetableEntry
	Day     string
}

type Timetable struct {
	LastChange time.Time
	Entries    []TimetableEntry
}

type TimetableEntry struct {
	Day        string
	StartsAt   time.Time
	EndsAt     time.Time
	Location   string
	Course     Course
	Groups     []string
	Professors []string
}

type Point struct {
	at    time.Time
	delta int
}

func MaxConcurrent(entries []TimetableEntry) int {
	if len(entries) == 0 {
		return 1
	}

	points := make([]Point, 0, len(entries)*2)

	for _, entry := range entries {
		points = append(points,
			Point{at: entry.StartsAt, delta: 1},
			Point{at: entry.EndsAt, delta: -1},
		)
	}

	sort.Slice(points, func(i, j int) bool {
		if points[i].at.Equal(points[j].at) {
			return points[i].delta < points[j].delta
		}

		return points[i].at.Before(points[j].at)
	})

	active := 0
	maxActive := 0

	for _, p := range points {
		active += p.delta

		if active > maxActive {
			maxActive = active
		}
	}

	return maxActive
}

func (d *TimetableDay) PairConcurrent() [][]TimetableEntry {
	var pairedEntries [][]TimetableEntry
	processed := make([]bool, len(d.Entries))
	for idx, current := range d.Entries {
		if processed[idx] {
			continue
		}
		processed[idx] = true
		group := []TimetableEntry{current}
		for i, entry := range d.Entries {
			if i == idx || processed[i] {
				continue
			}
			if current.StartsAt.Before(entry.EndsAt) &&
				entry.StartsAt.Before(current.EndsAt) {
				processed[i] = true
				group = append(group, entry)
			}
		}
		pairedEntries = append(pairedEntries, group)
	}
	return pairedEntries
}

func (t *Timetable) CalculateGrid() []string {
	var grid []string

	for _, day := range t.GroupByWeekday() {
		width := MaxConcurrent(day.Entries)

		if width < 1 {
			width = 1
		}

		grid = append(grid, fmt.Sprintf("%dfr", width))
	}
	return grid
}

func (t *Timetable) ColWidth() []int {
	var grid []int

	for _, day := range t.GroupByWeekday() {
		width := MaxConcurrent(day.Entries)

		if width < 1 {
			width = 1
		}

		grid = append(grid, width)
	}
	return grid
}

type TimetableDay struct {
	Date    time.Time
	Entries []TimetableEntry
}

func (d *TimetableDay) CalculateGridCols() string {
	var grid []string

	for _ = range d.MaxConcurrent() {
		grid = append(grid, "1fr")
	}

	return strings.Join(grid, " ")
}

func (d *TimetableDay) MaxConcurrent() int {
	return MaxConcurrent(d.Entries)
}

func (t *Timetable) GroupByWeekday() []TimetableDay {
	days := make([]TimetableDay, 5)

	for _, entry := range t.Entries {
		idx := (int(entry.StartsAt.Weekday()) + 6) % 7
		days[idx].Entries = append(days[idx].Entries, entry)
	}

	return days
}

func GetDimensions(file *excelize.File) (Dimensions, error) {
	dimensions, err := file.GetSheetDimension(SHEET_NAME)
	if err != nil {
		return Dimensions{}, err
	}

	parts := strings.Split(dimensions, ":")

	height, err := strconv.Atoi(parts[1][1:])
	if err != nil {
		return Dimensions{}, err
	}
	width := int(rune(parts[1][0]) - 65)

	return Dimensions{Width: width, Height: height}, nil
}

func ParseDateTime(s string) (time.Time, error) {
	return time.Parse("02.01.2006 15:04", s)
}

func ParseCourseType(s string) CourseType {
	switch s {
	case "RV":
		return RV
	case "LV":
		return LV
	case "PR":
		return PR
	}
	return PR
}

func ConvertXLS2XLSX(srcPath, dstPath string) error {
	wb, err := xls.Open(srcPath, "utf-8")
	if err != nil {
		return fmt.Errorf("open xls: %w", err)
	}

	xlsx := excelize.NewFile()

	for sheetIdx := 0; sheetIdx < wb.NumSheets(); sheetIdx++ {
		xlsSheet := wb.GetSheet(sheetIdx)
		if xlsSheet == nil {
			continue
		}

		sheetName := xlsSheet.Name

		if sheetIdx == 0 {
			xlsx.SetSheetName("Sheet1", sheetName)
		} else {
			xlsx.NewSheet(sheetName)
		}

		for rowIdx := 0; rowIdx <= int(xlsSheet.MaxRow); rowIdx++ {
			row := xlsSheet.Row(rowIdx)
			if row == nil {
				continue
			}

			for colIdx := 0; colIdx < row.LastCol(); colIdx++ {
				cell, err := excelize.CoordinatesToCellName(
					colIdx+1,
					rowIdx+1,
				)
				if err != nil {
					return err
				}

				xlsx.SetCellValue(
					sheetName,
					cell,
					row.Col(colIdx),
				)
			}
		}
	}
	return xlsx.SaveAs(dstPath)
}

func GetNumRows(f *excelize.File) (int, error) {
	idx := 7
	for true {
		cell, err := f.GetCellValue(SHEET_NAME, fmt.Sprintf("B%d", idx))
		if err != nil {
			fmt.Println(err.Error())
		}
		if len(cell) == 0 {
			return idx - 1, nil
		}
		idx++
	}
	return 0, nil
}

type TimetableEntryTime struct {
	StartsAt time.Time
	EndsAt   time.Time
}

func ParseTime(times string, date string) TimetableEntryTime {
	parts := strings.Split(times, "-")
	startsAt, err := time.Parse("02.01.2006 15:04", fmt.Sprintf("%s %s", date, parts[0]))
	if err != nil {
		fmt.Println(err.Error())
	}
	endsAt, err := time.Parse("02.01.2006 15:04", fmt.Sprintf("%s %s", date, parts[1]))
	if err != nil {
		fmt.Println(err.Error())
	}
	return TimetableEntryTime{StartsAt: startsAt, EndsAt: endsAt}
}

func (s *TimetableService) ParseTimetable(path string) (Timetable, error) {
	f, err := excelize.OpenFile(path)
	if err != nil {
		fmt.Println(err)
		return Timetable{}, err
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	rowCount, err := GetNumRows(f)

	if err != nil {
		return Timetable{}, err
	}

	lastChange, err := f.GetCellValue(SHEET_NAME, LAST_CHANGE_CELL)
	if err != nil {
		logger.Info("failed to get last change timestamp")
		return Timetable{}, err
	}
	lastChangeTimestamp, err := ParseDateTime(lastChange[18:])

	var entries []TimetableEntry

	for j := ROW_START_OFFSET; j < rowCount; j++ {
		day, err := f.GetCellValue(SHEET_NAME, fmt.Sprintf("%c%d", 'B', j))
		if err != nil {
			day = ""
		}
		date, err := f.GetCellValue(SHEET_NAME, fmt.Sprintf("%c%d", 'C', j))
		if err != nil {
			date = ""
		}
		time, err := f.GetCellValue(SHEET_NAME, fmt.Sprintf("%c%d", 'E', j))
		if err != nil {
			time = ""
		}
		location, err := f.GetCellValue(SHEET_NAME, fmt.Sprintf("%c%d", 'F', j))
		if err != nil {
			location = ""
		}
		name, err := f.GetCellValue(SHEET_NAME, fmt.Sprintf("%c%d", 'G', j))
		if err != nil {
			name = ""
		}
		group, err := f.GetCellValue(SHEET_NAME, fmt.Sprintf("%c%d", 'I', j))
		if err != nil {
			group = ""
		}
		professors, err := f.GetCellValue(SHEET_NAME, fmt.Sprintf("%c%d", 'K', j))
		if err != nil {
			professors = ""
		}

		times := ParseTime(time, date)

		class := TimetableEntry{
			Day:        day,
			StartsAt:   times.StartsAt,
			EndsAt:     times.EndsAt,
			Location:   location,
			Course:     Course{Type: ParseCourseType(name[0:2]), Name: name[3:]},
			Groups:     strings.Split(group, ", "),
			Professors: strings.Split(professors, ", "),
		}
		entries = append(entries, class)
	}
	return Timetable{
		lastChangeTimestamp,
		entries,
	}, nil
}

type Position struct {
	Col int
	Row int
}

func (e *TimetableEntry) CalculatePosition() Position {
	const (
		START_OFFSET = 6
	)

	row := (e.StartsAt.Hour() - START_OFFSET)

	return Position{Row: row, Col: 1}
}

func (e *TimetableEntry) CalculateHeight() int {
	return e.EndsAt.Hour() - e.StartsAt.Hour()
}

func (s *TimetableService) GetTimetableFile(url string) (string, error) {

	chromedpCtx, chromedpCancel := chromedp.NewContext(context.Background())
	defer chromedpCancel()

	ctx, cancel := context.WithTimeout(chromedpCtx, 45*time.Second)
	defer cancel()

	done := make(chan string, 1)
	downloadErr := make(chan error, 1)

	chromedp.ListenTarget(ctx, func(ev any) {
		switch e := ev.(type) {
		case *browser.EventDownloadProgress:
			switch e.State {
			case browser.DownloadProgressStateCompleted:
				done <- e.GUID
			case browser.DownloadProgressStateCanceled:
				downloadErr <- fmt.Errorf("download canceled by browser")
			}
		}
	})
	chromedp.WindowSize(1280, 720)

	if err := chromedp.Run(ctx,
		chromedp.EmulateViewport(1280, 720),
		chromedp.Navigate(url),
		chromedp.Click(`button[name="form:j_idt240"]`, chromedp.NodeVisible),
	); err != nil {
		return "", fmt.Errorf("Failed to navigate to url. %s", err.Error())
	}

	if err := s.captureScreenshot(ctx, "canceled"); err != nil {
		return "", fmt.Errorf("failed to take screenshot: %s", err.Error())
	}

	if err := chromedp.Run(ctx,
		browser.SetDownloadBehavior(browser.SetDownloadBehaviorBehaviorAllowAndName).
			WithDownloadPath("/tmp").
			WithEventsEnabled(true),
		chromedp.Evaluate(`
	        const _orig = mojarra.jsfcljs;
	        mojarra.jsfcljs = function(form, params, target) {
	            return _orig.call(this, form, params, '');
	        };
        `, nil),
		chromedp.WaitVisible(`button[name="form:j_idt240"]`),
		chromedp.Click(`button[name="reporstForm:j_idt748"]`, chromedp.NodeVisible),
	); err != nil && !strings.Contains(err.Error(), "net::ERR_ABORTED") {
		return "", fmt.Errorf("failed to start download: %w", err)
	}

	if err := s.captureScreenshot(ctx, "canceled"); err != nil {
		return "", fmt.Errorf("failed to take screenshot: %s", err.Error())
	}

	select {
	case guid := <-done:
		downloadedFile := filepath.Join("/tmp", guid)
		filename := filepath.Join("/tmp", fmt.Sprintf("timetable_%d.xlsx", time.Now().Nanosecond()))

		if err := ConvertXLS2XLSX(downloadedFile, filename); err != nil {
			return "", fmt.Errorf("failed to convert xls to xlsx: %w", err)
		}
		return filename, nil

	case err := <-downloadErr:
		_ = s.captureScreenshot(ctx, "error")
		return "", err
	case <-ctx.Done():
		_ = s.captureScreenshot(ctx, "canceled")
		s.logger.Warn("download canceled " + ctx.Err().Error())
		return "", ctx.Err()
	}
}

func replaceFile(src, dst, backupPath string) error {
	if err := os.Rename(dst, backupPath); err != nil {
		return err
	}
	return os.Rename(src, dst)
}

func filesAreEqual(a, b string) (bool, error) {
	ha, err := hashFile(a)
	if err != nil {
		return false, err
	}
	hb, err := hashFile(b)
	if err != nil {
		return false, err
	}
	return ha == hb, nil
}

func hashFile(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()

	h := sha256.New()
	if _, err := io.Copy(h, f); err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", h.Sum(nil)), nil
}

func (d *TimetableService) captureScreenshot(ctx context.Context, errorType string) error {
	ts := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("%s_%s.png", errorType, ts)
	screenshotPath := filepath.Join("/tmp", filename)

	var buf []byte
	if err := chromedp.Run(ctx, chromedp.FullScreenshot(&buf, 90)); err != nil {
		d.logger.Warn("failed to capture screenshot: " + err.Error())
		return err
	}
	if err := os.WriteFile(screenshotPath, buf, 0o644); err != nil {
		d.logger.Warn("failed to save screenshot: " + err.Error())
		return err
	}
	d.logger.Info("screenshot saved")
	return nil
}

var _ = cdp.NodeID(0)
var _ = network.ResourceTypeDocument
