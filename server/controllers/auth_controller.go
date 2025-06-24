package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/tushargr0ver/task-forge/server/database"
	"github.com/tushargr0ver/task-forge/server/models"
	"golang.org/x/crypto/bcrypt"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error securing password", http.StatusInternalServerError)
		return
	}

	stmt := `INSERT INTO users (name, email, password) VALUES (?,?,?)`
	result, err := database.DB.Exec(stmt, input.Name, input.Email, string(hash))

	if err != nil {
		http.Error(w, "Email already in use or DB error", http.StatusConflict)
		log.Println("DB Error:", err)
		return
	}

	id, _ := result.LastInsertId()

	//return token here later
	user := models.User{
		ID:           id,
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: "",
	}
	w.Header().Set("Content Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var input struct{
		Email string `json:"email"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&input)
	if err!=nil{
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	var user models.User
	row := database.DB.QueryRow("SELECT id, name, email, password FROM users WHERE email =?", input.Email)
	err = row.Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash)
	if err!=nil{
		if err==sql.ErrNoRows{
			http.Error(w, "Email not found", http.StatusUnauthorized)
		}else{
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password))
	if err!=nil{
		http.Error(w, "Incorrect password", http.StatusUnauthorized)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // expires in 24h
	})

	secret := []byte("mysecretkey")
	tokenString, err := token.SignedString(secret)
	if err!=nil{
		http.Error(w, "Failed to create token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}
