package web

import (
	"alkrajnc/wiserer/internal/service"
	"alkrajnc/wiserer/pkg/config"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

type WebHandler struct {
	Logger  *zap.Logger
	Service service.TimetableService
	Config  *config.Config
}

func NewWebHandler(logger *zap.Logger, service service.TimetableService, cfg *config.Config) *WebHandler {
	return &WebHandler{Logger: logger, Service: service, Config: cfg}
}
func (h *WebHandler) RegisterRoutes(r chi.Router) {
	r.Route("/timetable", func(r chi.Router) {
		r.Get("/week/{week}", h.BaseRoute)
	})
}

func (h *WebHandler) BaseRoute(w http.ResponseWriter, r *http.Request) {
	_, week := time.Now().ISOWeek()
	weekParam := r.PathValue("week")

	if len(weekParam) > 0 {
		val, err := strconv.Atoi(weekParam)
		if err != nil {
			h.Logger.Error(fmt.Sprintf("Failed to parse week(%s)", err.Error()))
		}
		week = val
	}

	program := r.URL.Query().Get("program")

	fmt.Println(program)

	timetable, err := h.Service.ParseTimetable("/home/aljaz/Documents/wiserer/timetable_610441721.xlsx")

	data := timetable.FilterByWeek(week)

	component := Timetable(week, service.Timetable{LastChange: time.Now(), Entries: data.Entries})
	err = component.Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		h.Logger.Error(fmt.Sprintf("Error rendering in HelloWebHandler: %e", err))
	}
}
