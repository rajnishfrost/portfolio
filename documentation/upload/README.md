# Upload Module

## Purpose
Handles image file uploads for projects, blogs, profile, etc.

## Files
| File | Path | Description |
|------|------|-------------|
| Upload Middleware | `backend/middleware/upload.js` | Multer configuration |
| Upload Route | `backend/routes/upload.js` | Upload endpoint |

## Configuration
- **Storage:** Local disk at `backend/uploads/`
- **Max file size:** 5MB
- **Allowed types:** jpeg, jpg, png, gif, webp, svg
- **Filename format:** `{fieldname}-{timestamp}-{random}.{ext}`

## API

### POST /api/upload
**Access:** Protected
**Content-Type:** `multipart/form-data`
**Field name:** `image`
**Response:**
```json
{
  "url": "/uploads/image-1709123456789-123456789.jpg",
  "filename": "image-1709123456789-123456789.jpg"
}
```

## Usage Flow
1. Admin uploads image via the upload endpoint
2. Backend returns the file URL (e.g., `/uploads/image-123.jpg`)
3. Admin uses this URL when creating/updating projects, blogs, etc.
4. Frontend loads images from `{BACKEND_URL}/uploads/filename`

## Static Serving
Uploads folder is served statically in `server.js`:
```js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```
