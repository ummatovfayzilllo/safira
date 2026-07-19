# Remaining CRUD Operations - Implementation Roadmap

**Date:** 2026-07-19  
**Status:** Planned for future implementation  
**Total Remaining CRUDs:** 14

---

## ✅ COMPLETED CRUDS (3)

1. **Users** - Admin panel
2. **Courses** - Mentor management
3. **Course Categories** - Mentor management

---

## ⏳ REMAINING CRUDS

### 1. Lesson Modules CRUD

**Endpoint:** `/lesson-modules`  
**Access:** Mentor/Admin  
**Level:** High Priority

**Operations:**
- POST `/lesson-modules/create` - Create module
- GET `/lesson-modules/getall` - List modules
- GET `/lesson-modules/get-one/:id` - Get module details
- PATCH `/lesson-modules/:id` - Update module
- DELETE `/lesson-modules/:id` - Delete module

**Data Model:**
```javascript
{
  name: "Module 1: Basics",      // required
  courseId: "uuid",               // required
  createdAt: "...",
  updatedAt: "..."
}
```

**UI Components Needed:**
- [ ] Lesson Modules list page (`/dashboard/mentor/lesson-modules`)
- [ ] Create module modal
- [ ] Edit module form
- [ ] Delete confirmation

**Related To:** Courses (parent resource)

---

### 2. Lessons CRUD

**Endpoint:** `/lessons`  
**Access:** Mentor/Admin  
**Level:** High Priority

**Operations:**
- POST `/lessons/create-one` - Create lesson (with video)
- GET `/lessons/getall` - List lessons
- GET `/lessons/get-one/:id` - Get lesson
- PATCH `/lessons/:id` - Update lesson
- DELETE `/lessons/:id` - Delete lesson

**Data Model:**
```javascript
{
  name: "Lesson 1: Introduction",        // required
  about: "Lesson description",           // optional
  lessonModulId: "uuid",                 // required
  video: File,                           // optional, multipart
  createdAt: "...",
  updatedAt: "..."
}
```

**UI Components Needed:**
- [ ] Lessons list page (`/dashboard/mentor/lessons`)
- [ ] Create lesson modal (with video upload)
- [ ] Edit lesson form
- [ ] Delete confirmation

**Related To:** Lesson Modules (parent resource)  
**Features:** Video upload, FormData handling

---

### 3. Lesson Files CRUD

**Endpoint:** `/lesson-files`  
**Access:** Mentor/Admin  
**Level:** Medium Priority

**Operations:**
- POST `/lesson-files/v1/create-one` - Upload file
- GET `/lesson-files/getall` - List files
- DELETE `/lesson-files/:id` - Delete file

**Data Model:**
```javascript
{
  note: "Lecture slides",           // required description
  lessonId: "uuid",                 // required
  file: File,                       // required, PDF/DOC/etc
  createdAt: "..."
}
```

**UI Components Needed:**
- [ ] File upload section in lesson detail
- [ ] Files list with download buttons
- [ ] Delete file option

**Related To:** Lessons  
**Features:** File upload (PDF, DOC, etc), FormData

---

### 4. Lesson Views (Mark as Watched)

**Endpoint:** `/lesson-views`  
**Access:** Student  
**Level:** High Priority (for progress tracking)

**Operations:**
- POST `/lesson-views` - Mark lesson as watched
- GET `/lesson-views/getall` - Get watched lessons

**Data Model:**
```javascript
{
  userId: "uuid",        // required
  lessonId: "uuid"       // required
}
```

**Trigger:**
- Auto-call when student reaches end of video
- Track completion status
- Show progress indicator

**UI Components Needed:**
- [ ] Progress tracking in lesson view
- [ ] "Mark as watched" button
- [ ] Completion badge

**Related To:** Lessons, Student progress

---

### 5. Homeworks CRUD

**Endpoint:** `/homeworks`  
**Access:** Mentor/Admin (create), Student (view)  
**Level:** High Priority

