package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/tushargr0ver/task-forge/server/database"
	"github.com/tushargr0ver/task-forge/server/middlewares"
	"github.com/tushargr0ver/task-forge/server/models"
)

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(int64)

	rows, err := database.DB.Query("SELECT id,title,description,status,due_date,user_id FROM tasks WHERE user_id = ?", userID)
	if err != nil {
		http.Error(w, "Failed to fetch tasks", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var t models.Task
		err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Status, &t.DueDate, &t.UserId)

		if err != nil {
			http.Error(w, "Error reading task", http.StatusInternalServerError)
			return
		}
		tasks = append(tasks, t)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(int64)
	var input models.Task
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	stmt := `INSERT INTO tasks (title, description, status, due_date, user_id)
			 VALUES(?,?,?,?,?)`
	result, err := database.DB.Exec(stmt, input.Title, input.Description, input.Status, input.DueDate, userID)
	if err != nil {
		http.Error(w, "Failed to create task", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	input.ID = id
	input.UserId = userID

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(input)
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(int64)
	id := chi.URLParam(r, "id")
	var input models.Task
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusInternalServerError)
	}
	stmt := `UPDATE tasks
			 SET title = ?, description = ?, status = ?, due_date = ?
			 WHERE id = ? AND user_id = ?`
	result, err := database.DB.Exec(stmt, input.Title, input.Description, input.Status, input.DueDate, id, userID)
	if err != nil {
		http.Error(w, "Failed to update task", http.StatusInternalServerError)
		return
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "No task found or unauthorized", http.StatusForbidden)
		return
	}
	input.UserId = userID

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(input)
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(int64)
	id := chi.URLParam(r, "id")
	stmt := `DELETE FROM tasks WHERE id = ? AND user_id = ?`
	result, err := database.DB.Exec(stmt, id, userID)
	if err != nil {
		http.Error(w, "Failed to delete task", http.StatusInternalServerError)
		return
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "No task found or unauthorized", http.StatusForbidden)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
