package http

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"temporal-one/internal/domain"
	"temporal-one/internal/ports"
)

type TeamHandler struct {
	teams ports.TeamService
}

func NewTeamHandler(teams ports.TeamService) *TeamHandler {
	return &TeamHandler{teams: teams}
}

func (h *TeamHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFromContext(r.Context())

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Name == "" {
		writeError(w, http.StatusBadRequest, "name is required")
		return
	}

	team, err := h.teams.Create(r.Context(), userID, req.Name, req.Description)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusCreated, team)
}

func (h *TeamHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid team id")
		return
	}

	team, err := h.teams.GetByID(r.Context(), id)
	if errors.Is(err, domain.ErrTeamNotFound) {
		writeError(w, http.StatusNotFound, "team not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, team)
}

func (h *TeamHandler) ListAll(w http.ResponseWriter, r *http.Request) {
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	teams, err := h.teams.ListAll(r.Context(), limit, offset)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}
	if teams == nil {
		teams = []domain.Team{}
	}

	writeJSON(w, http.StatusOK, teams)
}

func (h *TeamHandler) ListMyTeams(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFromContext(r.Context())

	teams, err := h.teams.ListByUser(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}
	if teams == nil {
		teams = []domain.Team{}
	}

	writeJSON(w, http.StatusOK, teams)
}

func (h *TeamHandler) Join(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFromContext(r.Context())
	teamID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid team id")
		return
	}

	err = h.teams.Join(r.Context(), teamID, userID)
	if errors.Is(err, domain.ErrAlreadyMember) {
		writeError(w, http.StatusConflict, "already a member")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": "joined"})
}

func (h *TeamHandler) Leave(w http.ResponseWriter, r *http.Request) {
	userID := UserIDFromContext(r.Context())
	teamID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid team id")
		return
	}

	err = h.teams.Leave(r.Context(), teamID, userID)
	if errors.Is(err, domain.ErrNotMember) {
		writeError(w, http.StatusConflict, "not a member")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": "left"})
}
