# Skills Module

## Purpose
Manages technical skills grouped by category with proficiency levels.

## Files
| File | Path | Description |
|------|------|-------------|
| Skill Model | `backend/models/Skill.js` | Mongoose schema |
| Skill Controller | `backend/controllers/skillController.js` | CRUD logic |
| Skill Routes | `backend/routes/skills.js` | Route definitions |

## Model Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | String | Yes | - | Skill name (e.g., "React") |
| icon | String | No | '' | Font Awesome class or icon URL |
| category | Enum | Yes | - | Frontend / Backend / Blockchain / DevOps / Other |
| proficiency | Number | No | 0 | Skill level 0-100 |

## APIs

### GET /api/skills
**Access:** Public
**Response:**
```json
{
  "skills": [...],          // flat array of all skills
  "grouped": {              // skills grouped by category
    "Frontend": [...],
    "Backend": [...],
    "Blockchain": [...]
  }
}
```

### POST /api/skills
**Access:** Protected
**Body:**
```json
{
  "name": "React",
  "icon": "fab fa-react",
  "category": "Frontend",
  "proficiency": 90
}
```

### PUT /api/skills/:id | DELETE /api/skills/:id
**Access:** Protected

## Frontend Display
- Skills are shown grouped by category (Frontend, Backend, Blockchain, etc.)
- Each skill renders via `SkillBadge` component which handles two icon formats:
  - **FontAwesome class strings** from API (e.g., `fab fa-react`) rendered as `<i className={icon} />`
  - **React component icons** from fallback data rendered as `<Icon />`
- FontAwesome 6.5.1 CSS is loaded via CDN in `index.html`
- API response returns `{ skills: [], grouped: {} }` - frontend uses `res.data.skills` array
