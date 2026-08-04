# TaskFlow - Project Issues & Technical Debt Report

**Date:** 2026-08-04  
**Branch:** main  
**Reviewer:** Automated code review  

---

## 📋 Executive Summary

This document catalogs issues, bugs, code smells, and technical debt found during a comprehensive review of the TaskFlow project (React + Express + Socket.IO + PostgreSQL). Issues are categorized by severity and component.

---

## 🔴 Critical Issues (Must Fix)

### 1. **Socket.IO Authentication - Incomplete Backend Implementation** ✅ **FIXED**
**File:** `backend/src/socket.js`, `backend/src/modules/tasks/tasks.controller.js`  
**Issue:** The authentication middleware was added but **never emits events to authenticated users only**. The `getIO().emit()` calls in `tasks.controller.js` broadcast to ALL connected sockets, including unauthenticated ones.  
**Impact:** Data leakage - all connected clients receive all users' task events.  
**Fix:** Use `socket.join(userId)` on connection and `io.to(userId).emit()` for targeted events.

**Fixed on:** 2026-08-04

**Files changed:**
- backend/src/socket.js - Added `socket.join(socket.userId.toString())` in connection handler
- backend/src/modules/tasks/tasks.controller.js - Changed 3 emit calls from `getIO().emit()` to `getIO().to(req.user.id.toString()).emit()`

**Root cause:**
Socket.IO authentication existed, but task events were emitted globally to all connected sockets.

**Fix:**
Users are assigned to a private Socket.IO room using their userId on connection.
Task events are emitted using `io.to(userId).emit()` targeting only the task owner.

**Verification:**
- Backend syntax check: PASS (`node -c` on modified files)
- Frontend build: PASS (`npm run build`)
- Server starts without errors (database connection is separate infrastructure)
- No new lint errors introduced by changes

**Tests:**
- Backend syntax validation: PASS
- Frontend production build: PASS

**Regression:** No known regression. Task events now only reach the authenticated user who owns the task.

**Limitation:** Requires database to be running for full integration test. Verified code compiles and server starts.

---

### 2. **Refresh Token Endpoint Missing**
**File:** `frontend/src/api/client.ts` (lines 58-64)  
**Issue:** Frontend expects `/auth/refresh` endpoint but **backend doesn't implement it**.  
**Impact:** Token refresh fails, users get logged out unexpectedly.  
**Fix:** Implement POST `/api/v1/auth/refresh` in backend.

---

### 3. **No Refresh Token Storage in Backend**
**File:** `backend/src/modules/auth/auth.service.js`  
**Issue:** Login/register only return `accessToken` (1d expiry). No refresh token issued/stored.  
**Impact:** Cannot implement proper token refresh; security risk with long-lived access tokens.  
**Fix:** Add refresh token generation, storage (DB), rotation, and revocation.

---

### 4. **Google Login Creates Users Without Password Hash**
**File:** `backend/src/modules/auth/auth.service.js` line 40  
**Issue:** `createGoogleUser` stores `"GOOGLE_ACCOUNT"` as password_hash.  
**Impact:** If user later tries email/password login, bcrypt comparison will fail unpredictably.  
**Fix:** Store null or a sentinel that bcrypt rejects cleanly, add `auth_provider` column.

---

## 🟠 High Priority Issues

### 5. **Socket.IO Reconnection Auth Bug**
**File:** `frontend/src/socket.js` line 15  
**Issue:** `socket.io.on('reconnect_attempt')` - but `socket.io` is not a valid property on client socket. Should be `socket.io.engine` or use `io.on('reconnect_attempt')` pattern.  
**Fix:** Use `socket.on('reconnect_attempt', () => { socket.auth = { token: getAuthToken() }; })`

---

### 6. **Date Filter Bug - "Week" Calculation**
**Files:** 
- `backend/src/modules/tasks/tasks.service.js` (FIXED in recent commit)
- `frontend/src/pages/Dashboard.jsx` (FIXED in recent commit)

**Previous bug:** `new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)` - subtracting 7 from day of month (e.g., Aug 4 - 7 = July 28), not 7 days ago.  
**Status:** ✅ Fixed to use `now.getTime() - 7 * 24 * 60 * 60 * 1000`

---

### 7. **Select Component onValueChange/onChange Mismatch**
**File:** `frontend/src/pages/Dashboard.jsx`  
**Issue:** Dashboard used `onValueChange={(event) => event.target.value}` but Select component expects `onChange={(value) => value}`  
**Status:** ✅ Fixed in recent commit (4 occurrences)

---

### 8. **Amount Input Formatting Confusion**
**File:** `frontend/src/pages/Dashboard.jsx`  
**Issue:** Complex logic for displaying thousands (VND) with commas vs raw input.  
**Status:** ✅ Simplified in recent commit with `formatThousandsForDisplay()` / `parseThousandsInput()`

