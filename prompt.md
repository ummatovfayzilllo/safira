# EdFix Frontend Development - Continuation Prompt

**Project:** EdFix Frontend (Next.js 16 + React 19 + TypeScript + Tailwind CSS)  
**Base URL:** `http://localhost:15975/api`  
**Frontend URL:** `http://localhost:3000`  
**Language:** Uzbek (O'zbek tilida)

---

## 📋 Project Status

### ✅ COMPLETED (17 Commits, 4,137+ Lines)

1. **Authentication System**
   - Login, Register (2-step), Profile Setup
   - Token management & auto-refresh
   - Protected routes

2. **Navigation & Layout**
   - Sidebar (collapsible desktop + mobile drawer)
   - Header with profile dropdown
   - DashboardLayout wrapper

3. **User Profile CRUD**
   - Edit name, image, password
   - Delete account

4. **Admin Users Management**
   - Users table
   - Create users with roles
   - Smart FormData/JSON handling

5. **Mentor Categories CRUD**
   - Full CRUD for course categories

6. **Mentor Courses CRUD**
   - Create courses with banner/video uploads
   - Category selector
   - Level dropdown
   - Published status

7. **Dashboard & 16 Navigation Pages**
   - Main dashboard with stats
   - Placeholder pages for all navigation items

8. **Dark/Light Theme**
   - Tailwind dark mode
   - Context API for theme toggle
   - Persistent localStorage
   - System preference detection
   - Dark mode button in header (🌙/☀️)

9. **Lesson Modules CRUD** (First Phase 1 task)
   - Create/Read/Update/Delete modules
   - Course selector
   - Dark mode support
   - **Bug fixed 2026-07-19 (session 2):** edit/delete were calling
     `/lesson-modules/{id}` (404 against the real backend). Real
     endpoints are `/lesson-modules/update-one/{id}` and
     `/lesson-modules/delete-one/{id}` — fixed in
     `app/dashboard/mentor/lesson-modules/page.tsx`.

10. **Lessons CRUD** (`app/dashboard/mentor/lessons/page.tsx`) ✅ — done + verified 2026-07-19 (session 2)
   - Create lesson with required video upload (multipart, `video` field required — backend crashes without it)
   - List lessons, resolve module name via lesson-modules getall
   - Edit (JSON PATCH `/lessons/update-one/:id` — video NOT editable via this endpoint, backend has no route for it)
   - Delete (`/lessons/delete-one/:id`)
   - Added "Darslar" entry to Sidebar.tsx under the "Mentor" section, linking to `/dashboard/mentor/lessons`
   - Verified end-to-end against the real local backend (`~/Desktop/edfix_clone`, port 15975) via curl: create-with-video, getall, update, delete all confirmed working with the exact payload shapes the page sends. Video URLs returned by the backend are already absolute (`http://localhost:15975/api/video/...`) and directly usable as `<video src>`.

---

## ⚠️ IMPORTANT — Endpoint verification (learned session 2, 2026-07-19)

`api_info.md` and `API_QUICK_REFERENCE.md` are **not fully reliable** —
several endpoints they document don't match the real backend (e.g.
lesson-modules update/delete, course-categories `create`/`get-all` vs
`create-one`/`getall`). Before wiring up a new CRUD page, verify the
real routes against the running backend's swagger JSON:

```bash
curl -s http://localhost:15975/api-docs-json | python3 -m json.tool
```

Or grep the backend source directly if available locally at
`~/Desktop/edfix_clone/src/modules/<resource>/` (controller has the
routes, dto/ has the required/optional fields, prisma/schema.prisma
has the data model). This is much more reliable than the committed
markdown docs.

Also: the `features/` directory (Zustand stores, axios instance, auth
hooks — everything the app imports from `@/features`) had **never
been committed to git** despite being used since the first auth
commit. Fixed in session 2 — it's now tracked. If a future session
finds untracked-but-depended-upon directories again, commit them
before building on top.

---

## ⏳ REMAINING TASKS (12 CRUDs + Phase 2/3)

### 🔴 PHASE 1 (High Priority - Core Learning Path)

**Next Tasks (In Order):**
1. **Lesson Files CRUD** (~300 lines) — NEXT
   - Upload PDF/DOC files
   - File management

2. **Lesson Views** (~150 lines)
   - Mark lesson as watched
   - Progress tracking

3. **Homeworks CRUD** (~350 lines)
   - Create homework assignments
   - Student submission view

4. **Homework Submissions CRUD** (~500 lines)
   - Student submissions
   - Mentor grading interface
   - Status tracking (PENDING/APPROVED/REJECTED)

5. **Exams/Questions CRUD** (~450 lines)
   - Multiple choice question creation
   - 4 variants (A, B, C, D)
   - Answer key management

6. **Exam Results CRUD** (~300 lines)
   - Score calculation
   - Pass/fail determination
   - Certificate trigger

### 🟡 PHASE 2 (Medium Priority - Engagement)

8. **Questions & Answers CRUD** (~450 lines)
9. **Ratings/Reviews CRUD** (~250 lines)
10. **Mentor Profiles CRUD** (~350 lines)

### 🟢 PHASE 3 (Business Logic)

11. **Assigned Courses CRUD** (~250 lines) - Admin assigns courses
12. **Purchased Courses CRUD** (~400 lines) - Payment integration
13. **Contact Form** (~200 lines) - Public inquiry form

---

## 🔧 Technical Guidelines