**Operations:**
- POST `/homeworks/create` - Create homework
- GET `/homeworks/getall` - List homeworks
- GET `/homeworks/get-one/:id` - Get homework
- PATCH `/homeworks/:id` - Update homework
- DELETE `/homeworks/:id` - Delete homework

**Data Model:**
```javascript
{
  task: "Task description",        // required
  lessonId: "uuid",                // required
  files: File[],                   // optional, max 10 files
  createdAt: "..."
}
```

**UI Components Needed:**
- [ ] Homeworks list page
- [ ] Create homework modal (mentor)
- [ ] Homework detail view (student)
- [ ] Multiple file upload

**Related To:** Lessons  
**Features:** Multiple file upload, FormData

---

### 6. Homework Submissions CRUD

**Endpoint:** `/homework-submissions`  
**Access:** Student (create), Mentor (grade)  
**Level:** High Priority

**Operations:**
- POST `/homework-submissions/create` - Submit homework
- GET `/homework-submissions/getall` - List submissions
- PATCH `/homework-submissions/:id` - Grade submission
- DELETE `/homework-submissions/:id` - Delete submission

**Data Model:**
```javascript
{
  text: "Student answer/explanation",    // required
  reason: "Why this answer",             // required
  homeworkId: "uuid",                    // required
  userId: "uuid",                        // required
  status: "PENDING|APPROVED|REJECTED",   // required, default: PENDING
  files: File,                           // required, multipart
  createdAt: "..."
}
```

**UI Components Needed:**
- [ ] Homework submission form (student)
- [ ] Submissions list (mentor)
- [ ] Grading interface with status update
- [ ] File submission handling

**Related To:** Homeworks  
**Features:** File upload, Status tracking, Grading

---

### 7. Exams/Questions CRUD

**Endpoint:** `/exams`  
**Access:** Mentor/Admin (create), Student (take)  
**Level:** High Priority

**Operations:**
- POST `/exams/create` - Create exam question
- GET `/exams/getall` - List questions
- GET `/exams/get-one/:id` - Get question
- PATCH `/exams/:id` - Update question
- DELETE `/exams/:id` - Delete question

**Data Model:**
```javascript
{
  question: "What is...",          // required
  variantA: "Option A",            // required
  variantB: "Option B",            // required
  variantC: "Option C",            // required
  variantD: "Option D",            // required
  answer: "A|B|C|D",               // required
  lessonModulId: "uuid"            // required
}
```

**UI Components Needed:**
- [ ] Exam/Test creation form (mentor)
- [ ] Questions list management
- [ ] Exam taker interface (student)
- [ ] Question preview

**Related To:** Lesson Modules  
**Complexity:** Multiple choice test system

---

### 8. Exam Results CRUD

**Endpoint:** `/exam-results`  
**Access:** Student (submit), Mentor (view)  
**Level:** High Priority

**Operations:**
- POST `/exam-results/create` - Submit exam result
- GET `/exam-results/getall` - List results
- GET `/exam-results/get-one/:id` - Get result detail

**Data Model:**
```javascript
{
  lessonModulId: "uuid",      // required
  userId: "uuid",             // required
  passed: true|false,         // required
  corrects: 8,                // required, correct answers
  wrongs: 2,                  // required, wrong answers
  score: 80,                  // calculated (corrects / total * 100)
  createdAt: "..."
}
```

**UI Components Needed:**
- [ ] Exam result display (score, passed/failed)
- [ ] Results list (student view)
- [ ] Results analytics (mentor view)
- [ ] Certificate trigger (if passed)

**Related To:** Exams, Lesson Modules

---

### 9. Questions & Answers (Q&A System)

**Endpoints:**
- `/questions` - Student questions to mentor
- `/question-answers` - Mentor answers to questions

**Access:** Student (ask), Mentor (answer)  
**Level:** Medium Priority

#### Questions:
```javascript
{
  userId: "uuid",          // required
  courseId: "uuid",        // required
  text: "Question text",   // required
  read: false,             // optional, read status
  readAt: "...",          // optional, when mentor read
  files: File[],           // optional
  createdAt: "..."
}
```

