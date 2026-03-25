# Experience Module

## Purpose
Manages work experience entries shown on the portfolio.

## Files
| File | Path | Description |
|------|------|-------------|
| Experience Model | `backend/models/Experience.js` | Mongoose schema |
| Experience Controller | `backend/controllers/experienceController.js` | CRUD logic |
| Experience Routes | `backend/routes/experience.js` | Route definitions |

## Model Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| role | String | Yes | - | Job title |
| company | String | Yes | - | Company name |
| companyLogo | String | No | '' | Logo image path |
| startDate | String | Yes | - | Start date |
| endDate | String | No | '' | End date |
| current | Boolean | No | false | Currently working here |
| description | String | No | '' | Job description |
| bullets | [String] | No | [] | Key responsibilities/achievements |
| order | Number | No | 0 | Display order |

## APIs
- `GET /api/experience` - Public, sorted by order ascending
- `POST /api/experience` - Protected, role & company required
- `PUT /api/experience/:id` - Protected
- `DELETE /api/experience/:id` - Protected
