package core

type Test struct {
	Second string  `db:"value2"`
	First  float32 `db:"value1"`
	Id     string  `db:"id"`
}

func ListTimetable() (*[]Test, error) {
	rows, err := db.Query("SELECT * FROM test")
	if err != nil {
		return nil, err
	}
	var data []Test
	err = rows.Bind(&data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}
