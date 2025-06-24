package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

// ConnectDB opens the SQLite database and runs setup
func ConnectDB() {
	var err error
	DB, err = sql.Open("sqlite", "taskforge.db")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Optional: check connection
	err = DB.Ping()
	if err != nil {
		log.Fatal("Database ping failed:", err)
	}

	log.Println("SQLite database connected.")

	createUsersTable()
	createTasksTable()
}

// Auto-create the users table if not exists
func createUsersTable() {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);
	`

	_, err := DB.Exec(query)
	if err != nil {
		log.Fatal("Failed to create users table:", err)
	}

	log.Println("Users table checked/created.")
}

func createTasksTable(){
	query := `
	CREATE TABLE IF NOT EXISTS tasks(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		description TEXT,
		status TEXT DEFAULT 'todo',
		due_date TEXT,
		user_id INTEGER NOT NULL,
		FOREIGN KEY (user_id) REFERENCES users(id)
	);
	`

	_,err:=DB.Exec(query)
	if err!=nil{
		log.Fatal("Failed to create tasks table:", err)
	}

	log.Println("Tasks table checked/created.")
}
