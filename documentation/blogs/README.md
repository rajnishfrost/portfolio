# Blogs Module

## Purpose
Manages blog entries - can be external links (Medium, Dev.to) or internal blog references.

## Files
| File | Path | Description |
|------|------|-------------|
| Blog Model | `backend/models/Blog.js` | Mongoose schema |
| Blog Controller | `backend/controllers/blogController.js` | CRUD logic |
| Blog Routes | `backend/routes/blogs.js` | Route definitions |

## Model Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | String | Yes | - | Blog title |
| description | String | Yes | - | Short description/summary |
| url | String | Yes | - | External blog URL (Medium, Dev.to, etc.) |
| image | String | No | '' | Cover image |
| tags | [String] | No | [] | Tags/categories |
| featured | Boolean | No | false | Featured on homepage |
| createdAt | Date | No | now | Timestamp |

## APIs

### GET /api/blogs
**Access:** Public
**Response:** Array of blogs sorted by createdAt (desc)

### POST /api/blogs
**Access:** Protected
**Body:**
```json
{
  "title": "My Blog Post",
  "description": "A summary of the blog",
  "url": "https://medium.com/@user/my-post",
  "image": "/uploads/blog-cover.jpg",
  "tags": ["React", "JavaScript"],
  "featured": true
}
```

### PUT /api/blogs/:id
**Access:** Protected

### DELETE /api/blogs/:id
**Access:** Protected

## Usage
- External blogs: provide the full URL (e.g., Medium article link)
- The frontend displays blog cards with title, description, image, and a "Read More" link to the external URL
- Tags are used for filtering on the frontend
