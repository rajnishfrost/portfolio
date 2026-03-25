# Achievements Module

## Purpose
Manages achievements, certifications, and awards.

## Files
| File | Path | Description |
|------|------|-------------|
| Achievement Model | `backend/models/Achievement.js` | Mongoose schema |
| Achievement Controller | `backend/controllers/achievementController.js` | CRUD logic |
| Achievement Routes | `backend/routes/achievements.js` | Route definitions |

## Model Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | String | Yes | - | Achievement title |
| subtitle | String | No | '' | Description |
| image | String | No | '' | Certificate/badge image |
| links | Array | No | [] | Related links [{name, url}] |
| order | Number | No | 0 | Display order |

## APIs
- `GET /api/achievements` - Public, sorted by order ascending
- `POST /api/achievements` - Protected, title required
- `PUT /api/achievements/:id` - Protected
- `DELETE /api/achievements/:id` - Protected
