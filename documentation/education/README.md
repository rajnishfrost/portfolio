# Education Module

## Purpose
Manages education entries (degrees, certifications) shown on the portfolio.

## Files
| File | Path | Description |
|------|------|-------------|
| Education Model | `backend/models/Education.js` | Mongoose schema |
| Education Controller | `backend/controllers/educationController.js` | CRUD logic |
| Education Routes | `backend/routes/education.js` | Route definitions |

## Model Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| schoolName | String | Yes | - | Institution name |
| logo | String | No | '' | Institution logo |
| degree | String | Yes | - | Degree/certificate title |
| duration | String | No | '' | Time period |
| description | String | No | '' | Description |
| bullets | [String] | No | [] | Key highlights |
| order | Number | No | 0 | Display order |

## APIs
- `GET /api/education` - Public, sorted by order ascending
- `POST /api/education` - Protected, schoolName & degree required
- `PUT /api/education/:id` - Protected
- `DELETE /api/education/:id` - Protected
