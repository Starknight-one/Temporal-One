package http

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"temporal-one/internal/domain"
	"temporal-one/internal/ports"
)

type UserHandler struct {
	users ports.UserService
}

func NewUserHandler(users ports.UserService) *UserHandler {
	return &UserHandler{users: users}
}

type profileResponse struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id"`
	Name        string    `json:"name"`
	Bio         string    `json:"bio"`
	Skills      []string  `json:"skills"`
	Experience  string    `json:"experience"`
	GitHubURL   string    `json:"github_url"`
	LinkedInURL string    `json:"linkedin_url"`
}

func toProfileResponse(p *domain.Profile) profileResponse {
	skills := p.Skills
	if skills == nil {
		skills = []string{}
	}
	return profileResponse{
		ID:          p.ID,
		UserID:      p.UserID,
		Name:        p.Name,
		Bio:         p.Bio,
		Skills:      skills,
		Experience:  p.Experience,
		GitHubURL:   p.GitHubURL,
		LinkedInURL: p.LinkedInURL,
	}
}

func (h *UserHandler) GetMyProfile(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFromContext(r.Context())

	profile, err := h.users.GetProfile(r.Context(), userID)
	if errors.Is(err, domain.ErrProfileNotFound) {
		writeError(w, http.StatusNotFound, "profile not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, toProfileResponse(profile))
}

func (h *UserHandler) UpdateMyProfile(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFromContext(r.Context())

	var req struct {
		Name        string   `json:"name"`
		Bio         string   `json:"bio"`
		Skills      []string `json:"skills"`
		Experience  string   `json:"experience"`
		GitHubURL   string   `json:"github_url"`
		LinkedInURL string   `json:"linkedin_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	profile := &domain.Profile{
		Name:        req.Name,
		Bio:         req.Bio,
		Skills:      req.Skills,
		Experience:  req.Experience,
		GitHubURL:   req.GitHubURL,
		LinkedInURL: req.LinkedInURL,
	}

	if err := h.users.UpdateProfile(r.Context(), userID, profile); err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	updated, _ := h.users.GetProfile(r.Context(), userID)
	writeJSON(w, http.StatusOK, toProfileResponse(updated))
}

func (h *UserHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid user id")
		return
	}

	profile, err := h.users.GetProfileByUserID(r.Context(), id)
	if errors.Is(err, domain.ErrProfileNotFound) {
		writeError(w, http.StatusNotFound, "profile not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, toProfileResponse(profile))
}
