package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"temporal-one/internal/domain"
	"temporal-one/internal/ports"
)

type TeamService struct {
	teams ports.TeamRepository
}

func NewTeamService(teams ports.TeamRepository) *TeamService {
	return &TeamService{teams: teams}
}

func (s *TeamService) Create(ctx context.Context, ownerID uuid.UUID, name, description string) (*domain.Team, error) {
	team := &domain.Team{
		ID:          uuid.New(),
		Name:        name,
		Description: description,
		OwnerID:     ownerID,
		CreatedAt:   time.Now(),
	}
	if err := s.teams.Create(ctx, team); err != nil {
		return nil, err
	}
	return s.teams.GetByID(ctx, team.ID)
}

func (s *TeamService) GetByID(ctx context.Context, id uuid.UUID) (*domain.Team, error) {
	return s.teams.GetByID(ctx, id)
}

func (s *TeamService) ListAll(ctx context.Context, limit, offset int) ([]domain.Team, error) {
	return s.teams.List(ctx, limit, offset)
}

func (s *TeamService) ListByUser(ctx context.Context, userID uuid.UUID) ([]domain.Team, error) {
	return s.teams.ListByUserID(ctx, userID)
}

func (s *TeamService) Join(ctx context.Context, teamID, userID uuid.UUID) error {
	isMember, err := s.teams.IsMember(ctx, teamID, userID)
	if err != nil {
		return err
	}
	if isMember {
		return domain.ErrAlreadyMember
	}

	member := &domain.TeamMember{
		UserID:   userID,
		TeamID:   teamID,
		Role:     "member",
		JoinedAt: time.Now(),
	}
	return s.teams.AddMember(ctx, member)
}

func (s *TeamService) Leave(ctx context.Context, teamID, userID uuid.UUID) error {
	isMember, err := s.teams.IsMember(ctx, teamID, userID)
	if err != nil {
		return err
	}
	if !isMember {
		return domain.ErrNotMember
	}
	return s.teams.RemoveMember(ctx, teamID, userID)
}
