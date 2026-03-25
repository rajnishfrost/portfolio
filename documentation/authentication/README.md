# Authentication Module

## Purpose
Handles admin user registration, login, and JWT-based session management.

## Files
| File | Path | Description |
|------|------|-------------|
| User Model | `backend/models/User.js` | Mongoose schema with bcrypt password hashing |
| Auth Controller | `backend/controllers/authController.js` | Register, Login, GetMe logic |
| Auth Routes | `backend/routes/auth.js` | Route definitions with validation |
| Auth Middleware | `backend/middleware/auth.js` | JWT verification middleware |

## APIs

### POST /api/auth/register
**Access:** Public (first user) / Protected (subsequent users)
**Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123"
}
```
**Response (201):**
```json
{
  "_id": "...",
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "token": "jwt_token_here"
}
```
**Logic:**
- If no users exist in DB, anyone can register (first-time setup)
- If users exist, requires valid JWT of existing admin in Authorization header
- Password is hashed with bcrypt (salt rounds: 12) before saving

### POST /api/auth/login
**Access:** Public
**Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
**Response (200):** Same structure as register response with JWT token

### GET /api/auth/me
**Access:** Protected (requires JWT)
**Headers:** `Authorization: Bearer <token>`
**Response (200):**
```json
{
  "_id": "...",
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "..."
}
```

## Default Admin Credentials
| Field | Value |
|-------|-------|
| Username | `admin` |
| Email | `admin@gmail.com` |
| Password | `1@Devidislive` |

> **Note:** First-time setup ke liye POST `/api/auth/register` call karo with these credentials. Password DB mein bcrypt-hashed store hota hai.

## Rate Limiting (Brute Force Protection)
- Ek IP se **maximum 3 login attempts** allowed hain per 15 minutes
- 3 failed attempts ke baad IP 15 minutes ke liye block ho jaayegi
- Response: `429 Too Many Requests` with message

## Auth Middleware Flow
1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies token using `jwt.verify()` with JWT_SECRET
3. Finds user by decoded ID, attaches to `req.user`
4. Returns 401 if token is missing, invalid, or expired

## User Model Details
- Password field has `select: false` (excluded from queries by default)
- `pre('save')` hook hashes password only when modified
- `comparePassword()` instance method for login verification
- Role is always "admin" (single-role system)
