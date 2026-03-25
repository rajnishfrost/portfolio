# Contact Module

## Purpose
Handles contact form submissions from visitors and message management for admin.

## Files
| File | Path | Description |
|------|------|-------------|
| Contact Model | `backend/models/Contact.js` | Mongoose schema |
| Contact Controller | `backend/controllers/contactController.js` | Submit & manage logic |
| Contact Routes | `backend/routes/contact.js` | Route definitions |

## Model Fields
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | String | Yes | - | Sender's name |
| email | String | Yes | - | Sender's email |
| subject | String | Yes | - | Message subject |
| message | String | Yes | - | Message body |
| read | Boolean | No | false | Read status (for admin) |
| createdAt | Date | No | now | Timestamp |

## APIs

### POST /api/contact
**Access:** Public (for visitors submitting contact form)
**Validation:** name, email (valid format), subject, message - all required
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "Hi, I'd like to discuss..."
}
```

### GET /api/contact
**Access:** Protected (admin views all messages)
**Response:** Array of messages sorted by createdAt (desc), unread first

### PUT /api/contact/:id/read
**Access:** Protected
**Action:** Toggles read status of a message

### DELETE /api/contact/:id
**Access:** Protected
