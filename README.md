# Tasker-TechZephyr // Life RPG

A cybernetic gamified productivity web application: execute real-world tasks ("Quests"), earn XP and credit balances, level up, sync operational timelines with Google Calendar, and upgrade system attributes. Built on the MERN stack.

---

## Tech Stack & Architecture

* **MongoDB** + Mongoose — Decentralized database layer
* **Express** — Neural REST API gateway
* **React (Vite)** — Frontend cyber-deck interface
* **JWT** — Secure session authorization tokens
* **Googleapis** — Secure Google Calendar OAuth2 synchronization bridge

---

## Directory Structure

```text
Tasker-TechZephyr/

├── server/                         # Express + MongoDB neural backend
│   ├── config/db.js                # Database handshake connection
│   ├── models/                     # User, Task schemas
│   ├── routes/                     # API routing matrix (tasks, auth, calendar)
│   ├── middleware/                 # JWT auth guard, error interceptors
│   ├── utils/rpgEngine.js          # XP progression algorithms, streak logic
│   └── server.js                   # Main server execution entry
│
└── client/                         # React (Vite) cyberpunk interface
    └── src/
        ├── api/axios.js            # Configured API bridge (auto-attaches JWT)
        ├── context/AuthContext.jsx # Global user state management
        ├── components/             # XPBar, StreakDisplay, interactive modules
        └── pages/                  # Dashboard, Authentication terminals
```

---

# System Initialization & Setup

## 1. Backend Neural Core

```bash
cd server

npm install

cp .env.example .env
```

Configure `.env` parameters:

* `MONGO_URI` — MongoDB Atlas connection cluster
* `JWT_SECRET` — Cryptographic signature key
* `PORT` — Operational server port (default: `10000`)
* `CLIENT_URL` — Frontend origin URL (for CORS binding)
* `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URI` — OAuth credentials for Calendar integration

Launch the backend:

```bash
npm run dev
```

Starts nodemon terminal instance.

---

## 2. Frontend Interface Deck

```bash
cd client

npm install

cp .env.example .env
```

Configure `client/.env`:

* `VITE_API_URL` — Backend endpoint URL (`https://tasker-techzephyr.onrender.com/api` or local)

Launch the Vite development server:

```bash
npm run dev
```

Boots up local interface on port `5173`.

---

# Core System Modules Implemented

### Secure Neural Auth

Signup, login, JWT session management, protected access guards across all client modules.

### Data Isolation Protocol

Strict user-level data compartmentalization scoped to `req.user._id`.

### Quest Execution Engine (CRUD + RPG Math)

* Non-linear leveling progression:

  \(\text{xpRequiredForLevel}(level) = level^2 \times 100\)

* Priority & difficulty multipliers for XP and attribute updates.

* Streak tracking algorithm (consecutive daily execution monitoring).

### Google Calendar Sync Matrix

OAuth2 integration supporting per-user token storage in MongoDB and live event synchronization (`/api/calendar/...`).

### Cyberpunk UI Interface

Designed with custom neon aesthetics:

* `#00f0ff` — cyan
* `#a855f7` — purple
* `#16161a` — terminal panels
* Monospace typography

---

# API Command Matrix

| Method   | Endpoint                     | Auth Required | Description                                        |
| -------- | ---------------------------- | ------------- | -------------------------------------------------- |
| `POST`   | `/api/auth/signup`           | No            | Initialize new user account                        |
| `POST`   | `/api/auth/login`            | No            | Authenticate user session                          |
| `GET`    | `/api/auth/me`               | Yes           | Retrieve active user telemetry                     |
| `GET`    | `/api/tasks`                 | Yes           | Retrieve active quest queue                        |
| `POST`   | `/api/tasks`                 | Yes           | Initialize new quest                               |
| `PATCH`  | `/api/tasks/:id/complete`    | Yes           | Execute quest (triggers XP/streak updates)         |
| `DELETE` | `/api/tasks/:id`             | Yes           | Terminate quest                                    |
| `GET`    | `/api/calendar/auth`         | Yes           | Initiate Google Calendar OAuth handshake           |
| `GET`    | `/api/calendar/callback`     | No            | Process OAuth authorization callback & save tokens |
| `GET`    | `/api/calendar/sync/:userId` | Yes           | Fetch synchronized primary calendar events         |

```
```
