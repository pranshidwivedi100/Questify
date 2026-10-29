# Questify — AI-Powered Gamified Study Planner

Questify is a full-stack academic productivity platform that transforms study habits, assignments, and exam preparation into an interactive RPG. It incorporates mathematically balanced leveling curves, timezone-normalized study streaks, an enterprise-grade idempotent XP ledger, deep-focus Pomodoro timer sessions, study calendar conflict alerts, and rich academic telemetry.

---

## 🏛️ System Architecture

Questify is designed with a fully decoupled full-stack architecture:

- **Backend (`./backend`)**:
  - **Framework**: Spring Boot 3.2.5 on Java 17
  - **Security**: Spring Security 6 with stateless JJWT (`io.jsonwebtoken 0.11.5`) & BCrypt
  - **Data & Persistence**: Spring Data JPA & Hibernate with H2 In-Memory Database (`jdbc:h2:mem:questify_db`) in MySQL compatibility mode
  - **Database Migration / Schema**: `backend/src/main/resources/schema.sql` (also seeds initial achievements automatically)
  - **H2 Console**: Accessible at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:questify_db`, User: `sa`, Password: blank)

- **Frontend (`./frontend`)**:
  - **Framework**: React 18 + Vite
  - **Styling**: Tailwind CSS with custom Dark Navy (`#0B0E17`), Slate Card (`#121829`), Purple (`#8B5CF6`), and Cyan (`#06B6D4`) gaming aesthetic
  - **Icons & Visualization**: Lucide React & Recharts
  - **HTTP Client**: Axios with global JWT authorization interceptors and automated 401 session expiration handling

---

## 🎮 Gamification Mechanics & Idempotency

### 1. Level Progression Curve
Levels are calculated strictly using the square root curve:
$$\text{Level} = \left\lfloor 0.1 \times \sqrt{\text{total\_xp}} \right\rfloor + 1$$

- **Level 1**: 0 XP
- **Level 2**: 100 XP
- **Level 3**: 400 XP
- **Level 4**: 900 XP
- **Level 5**: 1,600 XP
- **Level 6**: 2,500 XP

### 2. Timezone-Aware Streak Tracking
- Every user has an explicit `timezone` (e.g. `UTC`, `America/New_York`, `Asia/Kolkata`).
- Activity dates are calculated using `ZonedDateTime.now(userZone).toLocalDate()`.
- Consecutive daily activity advances the streak and triggers milestone badges (`STREAK_3`, `STREAK_7`).
- Missed days gracefully reset the current streak to `1` while preserving the user's `longest_streak`.

### 3. Strict Idempotent XP Ledger
Duplicate XP exploits (such as repeatedly completing and reopening quests or spamming completion buttons) are eliminated at the database level:
- **Ledger Table**: `xp_transactions(id, user_id, source_type, source_id, xp_awarded, earned_at)`
- **Constraint**: `UNIQUE(user_id, source_type, source_id)`
- **Service Verification**: `GamificationEngineService` validates against the ledger prior to adjusting user XP. Re-completing reopened quests or re-logging duplicate events is safely rejected without awarding duplicate XP.

---

## 📡 API Contracts

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user character & progress | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | ❌ |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & progress | ✅ |
| `GET` | `/api/quests` | List quests with filters (`status`, `priority`, `subjectId`, `search`) | ✅ |
| `POST` | `/api/quests` | Forge new quest objective | ✅ |
| `GET` | `/api/quests/{id}` | Get quest details | ✅ |
| `PUT` | `/api/quests/{id}` | Update quest details | ✅ |
| `DELETE`| `/api/quests/{id}` | Delete quest | ✅ |
| `PATCH`| `/api/quests/{id}/complete` | Complete quest and idempotently claim XP | ✅ |
| `PATCH`| `/api/quests/{id}/reopen` | Reopen completed quest to active queue | ✅ |
| `GET` | `/api/quests/calendar` | Get scheduled quests within date range | ✅ |
| `GET` | `/api/quests/overdue` | Get overdue quests | ✅ |
| `GET` | `/api/subjects` | List academic subjects & target study hours | ✅ |
| `POST` | `/api/subjects` | Create new academic subject | ✅ |
| `PUT` | `/api/subjects/{id}` | Update subject details | ✅ |
| `DELETE`| `/api/subjects/{id}` | Delete subject | ✅ |
| `POST` | `/api/focus-sessions` | Log Pomodoro deep focus session & award XP | ✅ |
| `GET` | `/api/focus-sessions` | List past focus sessions | ✅ |
| `DELETE`| `/api/focus-sessions/{id}` | Remove focus session | ✅ |
| `GET` | `/api/gamification/progress`| Get detailed level, XP span, and streak metrics | ✅ |
| `GET` | `/api/gamification/achievements`| Get unlocked & locked achievement badges | ✅ |
| `GET` | `/api/analytics/dashboard` | Get study velocity, on-time rate & 7-day trend | ✅ |

---

## 🚀 Running the Application

### Prerequisites
- Java 17+
- Node.js 18+ and npm

### 1. Database Setup
The backend is pre-configured with an embedded in-memory H2 database (`jdbc:h2:mem:questify_db;MODE=MySQL`). **No local database server installation or configuration is required.** Tables and default achievements are initialized automatically on startup.

The interactive H2 Web Console is enabled at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:questify_db`
- Username: `sa`
- Password: *(leave blank)*
### 2. Run Backend

#### Option A: Direct Maven Run
```bash
cd backend
mvn spring-boot:run
```

#### Option B: Docker Container
```bash
cd backend
docker build -t questify-backend .
docker run -p 8080:8080 questify-backend
```
Backend will start on `http://localhost:8080`.

To run backend tests (including XP duplicate prevention and streak test cases):
```bash
mvn test
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.