### Dark Mode Implementation
- Use Tailwind `dark:` prefix for all components
- Colors: `text-gray-900 dark:text-gray-50`
- Backgrounds: `bg-white dark:bg-gray-900`
- Borders: `border-gray-200 dark:border-gray-700`
- Apply `transition-colors duration-300` for smooth switching

### API Integration
- Base: `http://localhost:15975/api`
- All requests need `Authorization: Bearer {token}`
- Use FormData for file uploads
- Response format: `{ message, data }`
- Error format: `{ statusCode, message, error }`

### File Uploads
- Use FormData for multipart/form-data
- Check if file exists before appending
- Images: `.jpg`, `.png`, `.gif`
- Videos: `.mp4`, `.webm`, etc.
- Documents: `.pdf`, `.doc`, `.docx`

### Form Validation
- Client-side: required fields, min/max length
- Server-side: backend validates
- Show errors in red banner
- Show success in green banner

### Styling Conventions
- Grid: `grid md:grid-cols-2 lg:grid-cols-3`
- Cards: `bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg`
- Buttons: `px-4 py-2 rounded-lg font-medium transition`
- Modals: `fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 z-50`
- Loading: "Yuklanyapti..."
- Empty: "Hozircha {resource} yo'q"

### Access Control
- **Student/User:** View own data
- **Mentor:** Create/edit own courses, grade homework, answer questions
- **Admin:** All operations + user/role management

---

## 📁 Project Structure

```
app/
├── layout.tsx (with ThemeProvider)
├── theme-context.tsx (Theme toggle logic)
├── page.tsx (Landing page)
├── login/ (Login page)
├── register/ (Register page)
├── profile-setup/ (After registration)
├── dashboard/
│   ├── page.tsx (Main dashboard)
│   ├── profile/ (User profile CRUD)
│   ├── admin/users/ (Admin users CRUD)
│   ├── mentor/
│   │   ├── categories/ (Categories CRUD)
│   │   ├── courses/ (Courses CRUD)
│   │   ├── lesson-modules/ (Lesson Modules CRUD) ✅
│   │   ├── lessons/ (Lessons CRUD) - NEXT
│   │   ├── [other pages]
│   └── [other navigation pages]
components/
├── Header.tsx (with theme toggle)
├── Sidebar.tsx (Mentor section added)
└── DashboardLayout.tsx
features/
├── auth/hocks/auth.hocks.ts (Auth hooks)
├── stores/ (Zustand stores)
└── api/axiosIntanse.ts (API config)

.claude/task_history/
├── COMPLETED_TASKS.md (All done)
├── REMAINING_CRUDS.md (Task list)
├── [other docs]
```

---

## 🚀 How to Continue

### Step 1: Start Development Server
```bash
npm run dev
# Opens http://localhost:3000
```

### Step 2: Pick Next Task
From `REMAINING_CRUDS.md`, the next is **Lesson Files CRUD**.

### Step 3: Implementation Template
Each CRUD follows this pattern:
1. Create page component
2. Add dark mode support
3. Implement API calls
4. Add form validation
5. Handle errors/success
6. Update sidebar if needed
7. Test in browser

### Step 4: Commit
```bash
git add [files]
git commit -m "Implement Lessons CRUD - [brief description]"
```

---

## 📊 Monitoring Progress

**Check Status:**
```bash
git log --oneline | head -20  # View commits
npm run lint               # Check TypeScript/ESLint
```

**Update Progress:**
- Update `.claude/task_history/STATUS.md` after Phase 1 completion
- Update `.claude/task_history/COMPLETED_TASKS.md` periodically

---

## 🎯 Key Reminders

1. **Always use dark mode classes** on new components
2. **Test theme toggle** after adding components
3. **Use FormData** for file uploads
4. **Check API endpoints** in `api_info.md`
5. **Follow Uzbek language** for UI text
6. **Add to sidebar** if creating new mentor/admin feature
7. **Mentor/Admin access control** on protected routes
8. **Auto-refresh lists** after create/update/delete

---

## 📚 Reference Files

- **API Endpoints:** `api_info.md` (114+ endpoints documented)
- **Completed Work:** `.claude/task_history/COMPLETED_TASKS.md`
- **Task Roadmap:** `.claude/task_history/REMAINING_CRUDS.md`
- **Theme Setup:** `app/theme-context.tsx`
- **Example CRUD:** `app/dashboard/mentor/lessons/page.tsx` (has file upload + edit/delete correctly wired)

---

## 💡 Next Session Quick Start

1. Read this prompt
2. Check git log to see last work
3. **Verify real endpoints first:** `curl -s http://localhost:15975/api-docs-json | python3 -m json.tool` — don't trust `api_info.md`/`API_QUICK_REFERENCE.md` blindly, see the warning section above
4. Start with **Lesson Files CRUD** (`.claude/task_history/REMAINING_CRUDS.md` - item #1). Endpoints are versioned oddly: `POST /lesson-files/v1/create-one`, `GET /lesson-files/v2/get-all`, `GET /lesson-files/v3/get-one/:id`, `PATCH /lesson-files/v4/update-one/:id`, `DELETE /lesson-files/v5/delete-one/:id` — confirm this against swagger-json before wiring up, it's unusual
5. Use `app/dashboard/mentor/lessons/page.tsx` as template (multipart file upload pattern, required-on-create-only file field)
6. Test dark mode
7. Consider delegating the actual page-writing to a sub-agent to save tokens once the endpoint/data-model research is done
8. Commit

---

**Status:** Ready for next session!  
**Last Updated:** 2026-07-19  
**Sessions Completed:** 1
