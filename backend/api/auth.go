package api

import "github.com/gin-gonic/gin"

func bindAuthApi(rg *gin.RouterGroup) {
	subGroup := rg.Group("/auth")

	subGroup.GET("/login", getTimetable)
}
