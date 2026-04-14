# Temporal One

A platform where unemployed people find each other, form teams, and build projects together.

Lost your job? You're not alone. Temporal One connects people in the same situation so they can team up, share skills, and create something real — instead of sitting through the job search alone.

## What it does

- **Profiles** — show your skills, experience, and links (GitHub, LinkedIn) so others can find you
- **Teams** — create or join a team around a shared idea
- **Projects** — launch projects within teams, track status (idea / active / paused)
- **Matching** — browse people and teams to find the right fit

## Tech stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Backend   | Go 1.25, chi router               |
| Database  | PostgreSQL 16                     |
| Auth      | JWT (golang-jwt)                  |
| Migrations| golang-migrate                    |
| Frontend  | Pencil (.pen design files)        |
| Infra     | Docker Compose                    |

### Architecture

Hexagonal (ports & adapters):

```
cmd/server/main.go          — entrypoint
internal/domain/             — core types (User, Profile, Team, Project)
internal/ports/              — interfaces (repositories, services)
internal/services/           — business logic
internal/adapters/postgres/  — database layer
internal/adapters/http/      — REST handlers + router
internal/adapters/auth/      — JWT provider
```

## API

### Public
| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| POST   | `/api/auth/register` | Create account    |
| POST   | `/api/auth/login`    | Get JWT token     |

### Protected (Bearer token)
| Method | Endpoint                   | Description          |
|--------|----------------------------|----------------------|
| GET    | `/api/profile`             | My profile           |
| PUT    | `/api/profile`             | Update my profile    |
| GET    | `/api/users/{id}/profile`  | View user profile    |
| POST   | `/api/teams`               | Create team          |
| GET    | `/api/teams`               | List all teams       |
| GET    | `/api/teams/my`            | My teams             |
| GET    | `/api/teams/{id}`          | Team details         |
| POST   | `/api/teams/{id}/join`     | Join team            |
| POST   | `/api/teams/{id}/leave`    | Leave team           |
| POST   | `/api/projects`            | Create project       |
| GET    | `/api/projects`            | List all projects    |
| GET    | `/api/projects/{id}`       | Project details      |
| PUT    | `/api/projects/{id}`       | Update project       |

## Quick start

```bash
# Clone and run
git clone <repo-url>
cd temporal-one
docker compose up --build

# API is at http://localhost:8080
```

### Local development (without Docker)

```bash
# 1. Start Postgres (or use your own)
# 2. Copy env
cp backend/.env.example backend/.env

# 3. Run
cd backend
go run ./cmd/server
```

## Frontend

Design mockups are in `frontend/pages/` (Pencil .pen format):
- `login.png` / `register.png` — auth screens
- `main-dashboard.png` — home feed
- `profile.png` — user profile

## License

MIT
