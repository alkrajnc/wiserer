package main

import (
	"log"
	"wiserer-backend/api"

	"github.com/joho/godotenv"
)

func main() {

	if loadErr := godotenv.Load(); loadErr != nil {
		log.Printf("Warning: Error loading .env file: %v", loadErr)
	}

	router := api.NewRouter()
	router.Run()
}
