package domain

import (
	"time"

	"github.com/google/uuid"
)

type Project struct {
	ID          uuid.UUID
	TeamID      uuid.UUID
	Title       string
	Description string
	Status      string // "idea", "active", "paused"
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
