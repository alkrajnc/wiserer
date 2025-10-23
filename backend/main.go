package main

import (
	"fmt"
	"log"
	"os"
	"wiserer-backend/api"
	"wiserer-backend/core"

	"github.com/joho/godotenv"
)

func main() {

	if loadErr := godotenv.Load(); loadErr != nil {
		log.Printf("Warning: Error loading .env file: %v", loadErr)
		fmt.Println(os.Getenv("DATABASE_URL"))
	}

	core.DBInit()
	fmt.Println("var: ", os.Getenv("DATABASE_URL"))
	router := api.NewRouter()
	router.Run()
}
