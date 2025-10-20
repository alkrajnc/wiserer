package core

type Subject struct {
	Name    string `json:"name" db:"name"`
	Carrier string `json:"carrier" db:"carrier"`
}

func GetSubjects() (*[]Subject, error) {
	var subjects []Subject
	rows, err := db.Query("SELECT * FROM subjects")
	if err != nil {
		return nil, err
	}
	err = rows.Bind(&subjects)
	if err != nil {
		return nil, err
	}
	return &subjects, nil
}
