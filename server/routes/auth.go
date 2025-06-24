package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/tushargr0ver/task-forge/server/controllers"
)

func AuthRoutes() chi.Router {
	r := chi.NewRouter()

	r.Post("/register", controllers.Register)
	r.Post("/login", controllers.Login)

	return r
	
}