#### Question Answers:
```javascript
{
  userId: "uuid",          // required
  questionId: "uuid",      // required
  text: "Answer text",     // required
  files: File,             // optional
  createdAt: "..."
}
```

**UI Components Needed:**
- [ ] Ask Question form (student)
- [ ] Questions list (mentor) - unread indicator
- [ ] Question detail view
- [ ] Answer form (mentor)
- [ ] Discussion thread view

**Features:** Q&A system, Threading, File attachments, Read status

---

### 10. Ratings/Reviews CRUD

**Endpoint:** `/rating`  
**Access:** Student (create)  
**Level:** Medium Priority

**Operations:**
- POST `/rating` - Rate course
- GET `/rating/getall` - List ratings
- PATCH `/rating/:id` - Update rating
- DELETE `/rating/:id` - Delete rating

**Data Model:**
```javascript
{
  userId: "uuid",          // required
  courseId: "uuid",        // required
  comment: "Nice course",  // optional
  rating: 4.5,             // implied (0-5)
  createdAt: "..."
}
```

**UI Components Needed:**
- [ ] Rating form (after course completion)
- [ ] Star rating widget (0-5)
- [ ] Comment textarea
- [ ] Ratings list/display on course

**Related To:** Courses

---

### 11. Mentor Profiles CRUD

**Endpoint:** `/mentor-profiles`  
**Access:** Mentor (own), Public (view)  
**Level:** Medium Priority

**Operations:**
- POST `/mentor-profiles/create` - Create profile
- GET `/mentor-profiles/getall` - List mentors
- GET `/mentor-profiles/get-one/:id` - Get profile
- PATCH `/mentor-profiles/:id` - Update profile
- DELETE `/mentor-profiles/:id` - Delete profile

**Data Model:**
```javascript
{
  userId: "uuid",          // required
  about: "Bio",            // optional
  job: "Title",            // optional
  experience: 5,           // optional, years
  telegram: "url",         // optional
  instagram: "url",        // optional
  linkedin: "url",         // optional
  facebook: "url",         // optional
  github: "url",           // optional
  website: "url",          // optional
  createdAt: "..."
}
```

**UI Components Needed:**
- [ ] Mentor profile setup form
- [ ] Profile edit page
- [ ] Social links management
- [ ] Public mentor profile view
- [ ] Mentors directory/list

**Related To:** Users (Mentor role)

---

### 12. Assigned Courses (Admin)

**Endpoint:** `/assigned-courses`  
**Access:** Admin only  
**Level:** Medium Priority

**Operations:**
- POST `/assigned-courses/create-one` - Assign course to student
- GET `/assigned-courses/getall` - List assignments
- DELETE `/assigned-courses/:id` - Remove assignment

**Data Model:**
```javascript
{
  userId: "uuid",          // required
  courseId: "uuid",        // required
  assignedAt: "..."
}
```

**UI Components Needed:**
- [ ] Assign course modal (admin)
- [ ] Student selector dropdown
- [ ] Course selector dropdown
- [ ] Assignments list
- [ ] Bulk assignment option

**Related To:** Users, Courses  
**Access Level:** Admin only

---

### 13. Purchased Courses (Payment)

**Endpoint:** `/purcached-courses`  
**Access:** Student (create), Admin (view)  
**Level:** High Priority (payment related)

**Operations:**
- POST `/purcached-courses/create-one` - Record purchase
- GET `/purcached-courses/getall` - List purchases
- GET `/purcached-courses/get-one/:id` - Purchase details

**Data Model:**
```javascript
{
  userId: "uuid",                    // required
  courseId: "uuid",                  // required
  amount: 50000,                     // required
  paidVia: "PAYME|CLICK|CASH",      // required
  purcachedAt: "2024-01-01T...",
  transactionId: "...",              // for payment verification
  status: "COMPLETED|PENDING|FAILED"
}
```

