# Projects Module

## Purpose
Manages portfolio projects - CRUD operations with category filtering and ordering.

## Files
| File | Path | Description |
|------|------|-------------|
| Project Model | `backend/models/Project.js` | Mongoose schema |
| Project Controller | `backend/controllers/projectController.js` | CRUD logic |
| Project Routes | `backend/routes/projects.js` | Route definitions |

## Model Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | String | Yes | - | Project name |
| description | String | Yes | - | Project description |
| image | String | No | '' | Image URL or upload path |
| category | Enum | Yes | - | Personal / Office / Freelancing / OpenSource |
| techStack | [String] | No | [] | Technologies used |
| liveUrl | String | No | '' | Live demo URL |
| githubUrl | String | No | '' | GitHub repository URL |
| featured | Boolean | No | false | Show on homepage |
| order | Number | No | 0 | Display order (ascending) |
| createdAt | Date | No | now | Creation timestamp |

## APIs

### GET /api/projects
**Access:** Public
**Query Params:** `?category=Personal` `?featured=true`
**Response:** Array of projects sorted by order (asc), then createdAt (desc)

### GET /api/projects/:id
**Access:** Public
**Response:** Single project object

### POST /api/projects
**Access:** Protected
**Validation:** title (required), description (required), category (must be valid enum)
**Body:**
```json
{
  "title": "My Project",
  "description": "A cool project",
  "category": "Personal",
  "image": "/uploads/image-123.jpg",
  "techStack": ["React", "Node.js"],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/...",
  "featured": true,
  "order": 1
}
```

### PUT /api/projects/:id
**Access:** Protected
**Body:** Any subset of fields to update

### DELETE /api/projects/:id
**Access:** Protected
**Response:** `{ "message": "Project deleted" }`

## Flow
1. Public visitors see projects on the portfolio homepage (fetched via GET)
2. Admin can add/edit/delete projects from the admin panel
3. Projects can be filtered by category on the frontend
4. Featured projects appear prominently on the homepage
