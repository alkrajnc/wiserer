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
		userId := c.Request.Header.Get("X-User")
		c.Set("user_id", userId)
		c.Next()
	}
}
