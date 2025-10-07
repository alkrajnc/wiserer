package core

import (
	"context"
	"fmt"
	"os"
	"reflect"

	"github.com/jackc/pgx/v5"
)

type database struct {
	conn *pgx.Conn
}
type DBRows struct {
	pgx.Rows
}

type DBRow struct {
	pgx.Rows
}

var db database

func init() {
	var err error

	db.conn, err = pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Println("Failed to connect to database")
		os.Exit(1)
	}
}

func (db *database) Query(sql string, args ...any) (*DBRows, error) {
	rows, err := db.conn.Query(context.Background(), sql, args...)
	if err != nil {
		println(err.Error())
		return nil, err
	}
	return &DBRows{Rows: rows}, err
}

func findFieldByTag(structValue reflect.Value, columnName string) reflect.Value {
	structType := structValue.Type()
	for i := 0; i < structType.NumField(); i++ {
		field := structType.Field(i)
		if tag := field.Tag.Get("db"); tag == columnName {
			return structValue.Field(i)
		}
	}
	return reflect.Value{}
}

func (rows *DBRows) Bind(dest any) error {

	if rows.Rows == nil {
		return fmt.Errorf("rows is null")
	}

	destValue := reflect.ValueOf(dest)
	if destValue.Kind() != reflect.Pointer {
		return fmt.Errorf("dest must be a pointer")
	}

	destElem := destValue.Elem()
	if destElem.Kind() != reflect.Slice {
		return fmt.Errorf("dest must be a pointer to a slice")
	}

	elemType := destElem.Type().Elem()
	fmt.Println(elemType)
	sliceValue := destValue.Elem()

	columns := rows.Rows.FieldDescriptions()
	for rows.Rows.Next() {
		newElem := reflect.New(elemType).Elem()

		scanTargets := make([]any, len(columns))
		for i, col := range columns {
			field := findFieldByTag(newElem, string(col.Name))
			if field.IsValid() && field.CanSet() {
				scanTargets[i] = field.Addr().Interface()
			} else {
				var placeholder any
				scanTargets[i] = &placeholder
			}
		}

		if err := rows.Rows.Scan(scanTargets...); err != nil {
			return err
		}

		sliceValue.Set(reflect.Append(sliceValue, newElem))
	}

	return rows.Rows.Err()
}

func (db *database) Exec(sql string, args ...any) error {
	_, err := db.conn.Exec(context.Background(), sql, args)
	return err
}
