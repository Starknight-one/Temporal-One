package http

import (
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"temporal-one/internal/ports"
)

func NewRouter(
	tokens ports.TokenProvider,
	authH *AuthHandler,
	userH *UserHandler,
	teamH *TeamHandler,
	projectH *ProjectHandler,
) *chi.Mux {
	r := chi.NewRouter()

	r.Use(CORSMiddleware)
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)

	// Public routes
	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", authH.Register)
		r.Post("/login", authH.Login)
	})

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(AuthMiddleware(tokens))

		r.Get("/api/profile", userH.GetMyProfile)
		r.Put("/api/profile", userH.UpdateMyProfile)
		r.Get("/api/users/{id}/profile", userH.GetUserProfile)

		r.Post("/api/teams", teamH.Create)
		r.Get("/api/teams", teamH.ListAll)
		r.Get("/api/teams/my", teamH.ListMyTeams)
		r.Get("/api/teams/{id}", teamH.GetByID)
		r.Post("/api/teams/{id}/join", teamH.Join)
		r.Post("/api/teams/{id}/leave", teamH.Leave)

		r.Post("/api/projects", projectH.Create)
		r.Get("/api/projects", projectH.ListAll)
		r.Get("/api/projects/{id}", projectH.GetByID)
		r.Put("/api/projects/{id}", projectH.Update)
	})

	return r
}
