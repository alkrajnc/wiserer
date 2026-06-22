package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Variables struct {
	WiseBaseURL           string
	SheetName             string
	LastChangeCell        string
	RowStartOffset        int
	IzpisButtonQuery      string
	DateRangeStartInputId string
	DateRangeEndInputId   string
	DownloadButtonQuery   string
}

type Selectors struct {
	ProgramSelectDropdown  string
	ProgramSelectContainer string
	ProgramURLInput        string
	ProgramURLButton       string
}

type Config struct {
	Server    ServerConfig
	Database  DatabaseConfig
	Log       LogConfig
	Variables Variables
	Selectors Selectors
}

type ServerConfig struct {
	Host         string
	Port         int
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

type DatabaseConfig struct {
	DSN             string
	MaxConns        int32
	MinConns        int32
	MaxConnLifetime time.Duration
	MaxConnIdleTime time.Duration
}

type LogConfig struct {
	Level string // debug | info | warn | error
	JSON  bool
}

func Load() (*Config, error) {
	dbDSN := os.Getenv("DATABASE_URL")
	if dbDSN == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	return &Config{
		Server: ServerConfig{
			Host:         env("SERVER_HOST", "0.0.0.0"),
			Port:         envInt("SERVER_PORT", 8080),
			ReadTimeout:  envDuration("SERVER_READ_TIMEOUT", 10*time.Second),
			WriteTimeout: envDuration("SERVER_WRITE_TIMEOUT", 30*time.Second),
			IdleTimeout:  envDuration("SERVER_IDLE_TIMEOUT", 60*time.Second),
		},
		Database: DatabaseConfig{
			DSN:             dbDSN,
			MaxConns:        int32(envInt("DB_MAX_CONNS", 25)),
			MinConns:        int32(envInt("DB_MIN_CONNS", 5)),
			MaxConnLifetime: envDuration("DB_MAX_CONN_LIFETIME", 30*time.Minute),
			MaxConnIdleTime: envDuration("DB_MAX_CONN_IDLE_TIME", 5*time.Minute),
		},
		Log: LogConfig{
			Level: env("LOG_LEVEL", "info"),
			JSON:  envBool("LOG_JSON", false),
		},
		Variables: Variables{
			WiseBaseURL:           env("WISE_BASE_URL", "https://www.wise-tt.com/wtt_um_feri"),
			SheetName:             env("SHEET_NAME", "anualReportSubject"),
			RowStartOffset:        int(envInt("ROW_START_OFFSET", 7)),
			LastChangeCell:        env("LAST_CHANGE_CELL", "K1"),
			IzpisButtonQuery:      env("IZPIS_BUTTON", "form:j_idt240"),
			DateRangeStartInputId: env("DATE_RANGE_START_INPUT", "#reporstForm:reportDateFrom_input"),
			DateRangeEndInputId:   env("DATE_RANGE_END_INPUT", "#reporstForm:reportDateTo_input"),
			DownloadButtonQuery:   env("DOWNLOAD_BUTTON", "#reporstForm:j_idt748"),
		},
		Selectors: Selectors{
			ProgramSelectDropdown:  env("PROGRAM_SELECT_CONTAINER", "#form:j_idt176_items"),
			ProgramSelectContainer: env("PROGRAM_SELECT_CONTAINER", "#form:j_idt176_items"),
			ProgramURLInput:        env("PROGRAM_URL_INPUT", "#createLinkForm:j_idt968"),
			ProgramURLButton:       env("PROGRAM_URL_BUTTON", "#form:j_idt164"),
		},
	}, nil
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func envInt(key string, fallback int) int {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return fallback
	}
	return n
}

func envBool(key string, fallback bool) bool {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return fallback
	}
	return b
}

func envDuration(key string, fallback time.Duration) time.Duration {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	d, err := time.ParseDuration(v)
	if err != nil {
		return fallback
	}
	return d
}
