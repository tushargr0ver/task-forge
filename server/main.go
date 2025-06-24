package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
	"github.com/tushargr0ver/task-forge/server/database"
	"github.com/tushargr0ver/task-forge/server/routes"
)

func main() {

	database.ConnectDB()

	r := chi.NewRouter()

	r.Use(cors.Default().Handler)

	r.Get("/api/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	r.Mount("/api/tasks", routes.TaskRoutes())
	r.Mount("/api/auth", routes.AuthRoutes())

	log.Println("Server is running at port 8000")
	http.ListenAndServe(":8000", r)
}
