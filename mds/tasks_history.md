# Tasks History

## Session: Auth System Implementation & CORS Setup

### ✅ Completed Tasks

| # | Task | Status | Date |
|---|------|--------|------|
| 1 | Email credentials .env'dan o'qish, ConfigService integration | ✅ Done | 2026-07-19 |
| 2 | OTP HMAC-SHA256 signature verification | ✅ Done | 2026-07-19 |
| 3 | Register/Verify endpoints | ✅ Done | 2026-07-19 |
| 4 | Login endpoint | ✅ Done | 2026-07-19 |
| 5 | Reset-Password endpoints (OTP-based) | ✅ Done | 2026-07-19 |
| 6 | Refresh-Token endpoint | ✅ Done | 2026-07-19 |
| 7 | Logout endpoint (Protected) | ✅ Done | 2026-07-19 |
| 8 | CORS dynamic configuration (.env ALLOWED_ORIGINS) | ✅ Done | 2026-07-19 |
| 9 | EnvironmentConfig helper class | ✅ Done | 2026-07-19 |
| 10 | Config centralization (src/common/config) | 🔄 In Progress | 2026-07-19 |

### 📝 Implementation Details

**Auth Flow:**
- Register → Verify (OTP) → Login → Tokens (Access+Refresh)
- Reset-Password → Verify → Update Password
- Refresh-Token → New Tokens
- Logout → Clear Cookies

**Security:**
- HMAC-SHA256 OTP signatures
- httpOnly cookies (accessToken, refreshToken)
- ConfigService for credentials
- Protected routes (logout requires token)

**CORS:**
- Comma-separated origins in .env
- Dynamic validation on each request
- Default: localhost:5173, 3000, 15975

### 📚 Key Files
- `src/core/auth/` - Auth logic & endpoints
- `src/common/config/` - Config centralization
- `src/core/use_initilation.ts` - Global pipes & CORS
- `.env.example` - Environment template
