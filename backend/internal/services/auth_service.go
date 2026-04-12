package services

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"temporal-one/internal/domain"
	"temporal-one/internal/ports"
)

type AuthService struct {
	users    ports.UserRepository
	profiles ports.ProfileRepository
	tokens   ports.TokenProvider
}

func NewAuthService(users ports.UserRepository, profiles ports.ProfileRepository, tokens ports.TokenProvider) *AuthService {
	return &AuthService{users: users, profiles: profiles, tokens: tokens}
}

func (s *AuthService) Register(ctx context.Context, email, password string) (string, error) {
	_, err := s.users.GetByEmail(ctx, email)
	if err == nil {
		return "", domain.ErrEmailTaken
	}
	if !errors.Is(err, domain.ErrUserNotFound) {
		return "", err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	now := time.Now()
	user := &domain.User{
		ID:           uuid.New(),
		Email:        email,
		PasswordHash: string(hash),
		CreatedAt:    now,
	}
	if err := s.users.Create(ctx, user); err != nil {
		return "", err
	}

	profile := &domain.Profile{
		ID:        uuid.New(),
		UserID:    user.ID,
		Skills:    []string{},
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := s.profiles.Create(ctx, profile); err != nil {
		return "", err
	}

	return s.tokens.Generate(user.ID)
}

func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	user, err := s.users.GetByEmail(ctx, email)
	if errors.Is(err, domain.ErrUserNotFound) {
		return "", domain.ErrInvalidCredentials
	}
	if err != nil {
		return "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", domain.ErrInvalidCredentials
	}

	return s.tokens.Generate(user.ID)
}
