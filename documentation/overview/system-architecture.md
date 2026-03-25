# System Architecture - Portfolio Website v2

## Overview
This is a full-stack portfolio website with three main parts:
1. **Frontend (Public Site)** - Vite + React 19 + Tailwind CSS v4 + Framer Motion
2. **Backend (API Server)** - Node.js + Express + MongoDB
3. **Admin Panel** - Part of the React frontend with protected routes

## Project Structure
```
portfolio/
├── frontend/              # React frontend (public site + admin panel)
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, Footer, Cards, etc.)
│   │   ├── pages/         # Public pages (Home, Projects, Blogs, Contact)
│   │   ├── admin/         # Admin panel pages (Dashboard, Manage*)
│   │   ├── layouts/       # Layout wrappers (PublicLayout)
│   │   ├── context/       # React context providers (ThemeContext)
│   │   ├── services/      # API service functions (axios)
│   │   └── index.css      # Tailwind v4 imports + theme config
│   ├── public/            # Static assets
│   ├── index.html         # Entry HTML (Inter font, FontAwesome CDN)
│   └── vite.config.js     # Vite config (port 3004, proxy to backend)
├── backend/               # Node.js API server
│   ├── config/            # Database configuration
│   ├── controllers/       # Route handler logic
│   ├── middleware/         # Auth (JWT) & upload (Multer) middleware
│   ├── models/            # Mongoose schemas (10 models)
│   ├── routes/            # Express route definitions
│   ├── uploads/           # Uploaded images storage
│   └── server.js          # Entry point
└── documentation/         # Module-wise documentation
```

## Tech Stack
| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4, Framer Motion  |
| Backend    | Node.js, Express.js                              |
| Database   | MongoDB with Mongoose ODM                        |
| Auth       | JWT (JSON Web Tokens) + bcrypt                   |
| Uploads    | Multer (local disk storage, 5MB limit)           |
| Validation | express-validator                                |
| Icons      | FontAwesome 6.5.1 (CDN) + React Icons            |

## Ports
| Service  | Port |
|----------|------|
| Frontend | 3004 |
| Backend  | 4004 |

## API Base URL
- Development: `http://localhost:4004/api`
- Production: `http://161.118.173.163:4004/api`
- Frontend proxies `/api` and `/uploads` to backend via Vite config

## Authentication Flow
1. First user registers freely via `POST /api/auth/register` (no token needed)
2. Subsequent registrations require existing admin's JWT token
3. Login returns JWT token (valid for 30 days)
4. Protected routes require `Authorization: Bearer <token>` header
5. Admin credentials: `rajnishfrost@gmail.com` / `Admin@123`

## Data Flow
```
User Browser --> React Frontend --> Axios API calls --> Express Backend --> MongoDB
                (port 3004)        (Vite proxy)        (port 4004)
                                                   --> /uploads (images)
```

## Fallback Data Pattern
All public pages include hardcoded fallback data. If the backend is unreachable:
- Pages render with default/sample data instead of showing errors
- Contact form will show an error on submission only

## Environment Variables

### backend/.env
```
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=rajnish_portfolio_secret_key_2024
PORT=4004
```

### frontend/.env
```
VITE_BACKEND_URL=http://161.118.173.163:4004/
```

## Key Design Decisions
- **Dark Mode:** Class-based strategy using `@custom-variant dark` in Tailwind v4
- **Icons from DB:** Skills store FontAwesome class strings (e.g., `fab fa-react`), rendered via `<i>` tag
- **Single Profile:** Only one profile document exists in MongoDB (upsert pattern)
- **No Role System:** Single admin user, all admin routes share same auth
