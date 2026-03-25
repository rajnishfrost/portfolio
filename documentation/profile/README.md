# Profile Module

## Purpose
Manages the portfolio owner's profile information (single document).

## Files
| File | Path | Description |
|------|------|-------------|
| Profile Model | `backend/models/Profile.js` | Mongoose schema |
| Profile Controller | `backend/controllers/profileController.js` | Get & Update logic |
| Profile Routes | `backend/routes/profile.js` | Route definitions |

## Model Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | String | Yes | - | Full name |
| title | String | No | - | Professional title |
| subtitle | String | No | - | Tagline/intro |
| bio | String | No | - | Detailed bio |
| email | String | No | - | Contact email |
| phone | String | No | - | Phone number |
| resumeLink | String | No | - | Resume/CV URL |
| socialLinks | Object | No | - | {github, linkedin, medium, twitter} |
| profileImage | String | No | '' | Profile photo path |
| isHireable | Boolean | No | true | Hireable status badge |

## APIs

### GET /api/profile
**Access:** Public
**Response:** Profile object (single document)
**Note:** Only one profile document exists. Returns the first one found.

### PUT /api/profile
**Access:** Protected
**Body:** Any subset of profile fields to update
```json
{
  "name": "Rajnish Yadav",
  "title": "Fullstack Developer",
  "socialLinks": {
    "github": "https://github.com/rajnishfrost",
    "linkedin": "https://linkedin.com/in/rajnish-yadav"
  },
  "isHireable": true
}
```

## Flow
- Profile is created via seed or manually via PUT (upsert)
- Only one profile exists at any time
- Frontend hero section pulls data from this profile
