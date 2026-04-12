package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"temporal-one/internal/domain"
	"temporal-one/internal/ports"
)

type ProjectService struct {
	projects ports.ProjectRepository
}

func NewProjectService(projects ports.ProjectRepository) *ProjectService {
	return &ProjectService{projects: projects}
}

func (s *ProjectService) Create(ctx context.Context, teamID uuid.UUID, title, description string) (*domain.Project, error) {
	now := time.Now()
	project := &domain.Project{
		ID:          uuid.New(),
		TeamID:      teamID,
		Title:       title,
		Description: description,
		Status:      "idea",
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	if err := s.projects.Create(ctx, project); err != nil {
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) GetByID(ctx context.Context, id uuid.UUID) (*domain.Project, error) {
	return s.projects.GetByID(ctx, id)
}

func (s *ProjectService) ListAll(ctx context.Context, limit, offset int) ([]domain.Project, error) {
	return s.projects.List(ctx, limit, offset)
}

func (s *ProjectService) Update(ctx context.Context, project *domain.Project) error {
	return s.projects.Update(ctx, project)
}
