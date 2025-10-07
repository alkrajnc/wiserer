package api

import "github.com/gin-gonic/gin"

func NewRouter() *gin.Engine {
	router := gin.Default()
	apiRoute := router.Group("/api")

	bindTimetableApi(apiRoute)
	bindAuthApi(apiRoute)
	bindAssigmentsApi(apiRoute)

	return router
}