---

## 🟡 Medium Priority Issues

### 9. **Duplicate API Client Files**
**Files:** 
- `frontend/src/api/client.js` (CommonJS, used by Dashboard)
- `frontend/src/api/client.ts` (TypeScript, used by useTasks.ts)

**Issue:** Two implementations with different features. `.ts` has refresh token logic; `.js` doesn't.  
**Fix:** Consolidate to single TypeScript version, update all imports.

---

### 10. **AuthContext Decodes JWT Client-Side (Insecure)**
**File:** `frontend/src/context/AuthContext.jsx` lines 14, 26  
**Issue:** Uses `atob(token.split('.')[1])` to decode JWT payload without verification.  
**Impact:** User can modify token payload locally; no expiry check.  
**Fix:** Backend should return user info in login response; validate token server-side only.

---

### 11. **No Input Sanitization for Task Fields**
**Files:** 
- `backend/src/modules/tasks/tasks.controller.js`
- `backend/src/modules/tasks/tasks.service.js`

**Issue:** Title, description accepted raw. No XSS protection, no length limits beyond schema.  
**Fix:** Add sanitization (DOMPurify or similar), enforce max lengths in DB schema.

---

### 12. **Race Condition in Socket Event Handlers**
**File:** `frontend/src/pages/Dashboard.jsx` lines 153-168  
**Issue:** Socket events (`task:created`, `task:updated`, `task:deleted`) call `fetchTasks()` + stats fetches. Multiple rapid events trigger redundant API calls.  
**Fix:** Debounce or use React Query's `invalidateQueries` instead of manual refetch.

---

### 13. **Task Status Validation Only in Controller**
**File:** `backend/src/modules/tasks/tasks.controller.js` line 44  
**Issue:** Status validation (`['todo', 'in_progress', 'done']`) only in controller, not in service or DB.  
**Fix:** Add CHECK constraint in PostgreSQL, validate in service layer.

---

### 14. **No Rate Limiting on Auth Endpoints**
**Files:** `backend/src/modules/auth/auth.routes.js`, `backend/src/app.js`  
**Issue:** Login/register/Google login have no rate limiting.  
**Impact:** Brute force, credential stuffing attacks possible.  
**Fix:** Add `express-rate-limit` middleware to auth routes.

---

### 15. **CORS Allows Credentials But No CSRF Protection**
**File:** `backend/src/app.js` lines 23-28  
**Issue:** `credentials: true` with cookie-based auth would need CSRF tokens. Currently using Bearer tokens so less critical, but still a gap.  
**Fix:** Implement CSRF protection if cookies used, or ensure `SameSite` headers.

---

## 🟢 Low Priority / Code Quality

### 16. **Inconsistent Error Handling Patterns**
**Files:** All controllers  
**Issue:** Some use `try/catch` with `console.error`, others don't log. No centralized error handler.  
**Fix:** Create error handling middleware, use consistent error response format.

---

### 17. **Hardcoded Google Client ID in Frontend**
**Files:** 
- `frontend/src/pages/Login.jsx` line 13
- `backend/src/modules/auth/auth.service.js` line 5

**Issue:** Same ID in two places; should be env var only.  
**Fix:** Remove from frontend, only use in backend verification.

---

### 18. **Frontend Uses Both `client.js` and `client.ts`**
**Files:** Multiple imports  
**Issue:** Some components import `.js`, others `.ts`. Causes confusion.  
**Fix:** Standardize on TypeScript version.

---

### 19. **Dashboard.jsx - Massive Component (600+ lines)**
**File:** `frontend/src/pages/Dashboard.jsx`  
**Issue:** Single component handles: task list, form, stats, charts, filters, modals, socket listeners.  
**Fix:** Split into sub-components: `TaskList`, `TaskForm`, `StatsCards`, `Charts`, `Filters`.

---

### 20. **No Database Migration System**
**Files:** None  
**Issue:** Schema changes applied manually. No version control for DB schema.  
**Fix:** Add migration tool (node-pg-migrate, Knex migrations, or Prisma).

---

### 21. **Missing Indexes on Frequently Queried Columns**
**Tables:** `tasks`  
**Columns:** `user_id`, `created_at`, `status`, `task_date`  
**Impact:** Slow queries as data grows.  
**Fix:** Add composite indexes: `(user_id, created_at)`, `(user_id, status)`.

---

### 22. **Socket.IO No Disconnect Cleanup for User Rooms**
**File:** `backend/src/socket.js`  
**Issue:** When user disconnects, no cleanup of joined rooms. Memory leak over time.  
**Fix:** Track user sockets, leave rooms on disconnect.

---

