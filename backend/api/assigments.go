package api

import (
	"net/http"
	"wiserer-backend/core"

	"github.com/gin-gonic/gin"
)

func bindAssigmentsApi(rg *gin.RouterGroup) {
	subGroup := rg.Group("/assigments")
	subGroup.GET("", listAssigments)
}

func listAssigments(c *gin.Context) {
	userId := c.GetString("user_id")
	if userId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": true, "message": "Invalid user id"})
		return
	}

	assignments, err := core.GetAssignments(userId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": true, "message": "Something went wrong. Please try again later."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"error": false, "message": "Fetched assigments for user", "assignments": assignments})
}
