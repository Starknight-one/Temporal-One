package postgres

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"temporal-one/internal/domain"
)

type TeamRepo struct {
	db *pgxpool.Pool
}

func NewTeamRepo(db *pgxpool.Pool) *TeamRepo {
	return &TeamRepo{db: db}
}

func (r *TeamRepo) Create(ctx context.Context, team *domain.Team) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx,
		`INSERT INTO teams (id, name, description, owner_id, created_at) VALUES ($1, $2, $3, $4, $5)`,
		team.ID, team.Name, team.Description, team.OwnerID, team.CreatedAt)
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx,
		`INSERT INTO team_members (team_id, user_id, role, joined_at) VALUES ($1, $2, 'owner', $3)`,
		team.ID, team.OwnerID, team.CreatedAt)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (r *TeamRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Team, error) {
	t := &domain.Team{}
	err := r.db.QueryRow(ctx,
		`SELECT id, name, description, owner_id, created_at FROM teams WHERE id = $1`, id).
		Scan(&t.ID, &t.Name, &t.Description, &t.OwnerID, &t.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, domain.ErrTeamNotFound
	}
	if err != nil {
		return nil, err
	}

	rows, err := r.db.Query(ctx,
		`SELECT user_id, team_id, role, joined_at FROM team_members WHERE team_id = $1`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var m domain.TeamMember
		if err := rows.Scan(&m.UserID, &m.TeamID, &m.Role, &m.JoinedAt); err != nil {
			return nil, err
		}
		t.Members = append(t.Members, m)
	}

	return t, rows.Err()
}

func (r *TeamRepo) List(ctx context.Context, limit, offset int) ([]domain.Team, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, name, description, owner_id, created_at FROM teams ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
		limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []domain.Team
	for rows.Next() {
		var t domain.Team
		if err := rows.Scan(&t.ID, &t.Name, &t.Description, &t.OwnerID, &t.CreatedAt); err != nil {
			return nil, err
		}
		teams = append(teams, t)
	}
	return teams, rows.Err()
}

func (r *TeamRepo) ListByUserID(ctx context.Context, userID uuid.UUID) ([]domain.Team, error) {
	rows, err := r.db.Query(ctx,
		`SELECT t.id, t.name, t.description, t.owner_id, t.created_at
		 FROM teams t
		 JOIN team_members tm ON t.id = tm.team_id
		 WHERE tm.user_id = $1
		 ORDER BY t.created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []domain.Team
	for rows.Next() {
		var t domain.Team
		if err := rows.Scan(&t.ID, &t.Name, &t.Description, &t.OwnerID, &t.CreatedAt); err != nil {
			return nil, err
		}
		teams = append(teams, t)
	}
	return teams, rows.Err()
}

func (r *TeamRepo) AddMember(ctx context.Context, member *domain.TeamMember) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO team_members (team_id, user_id, role, joined_at) VALUES ($1, $2, $3, $4)`,
		member.TeamID, member.UserID, member.Role, member.JoinedAt)
	return err
}

func (r *TeamRepo) RemoveMember(ctx context.Context, teamID, userID uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`DELETE FROM team_members WHERE team_id = $1 AND user_id = $2`, teamID, userID)
	return err
}

func (r *TeamRepo) IsMember(ctx context.Context, teamID, userID uuid.UUID) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2)`,
		teamID, userID).Scan(&exists)
	return exists, err
}
