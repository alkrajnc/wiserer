package api

import (
	"net/http"
	"wiserer-backend/core"

	"github.com/gin-gonic/gin"
)

func bindTimetableApi(rg *gin.RouterGroup) {
	subGroup := rg.Group("/timetable")

	subGroup.GET("", getTimetable)
}

func getTimetable(c *gin.Context) {
	data, err := core.ListTimetable()
	if err != nil {
		println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"error": false, "data": data})
}
