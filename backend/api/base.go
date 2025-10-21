package api

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	router := gin.Default()

	router.SetTrustedProxies([]string{})
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "X-Api-Key", "X-User"},
		ExposeHeaders:    []string{"Content-Length", "Authorization", "X-Api-Key", "X-User"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	apiRoute := router.Group("/api")

	bindTimetableApi(apiRoute)
	bindAuthApi(apiRoute)
	bindAssigmentsApi(apiRoute)
	bindSubjectsApi(apiRoute)

	return router
}
