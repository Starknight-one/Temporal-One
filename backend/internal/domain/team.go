package domain

import (
	"time"

	"github.com/google/uuid"
)

type Team struct {
	ID          uuid.UUID
	Name        string
	Description string
	OwnerID     uuid.UUID
	Members     []TeamMember
	CreatedAt   time.Time
}

type TeamMember struct {
	UserID   uuid.UUID
	TeamID   uuid.UUID
	Role     string // "owner", "member"
	JoinedAt time.Time
}