### 23. **TypeScript Types Not Fully Used**
**Files:** 
- `frontend/src/hooks/useTasks.ts` - has good types
- But `Dashboard.jsx` uses JS, no types
- `client.ts` types not exported/shared

**Fix:** Migrate Dashboard to TSX, share types via `@types` or shared package.

---

### 24. **No Request Validation Middleware**
**Files:** All routes  
**Issue:** Validation done inline in controllers.  
**Fix:** Use `express-validator` or `zod` middleware for consistent validation.

---

### 25. **Hardcoded JWT Secret Fallback**
**File:** `backend/src/socket.js` line 22  
**Issue:** `process.env.JWT_SECRET || 'your-secret-key'` - fallback weak secret in production.  
**Fix:** Throw error if JWT_SECRET not set in production.

---

## 🔧 Technical Debt / Refactoring Opportunities

| Area | Description | Effort |
|------|-------------|--------|
| **State Management** | Mix of React Context, React Query, local state. Standardize. | Medium |
| **Component Library** | UI components in `/ui` but not all used consistently (Dashboard uses inline styles) | Low |
| **Testing** | No unit/integration/e2e tests | High |
| **API Documentation** | No OpenAPI/Swagger specs | Low |
| **Logging** | Only `console.error`. Add structured logging (pino/winston) | Low |
| **Monitoring** | No health checks beyond `/health`, no metrics | Medium |
| **Docker** | No Dockerfile for deployment | Low |
| **CI/CD** | No GitHub Actions / pipeline | Medium |

---

## 📁 File Structure Issues

```
backend/
├── src/
│   ├── config/db.js          ✅ OK
│   ├── middleware/           ✅ OK
│   ├── modules/
│   │   ├── auth/             ✅ OK
│   │   ├── tasks/            ✅ OK
│   │   └── users/            ✅ OK
│   ├── socket.js             ⚠️ Auth added but not used for targeted emits
│   └── app.js                ✅ OK

frontend/
├── src/
│   ├── api/
│   │   ├── client.js         ⚠️ Duplicate of client.ts
│   │   └── client.ts         ✅ Better (has refresh logic)
│   ├── components/
│   │   ├── ui/               ✅ Good design system
│   │   ├── ProtectedRoute.jsx ✅ OK
│   │   └── PageTransition.jsx ✅ OK
│   ├── context/
│   │   ├── AuthContext.jsx   ⚠️ Client-side JWT decode
│   │   └── DarkModeContext.jsx ✅ OK
│   ├── hooks/
│   │   └── useTasks.ts       ✅ Good React Query usage
│   ├── pages/
│   │   ├── Dashboard.jsx     ⚠️ Too large, mixed concerns
│   │   ├── Login.jsx         ✅ OK
│   │   ├── Register.jsx      ✅ OK
│   │   └── Profile.jsx       ✅ OK
│   ├── schemas/              ✅ Good Zod schemas
│   ├── socket.js             ⚠️ Reconnect auth bug
│   └── App.jsx               ✅ OK
```

---

## ✅ Recently Fixed (This Session)

| Issue | File | Fix Applied |
|-------|------|-------------|
| Select onValueChange/onChange | Dashboard.jsx | Changed to onChange with direct value |
| Amount input formatting | Dashboard.jsx | Simplified with helper functions |
| Week date calculation (backend) | tasks.service.js | Fixed to 7 days ago via timestamp |
| Week date calculation (frontend) | Dashboard.jsx | Fixed to match backend |
| Socket.IO JWT auth (frontend) | socket.js | Added auth token, reconnect handler |
| Socket.IO JWT auth (backend) | socket.js | Added middleware, userId on socket |

---

## 🎯 Recommended Fix Order

1. **Critical:** Implement `/auth/refresh` endpoint + refresh token storage
2. **Critical:** Fix Socket.IO to emit per-user (not broadcast)
3. **High:** Fix socket reconnection auth bug
4. **High:** Consolidate `client.js` → `client.ts`
5. **High:** Remove client-side JWT decode, return user from login
6. **Medium:** Add rate limiting to auth endpoints
7. **Medium:** Add DB indexes
8. **Medium:** Split Dashboard.jsx into components
9. **Low:** Add migration system
10. **Low:** Add tests, CI/CD, Docker

---

## 📝 Notes for Future Sessions

- When fixing Socket.IO targeted emits: modify `tasks.controller.js` to use `getIO().to(userId).emit()` and ensure `backend/src/socket.js` joins user to room on connect
- The `useTasks.ts` hook is well-designed but unused in Dashboard - consider migrating Dashboard to use React Query
- Frontend has both `.js` and `.tsx` files - standardize on TypeScript
- Design system in `frontend/src/components/ui/` is solid but underutilized

---

*Generated automatically. Update this file after each major fix session.*