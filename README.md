# Life RPG

A gamified productivity web app: complete real tasks ("Quests"), earn XP and gold, level up, and grow character attributes. Built with the MERN stack.

**Status:** Backend is fully built and tested. Frontend has all functional logic, routing, and API wiring in place with minimal/neutral CSS. Theming (colors, fonts, animations, renamed copy) is the next step — see "Next Steps" below.

---

## Tech Stack

- **MongoDB** + Mongoose — database
- **Express** — REST API
- **React (Vite)** — frontend
- **JWT** — authentication

## Project Structure

```
life-rpg-app/
├── server/                 # Express + MongoDB backend
│   ├── config/db.js         # MongoDB connection
│   ├── models/               # User, Task, Item schemas
│   ├── controllers/          # Business logic (incl. RPG reward logic)
│   ├── routes/                # API route definitions
│   ├── middleware/           # JWT auth guard, error handler
│   ├── utils/rpgEngine.js    # XP curve, leveling, streaks, rewards - all game math lives here
│   ├── seed/seedItems.js     # Populates the shop with starter items
│   └── server.js              # App entry point
│
└── client/                 # React (Vite) frontend
    └── src/
        ├── api/axios.js               # Configured API client (auto-attaches JWT)
        ├── context/AuthContext.jsx    # Global auth state (user, login, signup, logout)
        ├── components/                 # Navbar, XPBar, TaskForm, TaskList, etc.
        └── pages/                       # Login, Signup, Dashboard, Shop
```

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string (local `mongodb://localhost:27017/life-rpg` or a MongoDB Atlas URI)
- `JWT_SECRET` — any long random string
- `PORT` — defaults to 5000
- `CLIENT_URL` — defaults to `http://localhost:5173` (for CORS)

Then:
```bash
npm run seed   # populates the shop with a few starter items (optional but recommended)
npm run dev    # starts the server with nodemon on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env` if needed (`VITE_API_URL`, defaults to `http://localhost:5000/api`).

```bash
npm run dev    # starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` — sign up, add a task, complete it, and watch XP/level/streak update.

---

## What's Already Implemented

- **Auth**: signup, login, JWT sessions, protected routes (both backend middleware and frontend route guards)
- **Data isolation**: every task/user query is scoped to `req.user._id` — no user can see or modify another user's data
- **Task CRUD**: create, read, update, delete, complete
- **RPG engine** (`server/utils/rpgEngine.js`):
  - Non-linear XP curve: `xpRequiredForLevel(level) = level² × 100`
  - Category → attribute mapping (e.g., "coding" task → Intellect)
  - Difficulty-based rewards (easy/medium/hard → different XP/gold/attribute gains)
  - Streak tracking (increments on consecutive days, resets on a missed day)
  - Level-up detection returned with every task completion
- **Shop/economy**: item list, purchase endpoint with gold-balance and duplicate-ownership checks
- **Frontend**: fully wired to the API — dashboard shows live XP bar, attributes, streak, and task list; optimistic UI on task completion/deletion (instant visual feedback, rolls back on error); shop page with affordability checks
- **Accessibility groundwork**: semantic HTML (`main`, `nav`, `ul`/`li`), `aria-label`/`role` attributes on interactive elements and the XP progress bar, labeled form inputs

## Next Steps (What's Left For You + Gemini)

This is intentionally left minimal so the theme pass doesn't fight against baked-in design decisions:

1. **Visual theme** — colors, typography, iconography matching your chosen theme (e.g., post-apocalypse)
2. **Copy/renaming** — "Tasks" → "Quests", "Points" → "Scrap", etc. (search for user-facing strings in `client/src/pages` and `client/src/components`)
3. **Animations** — XP bar fill transitions, level-up celebration effect, task-complete micro-interactions (the `.xp-bar-fill` and level-up banner in `Dashboard.jsx` are natural places to hook these in)
4. **Loading skeletons** — currently plain "Loading..." text (`.loading-state` class) — swap for skeleton placeholders
5. **Responsive polish** — base layout is responsive-ish (flexbox/grid) but hasn't been tuned/tested across breakpoints
6. **Full accessibility pass** — color contrast, keyboard-nav testing, screen reader testing

Every element already has a CSS class name (`task-card`, `xp-bar-fill`, `navbar`, `shop-item-card`, etc.) — point Gemini at `client/src/index.css` and these class names to restyle without needing to touch component logic.

## API Reference (quick)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/tasks` | Yes | List your tasks |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Edit a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |
| PATCH | `/api/tasks/:id/complete` | Yes | Complete a task (triggers XP/gold/level/streak logic) |
| GET | `/api/shop` | Yes | List shop items |
| POST | `/api/shop/purchase/:itemId` | Yes | Buy an item |
