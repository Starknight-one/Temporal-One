package postgres

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"temporal-one/internal/domain"
)

type ProjectRepo struct {
	db *pgxpool.Pool
}

func NewProjectRepo(db *pgxpool.Pool) *ProjectRepo {
	return &ProjectRepo{db: db}
}

func (r *ProjectRepo) Create(ctx context.Context, project *domain.Project) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO projects (id, team_id, title, description, status, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		project.ID, project.TeamID, project.Title, project.Description,
		project.Status, project.CreatedAt, project.UpdatedAt)
	return err
}

func (r *ProjectRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Project, error) {
	p := &domain.Project{}
	err := r.db.QueryRow(ctx,
		`SELECT id, team_id, title, description, status, created_at, updated_at
		 FROM projects WHERE id = $1`, id).
		Scan(&p.ID, &p.TeamID, &p.Title, &p.Description, &p.Status, &p.CreatedAt, &p.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrProjectNotFound
	}
	return p, err
}

func (r *ProjectRepo) List(ctx context.Context, limit, offset int) ([]domain.Project, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, team_id, title, description, status, created_at, updated_at
		 FROM projects ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
		limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []domain.Project
	for rows.Next() {
		var p domain.Project
		if err := rows.Scan(&p.ID, &p.TeamID, &p.Title, &p.Description, &p.Status, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, rows.Err()
}

func (r *ProjectRepo) ListByTeamID(ctx context.Context, teamID uuid.UUID) ([]domain.Project, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, team_id, title, description, status, created_at, updated_at
		 FROM projects WHERE team_id = $1 ORDER BY created_at DESC`, teamID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []domain.Project
	for rows.Next() {
		var p domain.Project
		if err := rows.Scan(&p.ID, &p.TeamID, &p.Title, &p.Description, &p.Status, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, rows.Err()
}

func (r *ProjectRepo) Update(ctx context.Context, project *domain.Project) error {
	_, err := r.db.Exec(ctx,
		`UPDATE projects SET title=$1, description=$2, status=$3, updated_at=now() WHERE id = $4`,
		project.Title, project.Description, project.Status, project.ID)
	return err
}
