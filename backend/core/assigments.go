package core

import "time"

type Assignment struct {
	Id        string    `json:"id" db:"id"`
	Title     string    `json:"title" db:"title"`
	Deadline  time.Time `json:"deadline" db:"deadline"`
	Subject   string    `json:"subject" db:"subject"`
	Status    string    `json:"status" db:"status"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UserId    string    `json:"user_id" db:"user_id"`
}

func CreateAssignment(assigment Assignment) error {
	err := db.Exec("INSERT INTO assignments(id, title, deadline, subject, status) VALUES($1, $2, $3, $4, $5)")
	if err != nil {
		return err
	}
	return nil
}

func GetAssignments(userId string) (*[]Assignment, error) {
	var assigments []Assignment
	rows, err := db.Query("SELECT * FROM assignments WHERE user_id = $1", userId)
	if err != nil {
		return nil, err
	}
	err = rows.Bind(&assigments)
	if err != nil {
		return nil, err
	}
	return &assigments, nil
}
