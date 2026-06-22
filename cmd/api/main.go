package main

import (
	"alkrajnc/wiserer/cmd/web"
	internalHttp "alkrajnc/wiserer/internal/http"
	"alkrajnc/wiserer/internal/service"
	"alkrajnc/wiserer/pkg/config"
	"alkrajnc/wiserer/pkg/logger"
	pkg "alkrajnc/wiserer/pkg/tools"
	"context"
	"errors"
	"fmt"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"net/http"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {

	pkg.BundleTypescript()

	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("config: %w", err)
	}

	log, err := logger.New(cfg.Log.Level, cfg.Log.JSON)
	if err != nil {
		return fmt.Errorf("logger: %w", err)
	}
	defer log.Sync() //nolint:errcheck

	ctx := context.Background()
	/* db, err := database.New(ctx, cfg.Database)
	if err != nil {
		return fmt.Errorf("database: %w", err)
	}
	defer db.Close() */
	log.Info("database connected")

	timetableService := service.NewTimetableService(log, cfg)
	timetableHandler := internalHttp.NewTimetableHandler(log, timetableService, cfg)
	webHandler := web.NewWebHandler(log, timetableService, cfg)

	router := internalHttp.NewRouter(log, *timetableHandler, *webHandler)

	addr := fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)
	srv := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
		BaseContext:  func(net.Listener) context.Context { return ctx },
	}

	shutdownCh := make(chan error, 1)
	go func() {
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		sig := <-quit
		log.Info("shutdown signal received", zap.String("signal", sig.String()))

		shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		shutdownCh <- srv.Shutdown(shutdownCtx)
	}()

	log.Info("server starting", zap.String("addr", addr))
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return fmt.Errorf("server: %w", err)
	}

	if err := <-shutdownCh; err != nil {
		return fmt.Errorf("graceful shutdown: %w", err)
	}

	log.Info("server stopped")
	return nil
}
