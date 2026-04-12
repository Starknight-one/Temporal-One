package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"temporal-one/internal/adapters/auth"
	adapthttp "temporal-one/internal/adapters/http"
	"temporal-one/internal/adapters/postgres"
	"temporal-one/internal/services"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	ctx := context.Background()

	// Config from env
	dbCfg := postgres.Config{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "temporal"),
		Password: getEnv("DB_PASSWORD", "temporal"),
		DBName:   getEnv("DB_NAME", "temporalone"),
	}
	jwtSecret := getEnv("JWT_SECRET", "dev-secret-change-in-prod")
	serverPort := getEnv("SERVER_PORT", "8080")

	// Run migrations
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		dbCfg.User, dbCfg.Password, dbCfg.Host, dbCfg.Port, dbCfg.DBName)
	m, err := migrate.New("file://migrations", dsn)
	if err != nil {
		log.Fatalf("migrate init: %v", err)
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("migrate up: %v", err)
	}

	// Database
	pool, err := postgres.NewPool(ctx, dbCfg)
	if err != nil {
		log.Fatalf("db connect: %v", err)
	}
	defer pool.Close()

	// Repos
	userRepo := postgres.NewUserRepo(pool)
	profileRepo := postgres.NewProfileRepo(pool)
	teamRepo := postgres.NewTeamRepo(pool)
	projectRepo := postgres.NewProjectRepo(pool)

	// Auth
	jwtProvider := auth.NewJWTProvider(jwtSecret, 24*time.Hour)

	// Services
	authSvc := services.NewAuthService(userRepo, profileRepo, jwtProvider)
	userSvc := services.NewUserService(profileRepo)
	teamSvc := services.NewTeamService(teamRepo)
	projectSvc := services.NewProjectService(projectRepo)

	// Handlers
	authHandler := adapthttp.NewAuthHandler(authSvc)
	userHandler := adapthttp.NewUserHandler(userSvc)
	teamHandler := adapthttp.NewTeamHandler(teamSvc)
	projectHandler := adapthttp.NewProjectHandler(projectSvc)

	// Router
	router := adapthttp.NewRouter(jwtProvider, authHandler, userHandler, teamHandler, projectHandler)

	// Server
	srv := &http.Server{
		Addr:    ":" + serverPort,
		Handler: router,
	}

	// Graceful shutdown
	go func() {
		log.Printf("server starting on :%s", serverPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("shutting down...")
	shutdownCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("shutdown: %v", err)
	}
	log.Println("server stopped")
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
