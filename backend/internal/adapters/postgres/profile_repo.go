package postgres

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"temporal-one/internal/domain"
)

type ProfileRepo struct {
	db *pgxpool.Pool
}

func NewProfileRepo(db *pgxpool.Pool) *ProfileRepo {
	return &ProfileRepo{db: db}
}

func (r *ProfileRepo) Create(ctx context.Context, profile *domain.Profile) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO profiles (id, user_id, name, bio, skills, experience, github_url, linkedin_url, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		profile.ID, profile.UserID, profile.Name, profile.Bio, profile.Skills,
		profile.Experience, profile.GitHubURL, profile.LinkedInURL, profile.CreatedAt, profile.UpdatedAt)
	return err
}

func (r *ProfileRepo) GetByUserID(ctx context.Context, userID uuid.UUID) (*domain.Profile, error) {
	p := &domain.Profile{}
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, name, bio, skills, experience, github_url, linkedin_url, created_at, updated_at
		 FROM profiles WHERE user_id = $1`, userID).
		Scan(&p.ID, &p.UserID, &p.Name, &p.Bio, &p.Skills, &p.Experience,
			&p.GitHubURL, &p.LinkedInURL, &p.CreatedAt, &p.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrProfileNotFound
	}
	return p, err
}

func (r *ProfileRepo) Update(ctx context.Context, profile *domain.Profile) error {
	_, err := r.db.Exec(ctx,
		`UPDATE profiles SET name=$1, bio=$2, skills=$3, experience=$4, github_url=$5, linkedin_url=$6, updated_at=now()
		 WHERE user_id = $7`,
		profile.Name, profile.Bio, profile.Skills, profile.Experience,
		profile.GitHubURL, profile.LinkedInURL, profile.UserID)
	return err
}
