package http

import (
	"alkrajnc/wiserer/cmd/web"
	"alkrajnc/wiserer/internal/service"
	"alkrajnc/wiserer/pkg/config"
	"alkrajnc/wiserer/pkg/response"
	"fmt"
	"log"
	"net/http"
	"time"

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
		r.Get("/week", h.WeeklyTimetable)
	})
}

func (h *TimetableHandler) WeeklyTimetable(w http.ResponseWriter, r *http.Request) {

	timetable, err := h.Service.ParseTimetable("/home/aljaz/Downloads/timetable_495468531.xlsx")

	if err != nil {
		h.Logger.Error(err.Error())
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to parse timetable: %s", err.Error()))
		return
	}

	var data []service.TimetableEntry = timetable.Entries[14:37]
	timetable = service.Timetable{LastChange: time.Now(), Entries: data}

	component := web.Timetable(1, service.Timetable{LastChange: time.Now(), Entries: data})
	err = component.Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Fatalf("Error rendering in HelloWebHandler: %e", err)
	}

}

func (h *TimetableHandler) SemesterTimetable(w http.ResponseWriter, r *http.Request) {
	url := h.Config.Variables.WiseBaseURL + "/index.jsp?filterId=0;46;0;0;"

	path, err := h.Service.GetTimetableFile(url)

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
