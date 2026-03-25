# Seed Module

## Purpose
Seeds initial portfolio data into the database. Useful for first-time setup or migrating from the old hardcoded data.

## Files
| File | Path | Description |
|------|------|-------------|
| Seed Controller | `backend/controllers/seedController.js` | Seed logic |
| Seed Route | `backend/routes/seed.js` | Seed endpoint |

## API

### POST /api/seed
**Access:** Protected (or unauthenticated if no users exist)
**Body:** JSON object with any combination of the following keys:
```json
{
  "profile": { "name": "...", "title": "...", ... },
  "projects": [{ "title": "...", ... }, ...],
  "blogs": [{ "title": "...", ... }, ...],
  "skills": [{ "name": "...", ... }, ...],
  "experience": [{ "role": "...", ... }, ...],
  "education": [{ "schoolName": "...", ... }, ...],
  "achievements": [{ "title": "...", ... }, ...]
}
```

## Behavior
- For each key present in the request body, it **deletes all existing** documents of that type and inserts the new ones
- Only seeds the data types that are included in the request
- Returns a summary of what was seeded

## Warning
This is a destructive operation - it replaces all existing data for each seeded type. Use with caution in production.
