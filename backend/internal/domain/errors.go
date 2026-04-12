package domain

import "errors"

var (
	ErrUserNotFound       = errors.New("user not found")
	ErrEmailTaken         = errors.New("email already taken")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrProfileNotFound    = errors.New("profile not found")
	ErrTeamNotFound       = errors.New("team not found")
	ErrProjectNotFound    = errors.New("project not found")
	ErrAlreadyMember      = errors.New("already a team member")
	ErrNotMember          = errors.New("not a team member")
	ErrForbidden          = errors.New("forbidden")
)
