package core

import (
	"time"

	"github.com/google/uuid"
)

type Assignment struct {
	Id          string    `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Deadline    time.Time `json:"deadline" db:"deadline"`
	Subject     string    `json:"subject" db:"subject"`
	Status      string    `json:"status" db:"status"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UserId      string    `json:"user_id" db:"user_id"`
	Description string    `json:"description" db:"description"`
}

type NewAssigment struct {
	Title    string    `json:"title" db:"title"`
	Deadline time.Time `json:"deadline" db:"deadline"`
	Subject  string    `json:"subject" db:"subject"`
	Status   string    `json:"status" db:"status"`
	UserId   string    `json:"user_id" db:"user_id"`
}

func CreateAssignment(assigment NewAssigment) error {
	id, err := uuid.NewV7()
	if err != nil {
		return err
	}
	err = db.Exec("INSERT INTO assignments(id, title, deadline, subject, status, user_id) VALUES($1, $2, $3, $4, $5, $6)", id.String(), assigment.Title, assigment.Deadline, assigment.Subject, assigment.Status, assigment.UserId)
	if err != nil {
		return err
	}
	return nil
}

func GetAssignments(userId string) (*[]Assignment, error) {
	var assigments []Assignment
	rows, err := db.Query("SELECT assignments.*, subjects.carrier, assigment_status.status FROM public.assignments INNER JOIN subjects ON subjects.name = assignments.subject INNER JOIN assigment_status ON assigment_status.id = assignments.status WHERE user_id = $1", userId)
	if err != nil {
		return nil, err
	}
	err = rows.Bind(&assigments)
	if err != nil {
		return nil, err
	}
	return &assigments, nil
}
