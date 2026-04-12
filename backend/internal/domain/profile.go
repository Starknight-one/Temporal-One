package domain

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	Name        string
	Bio         string
	Skills      []string
	Experience  string
	GitHubURL   string
	LinkedInURL string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
