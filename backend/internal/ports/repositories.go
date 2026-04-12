package ports

import (
	"context"

	"github.com/google/uuid"
	"temporal-one/internal/domain"
)

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
}

type ProfileRepository interface {
	Create(ctx context.Context, profile *domain.Profile) error
	GetByUserID(ctx context.Context, userID uuid.UUID) (*domain.Profile, error)
	Update(ctx context.Context, profile *domain.Profile) error
}

type TeamRepository interface {
	Create(ctx context.Context, team *domain.Team) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Team, error)
	List(ctx context.Context, limit, offset int) ([]domain.Team, error)
	ListByUserID(ctx context.Context, userID uuid.UUID) ([]domain.Team, error)
	AddMember(ctx context.Context, member *domain.TeamMember) error
	RemoveMember(ctx context.Context, teamID, userID uuid.UUID) error
	IsMember(ctx context.Context, teamID, userID uuid.UUID) (bool, error)
}

type ProjectRepository interface {
	Create(ctx context.Context, project *domain.Project) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Project, error)
	List(ctx context.Context, limit, offset int) ([]domain.Project, error)
	ListByTeamID(ctx context.Context, teamID uuid.UUID) ([]domain.Project, error)
	Update(ctx context.Context, project *domain.Project) error
}
