package api

import (
	"net/http"
	"wiserer-backend/core"

	"github.com/gin-gonic/gin"
)

func bindSubjectsApi(rg *gin.RouterGroup) {
	subGroup := rg.Group("/subjects")
	subGroup.Use(authentication())
	subGroup.GET("", listSubjects)
	subGroup.POST("", createAssigment)
}

func listSubjects(c *gin.Context) {
	subjects, err := core.GetSubjects()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": true, "message": "Something went wrong. Please try again later."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Fetched assigments for user", "data": subjects})
}
