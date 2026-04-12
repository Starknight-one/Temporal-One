package services

import (
	"context"

	"github.com/google/uuid"
	"temporal-one/internal/domain"
	"temporal-one/internal/ports"
)

type UserService struct {
	profiles ports.ProfileRepository
}

func NewUserService(profiles ports.ProfileRepository) *UserService {
	return &UserService{profiles: profiles}
}

func (s *UserService) GetProfile(ctx context.Context, userID uuid.UUID) (*domain.Profile, error) {
	return s.profiles.GetByUserID(ctx, userID)
}

func (s *UserService) UpdateProfile(ctx context.Context, userID uuid.UUID, profile *domain.Profile) error {
	profile.UserID = userID
	return s.profiles.Update(ctx, profile)
}

func (s *UserService) GetProfileByUserID(ctx context.Context, userID uuid.UUID) (*domain.Profile, error) {
	return s.profiles.GetByUserID(ctx, userID)
}
