# Frontend Architecture

## Tech Stack
- **Vite** - Build tool (fast dev server + optimized builds)
- **React 19** - UI library
- **Tailwind CSS v4** - Utility-first CSS (via `@tailwindcss/vite` plugin, no config file needed)
- **Framer Motion** - Animations
- **React Router DOM v7** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library (admin panel icons)
- **React Hot Toast** - Toast notifications
- **FontAwesome 6.5.1** - Skill icons (loaded via CDN in index.html)

## Directory Structure
```
frontend/src/
├── main.jsx            # Entry point with BrowserRouter
├── App.jsx             # Route definitions
├── index.css           # Tailwind v4 imports + custom theme + dark mode variant
├── context/
│   └── ThemeContext.jsx # Dark/light mode context
├── services/
│   └── api.js          # Axios instance + all API functions
├── layouts/
│   └── PublicLayout.jsx # Navbar + Outlet + Footer
├── components/
│   ├── Navbar.jsx       # Glassmorphism sticky navbar with "Rajnish" logo
│   ├── Footer.jsx       # Site footer with social links
│   ├── Section.jsx      # Reusable animated section wrapper
│   ├── ProjectCard.jsx  # Project display card
│   ├── BlogCard.jsx     # Blog display card
│   ├── SkillBadge.jsx   # Skill icon badge (supports FA classes + React components)
│   └── ProtectedRoute.jsx # JWT auth guard for admin
├── pages/
│   ├── Home.jsx         # Landing page (Hero, About, Skills, Projects, etc.)
│   ├── Projects.jsx     # All projects with category filters
│   ├── Blogs.jsx        # All blogs grid
│   └── Contact.jsx      # Contact form
└── admin/
    ├── AdminLogin.jsx    # Admin login page
    ├── AdminLayout.jsx   # Sidebar + Outlet admin layout
    ├── Dashboard.jsx     # Stats overview dashboard
    ├── ManageProjects.jsx
    ├── ManageBlogs.jsx
    ├── ManageSkills.jsx
    ├── ManageExperience.jsx
    ├── ManageEducation.jsx
    ├── ManageAchievements.jsx
    ├── ManageProfile.jsx # Nested socialLinks handling
    └── ManageMessages.jsx
```

## Routing
| Path | Component | Access |
|------|-----------|--------|
| `/` | Home | Public |
| `/projects` | Projects | Public |
| `/blogs` | Blogs | Public |
| `/contact` | Contact | Public |
| `/admin/login` | AdminLogin | Public |
| `/admin` | Dashboard | Protected |
| `/admin/projects` | ManageProjects | Protected |
| `/admin/blogs` | ManageBlogs | Protected |
| `/admin/skills` | ManageSkills | Protected |
| `/admin/experience` | ManageExperience | Protected |
| `/admin/education` | ManageEducation | Protected |
| `/admin/achievements` | ManageAchievements | Protected |
| `/admin/profile` | ManageProfile | Protected |
| `/admin/messages` | ManageMessages | Protected |

## Theme System (Dark Mode)
- Uses React Context (`ThemeContext`)
- Detects system preference via `matchMedia`
- Persists choice in `localStorage`
- Toggles `dark` class on `<html>` element
- Tailwind v4 dark mode configured via `@custom-variant dark (&:where(.dark, .dark *));` in index.css
- Default theme follows system preference; user can toggle via navbar switch

## API Integration
- All API calls go through `src/services/api.js`
- Axios interceptor automatically attaches JWT token from `localStorage`
- Vite proxy: `/api` and `/uploads` -> `http://localhost:4004`
- Every public page has hardcoded fallback data so the site works without backend

## SkillBadge Icon Handling
The `SkillBadge` component handles two icon formats:
1. **React components** (from fallback data) - rendered as `<Icon />`
2. **FontAwesome class strings** (from API, e.g., `fab fa-react`) - rendered as `<i className={icon} />`
FontAwesome CSS is loaded via CDN in `index.html`.

## Component Compatibility
Components handle both API and fallback field names:
- `ProjectCard`: checks `project.githubUrl || project.github` and `project.liveUrl || project.live`
- `BlogCard`: checks `blog.url || blog.link`

## Design System
- **Primary:** Indigo (#6366f1)
- **Secondary:** Sky Blue (#0ea5e9)
- **Accent:** Amber (#f59e0b)
- **Dark BG:** Slate-900 (#0f172a)
- **Cards:** rounded-xl/2xl with subtle shadows and borders
- **Animations:** Framer Motion fade + slide on scroll (viewport once)
- **Navbar:** Glassmorphism (backdrop-blur + translucent bg)
- **Font:** Inter (Google Fonts)