**UI Components Needed:**
- [ ] Payment form (course purchase)
- [ ] Payment method selector (3 options)
- [ ] Price calculation (with discount)
- [ ] Payment confirmation
- [ ] Purchase history (student)
- [ ] Transaction verification (admin)

**Related To:** Courses  
**Complexity:** Payment gateway integration needed

---

### 14. Contact Form

**Endpoint:** `/contact`  
**Access:** Public (everyone)  
**Level:** Low Priority

**Operations:**
- POST `/contact` - Submit message

**Data Model:**
```javascript
{
  phone: "+998...",        // required, Uzbek format
  message: "Message text", // required
  name: "Name",            // implied
  email: "email",          // implied
  submittedAt: "..."
}
```

**UI Components Needed:**
- [ ] Contact form page
- [ ] Phone input with validation
- [ ] Message textarea
- [ ] Submit button
- [ ] Success message
- [ ] Email verification (optional)

**Related To:** Landing page, Footer

---

## 📊 Priority Classification

### 🔴 High Priority (Must Do)
1. Lesson Modules CRUD
2. Lessons CRUD
3. Lesson Views
4. Homeworks CRUD
5. Homework Submissions CRUD
6. Exams/Questions CRUD
7. Exam Results CRUD
8. Purchased Courses (Payment)

### 🟡 Medium Priority (Should Do)
1. Lesson Files CRUD
2. Questions & Answers CRUD
3. Ratings CRUD
4. Mentor Profiles CRUD
5. Assigned Courses CRUD

### 🟢 Low Priority (Nice to Have)
1. Contact Form

---

## 🎯 Implementation Order

1. **Phase 1 (Core Learning Path):**
   - Lesson Modules → Lessons → Lesson Views
   - Homeworks → Homework Submissions
   - Exams → Exam Results

2. **Phase 2 (Engagement):**
   - Q&A System
   - Ratings
   - Mentor Profiles

3. **Phase 3 (Admin & Business):**
   - Assigned Courses
   - Purchased Courses (Payment)
   - Contact Form

---

## 📈 Complexity Levels

| CRUD | Complexity | Estimated Lines | Components |
|------|-----------|-----------------|------------|
| Lesson Modules | Low | 200 | 3 |
| Lessons | Medium | 400 | 4 |
| Lesson Files | Medium | 300 | 3 |
| Lesson Views | Low | 150 | 2 |
| Homeworks | Medium | 350 | 4 |
| Homework Submissions | High | 500 | 5 |
| Exams | High | 450 | 4 |
| Exam Results | Medium | 300 | 3 |
| Q&A System | Medium | 450 | 5 |
| Ratings | Low | 250 | 3 |
| Mentor Profiles | Medium | 350 | 4 |
| Assigned Courses | Low | 250 | 3 |
| Purchased Courses | High | 400 | 5 |
| Contact Form | Low | 200 | 2 |

**Total Estimated:** ~5,200 lines of code, 60+ components

---

## 🔧 Technical Requirements

### File Uploads:
- Lessons (video)
- Lesson Files (PDF, DOC)
- Homeworks (multiple files)
- Homework Submissions (files)
- Questions (files)
- Question Answers (files)

### Complexity Features:
- Payment integration (Payme, Click, Cash)
- Multi-file upload
- Status tracking (PENDING, APPROVED, REJECTED, COMPLETED)
- Threading (Q&A)
- Progress calculation (Exam scores, Course completion)
- Notifications (New questions, Answers, Grades)

### Access Control:
- Student: View assigned/purchased, Submit, Ask questions, Rate
- Mentor: Create lessons, Grade homework, Answer questions, View ratings
- Admin: All operations, Assign courses, View all data, Manage payments

---

## 🚀 Next Steps

1. Start with **Phase 1** features (highest priority)
2. Implement **Lesson Modules** first (simplest)
3. Build **Lessons** (extends modules)
4. Add **Lesson Views** for progress tracking
5. Continue with Homeworks and Exams

---

**Ready to start?** Pick the first CRUD and begin! 🎯
