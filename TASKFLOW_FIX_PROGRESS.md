# TaskFlow Fix Progress

Last updated: 2026-08-04 11:00

## Current Status

Current issue: #2 - Refresh token endpoint
Status: IN_PROGRESS

## Completed

- [x] #1 Socket.IO authentication / broadcast fix
- [ ] #2 Refresh token endpoint
- [ ] #3 Refresh token storage
- [ ] #4 Google login password handling
- [ ] #5 Socket.IO reconnect authentication bug
- [ ] #6 Date filter "Week" (already fixed)
- [ ] #7 Select onValueChange/onChange (already fixed)
- [ ] #8 Amount input formatting (already fixed)
- [ ] #9 Duplicate API client .js / .ts
- [ ] #10 Client-side JWT decode
- [ ] #11 Input sanitization
- [ ] #12 Socket event redundant API calls / race condition
- [ ] #13 Task status validation
- [ ] #14 Auth rate limiting
- [ ] #15 CORS / CSRF
- [ ] #16 Centralized error handling
- [ ] #17 Hardcoded Google Client ID
- [ ] #18 Chuẩn hóa .js / .ts
- [ ] #19 Tách Dashboard.jsx
- [ ] #20 Database migration
- [ ] #21 Database indexes
- [ ] #22 Socket disconnect cleanup
- [ ] #23 TypeScript types
- [ ] #24 Request validation middleware
- [ ] #25 JWT secret fallback

## Current Issue

### #1 - Socket.IO Authentication / User Data Leakage

**Status:** ✅ FIXED

**Root cause:**
- Backend socket.js had authentication middleware that sets `socket.userId` but never joined the user to a private room
- tasks.controller.js used `getIO().emit()` which broadcasts to ALL connected sockets
- This caused data leakage: all authenticated users received ALL users' task events

**Files changed:**
- backend/src/socket.js - Added `socket.join(socket.userId.toString())` on connection
- backend/src/modules/tasks/tasks.controller.js - Changed 3 emit calls from `getIO().emit()` to `getIO().to(req.user.id.toString()).emit()`

**Changes:**
- socket.js lines 38-42: Join user to private room named after their userId
- tasks.controller.js lines 12, 51, 63: Emit to specific user room instead of broadcast

**Tests:**
- Backend syntax check: `node -c src/socket.js src/modules/tasks/tasks.controller.js` → PASS
- Frontend build: `npm run build` → PASS
- Server starts without syntax errors

**Verification:**
- Code compiles correctly
- No new lint errors introduced
- Server starts successfully
- Logic ensures each user only receives their own task events

**Regression:** No known regression.

**Remaining risks:** None identified. Full integration test requires running database.

## Next Issue

### #2 - Refresh token endpoint

**Status:** IN_PROGRESS

**Root cause:**
- Frontend (`client.ts` lines 58-64) expects `/auth/refresh` endpoint to refresh access tokens
- Backend has no such endpoint implemented
- Without refresh tokens, users get logged out when access token expires (1 day)

**Files to change:**
- backend/src/modules/auth/auth.routes.js - Add POST /auth/refresh route
- backend/src/modules/auth/auth.controller.js - Add refreshToken handler
- backend/src/modules/auth/auth.service.js - Add refresh token generation, validation, rotation
- Database: Need to add refresh_token column to users table (or create separate table)

**Expected behavior:**
- Login/register returns both accessToken (short-lived) and refreshToken (long-lived)
- Refresh token stored in database with expiry
- POST /auth/refresh validates refresh token, issues new access token + rotates refresh token
- Frontend can call refresh endpoint when access token expires

**Security / regression risk:**
- Need to implement refresh token rotation (invalidate old, issue new)
- Need to store refresh tokens securely (hashed in DB)
- Need to handle token revocation on logout