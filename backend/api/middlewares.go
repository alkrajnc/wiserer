package api

import (
	"github.com/gin-gonic/gin"
)

func authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		/* authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": true, "message": "No authorization provided."})
			c.Abort()
			return
		} */
		c.Set("user_id", "0199bf31-1db0-75b4-a8c8-e2276fb25634")
		c.Next()
	}
}
