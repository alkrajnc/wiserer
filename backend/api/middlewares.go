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
		c.Set("user_id", "7bae10a4-8993-48ca-b41d-997917898031")
		c.Next()
	}
}
