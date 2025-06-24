package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/tushargr0ver/task-forge/server/controllers"
	"github.com/tushargr0ver/task-forge/server/middlewares"
)

func TaskRoutes() chi.Router {
	r := chi.NewRouter()

	r.Use(middlewares.JWTMiddleware("mysecretkey"))

	r.Get("/", controllers.GetAllTasks)
	r.Post("/", controllers.CreateTask)
	r.Put("/{id}", controllers.UpdateTask)
	r.Delete("/{id}", controllers.DeleteTask)

	return r
}
