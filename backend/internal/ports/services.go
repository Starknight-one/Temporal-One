package ports

import (
	"context"

	"github.com/google/uuid"
	"temporal-one/internal/domain"
)

type AuthService interface {
	Register(ctx context.Context, email, password string) (token string, err error)
	Login(ctx context.Context, email, password string) (token string, err error)
}

type TokenProvider interface {
	Generate(userID uuid.UUID) (string, error)
	Validate(token string) (uuid.UUID, error)
}

type UserService interface {
	GetProfile(ctx context.Context, userID uuid.UUID) (*domain.Profile, error)
	UpdateProfile(ctx context.Context, userID uuid.UUID, profile *domain.Profile) error
	GetProfileByUserID(ctx context.Context, userID uuid.UUID) (*domain.Profile, error)
}

type TeamService interface {
	Create(ctx context.Context, ownerID uuid.UUID, name, description string) (*domain.Team, error)
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Team, error)
	ListAll(ctx context.Context, limit, offset int) ([]domain.Team, error)
	ListByUser(ctx context.Context, userID uuid.UUID) ([]domain.Team, error)
	Join(ctx context.Context, teamID, userID uuid.UUID) error
	Leave(ctx context.Context, teamID, userID uuid.UUID) error
}

type ProjectService interface {
	Create(ctx context.Context, teamID uuid.UUID, title, description string) (*domain.Project, error)
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Project, error)
	ListAll(ctx context.Context, limit, offset int) ([]domain.Project, error)
	Update(ctx context.Context, project *domain.Project) error
}
