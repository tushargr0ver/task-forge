package models

type Task struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	DueDate     string `json:"due_date"`
	UserId      int64  `json:"user_id"`
}
