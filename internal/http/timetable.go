package http

import (
	"alkrajnc/wiserer/internal/service"
	"alkrajnc/wiserer/pkg/config"
	"alkrajnc/wiserer/pkg/response"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

var courses = map[string]string{
	"RIT": "",
}

type TimetableHandler struct {
	Logger  *zap.Logger
	Service service.TimetableService
	Config  *config.Config
}

func NewTimetableHandler(logger *zap.Logger, service service.TimetableService, cfg *config.Config) *TimetableHandler {
	return &TimetableHandler{Logger: logger, Service: service, Config: cfg}
}

func (h *TimetableHandler) RegisterRoutes(r chi.Router) {
	r.Route("/timetable", func(r chi.Router) {
		r.Get("/", h.SemesterTimetable)
	})
}

func (h *TimetableHandler) SemesterTimetable(w http.ResponseWriter, r *http.Request) {

	q := r.URL.Query()

	program, err := url.QueryUnescape(q.Get("program"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Failed in parsing program query")
		return
	}
	if len(program) == 0 {
		response.Error(w, http.StatusBadRequest, "Missing program in query")
		return
	}
	year, err := strconv.Atoi(q.Get("year"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid year parameter")
	}

	path, err := h.Service.GetTimetableFile(program, year)

	if err != nil {
		h.Logger.Error(err.Error())
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to get timetable file: %s", err.Error()))
		return
	}

	timetable, err := h.Service.ParseTimetable(path)

	if err != nil {
		h.Logger.Error(err.Error())
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to parse timetable: %s", err.Error()))
		return
	}

	response.JSON(w, http.StatusCreated, timetable)
}
