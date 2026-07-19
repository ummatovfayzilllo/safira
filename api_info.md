# API Documentation - Frontend Reference

**Version**: 1.0  
**Last Updated**: 2026-07-19  
**Total Endpoints**: 115+ (Admin new-user endpoint qo'shildi)  
**Base URL**: `http://localhost:3000`

---

## 📋 TABLE OF CONTENTS

1. [Authentication](#authentication)
2. [Request/Response Format](#requestresponse-format)
3. [Auth Endpoints](#auth-endpoints)
4. [Users Endpoints](#users-endpoints)
5. [Courses Endpoints](#courses-endpoints)
6. [Course Categories](#course-categories)
7. [Assigned Courses](#assigned-courses)
8. [Purcached Courses (Purchased)](#purcached-courses)
9. [Lesson Modules](#lesson-modules)
10. [Lessons](#lessons)
11. [Lesson Files](#lesson-files)
12. [Lesson Views](#lesson-views)
13. [Homeworks](#homeworks)
14. [Homework Submissions](#homework-submissions)
15. [Exams](#exams)
16. [Exam Results](#exam-results)
17. [Questions](#questions)
18. [Question Answers](#question-answers)
19. [Ratings](#ratings)
20. [Mentor Profiles](#mentor-profiles)
21. [Contact](#contact)
22. [Admin](#admin)
23. [File Streaming](#file-streaming)
24. [Error Handling](#error-handling)
25. [Data Types & Enums](#data-types--enums)

---

## AUTHENTICATION

### JWT Token Management

**Access Token**: Cookies yoki Authorization header-da `Bearer <token>`  
**Refresh Token**: Cookies-da automatic saqlashiladi  
**Cookie Settings**: `httpOnly: true`, `secure: true` (production-da)

### Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json (yoki multipart/form-data file upload uchun)
```

### Token Expiration & Refresh:
- Access Token: 1 soat
- Refresh Token: 7 kun
- Automatic refresh `/auth/refresh-token` orqali

---

## REQUEST/RESPONSE FORMAT

### Success Response (200, 201):
```json
{
  "message": "O'zbek tilida habar",
  "data": { /* actual data */ }
}
```

### Error Response (400, 401, 500):
```json
{
  "statusCode": 400,
  "message": "Xato habar",
  "error": "BadRequest"
}
```

### Multipart/form-data Example:
```javascript
const formData = new FormData();
formData.append('fullName', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('password', 'password123');
formData.append('image', fileInput.files[0]); // optional

await fetch('/users/create', {
  method: 'POST',
  body: formData
});
```

---

## AUTH ENDPOINTS

### 1. POST `/auth/register`
**Ro'yxatdan o'tish (Verification code emailga yuboriladi)**

**Request**:
```json
{
  "fullName": "string (required, min 3 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)"
}
```

**Response** (201):
```json
{
  "message": "Verification code sent to email",
  "data": {
    "email": "user@example.com"
  }
}
```

**Frontend Flow**:
1. Foydalanuvchi ro'yxatdan o'tadi
2. Email verification screen ko'rsatiladi
3. `/auth/verify` ga tasdiq kodi yuboriladi

---

### 2. POST `/auth/verify`
**Tasdiq kodini tekshirish va tokens olish**

**Request**:
```json
{
  "email": "string (required)",
  "code": "number (required, 6 digits)"
}
```

**Response** (201):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Cookies**: Tokenlar automatic cookies-ga saqlashiladi

---

### 3. POST `/auth/login`
**Kirish (Email + Parol)**

**Request**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response** (201):
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

### 4. POST `/auth/reset-password`
**Parol yangilash boshlash (Tasdiq kodi emailga)**

**Request**:
```json
{
  "email": "string (required)"
}
```

**Response**:
```json
{
  "message": "Verification code sent to email",
  "data": { "email": "user@example.com" }
}
```

---

### 5. POST `/auth/reset-password/verify`
**Parolni yangilash (Tasdiq kodi + yangi parol)**

**Request**:
```json
{
  "email": "string (required)",
  "code": "number (required)",
  "newPassword": "string (required)"
}
```

**Response** (201):
```json
{
  "message": "Parolingiz muvaffaqiyatli o'zgartirildi",
  "data": { /* user data */ }
}
```

---

### 6. POST `/auth/refresh-token`
**Yangi access token olish**

**Request** (opsional):
```json
{
  "refreshToken": "string (optional, agar cookie bo'lmasa)"
}
```

**Response** (201):
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

### 7. POST `/auth/logout`
**Tizimdan chiqish**

**Method**: POST  
**Body**: None (cookies automatically cleared)

**Response** (200):
```json
{
  "message": "Muvaffaqiyatli chiqtingiz"
}
```

---

## USERS ENDPOINTS

### 1. POST `/users/create`
**Yangi foydalanuvchi yaratish (Public - Ro'yhatdan o'tish)**

**Description**: Foydalanuvchi o'zi ro'yxatdan o'tishi uchun. Faqat talaba (STUDENT) roli bilan yaratiladi.

**WITH IMAGE**:
```
Content-Type: multipart/form-data

Body:
- fullName: string (required)
- email: string (required)
- password: string (required)
- image: file (optional)
```

**WITHOUT IMAGE**:
```json
{
  "fullName": "string (required)",
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response** (201):
```json
{
  "message": "Siz muoffaqqiyatli ro'yhatdan o'tdingiz",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "image": "http://localhost:3000/uploads/image.jpg",
    "createdAt": "2026-07-19T13:15:00.398Z",
    "updatedAt": "2026-07-19T13:15:00.398Z"
  }
}
```

**Fark Admin bilan**:
- `/users/create` - Public (hech kim), STUDENT roli bilan
- `/admin/new-user` - Admin only, istagan rol bilan

---

### 2. PATCH `/users/updateimange/:id`
**Foydalanuvchi rasmini yangilash**

```
Content-Type: multipart/form-data

Body:
- image: file (required)
```

---

### 3. GET `/users/get-all`
**Barcha foydalanuvchilarni olish**

**Response** (200):
```json
{
  "message": "This action returns all users",
  "data": [
    { /* user objects */ }
  ]
}
```

---

### 4. GET `/users/get-byid/:id`
**ID bo'yicha foydalanuvchini olish**

**Params**: `id` (UUID)

---

### 5. GET `/users/get-my`
**O'z profilni olish (JWT required)**

---

### 6. PATCH `/users/:id`
**Foydalanuvchini yangilash**

**Same as POST /users/create (all fields optional)**

---

### 7. DELETE `/users/:id`
**Foydalanuvchini o'chirish**

---

## COURSES ENDPOINTS

### 1. POST `/courses/create-one`
**Yangi kurs yaratish**

```
Content-Type: multipart/form-data

Body:
- name: string (required)
- about: string (required)
- price: number (required)
- discount: number (optional)
- categoryId: UUID (required)
- mentorId: UUID (required)
- level: enum: BEGINNER, PRE_INTERMEDIATE, INTERMEDIATE, UPPER_INTERMEDIATE, ADVANCED
- published: boolean (optional, default: false)
- banner: file (optional, image)
- introVideo: file (optional, video)
```

**Response** (201):
```json
{
  "message": "Course created successfully",
  "data": {
    "id": "uuid",
    "name": "Python Basics",
    "about": "Description...",
    "price": 50000,
    "discount": 0,
    "level": "BEGINNER",
    "published": false,
    "categoryId": "uuid",
    "mentorId": "uuid",
    "banner": "url",
    "introVideo": "url"
  }
}
```

---

### 2. GET `/courses/getall`
**Barcha kurslarni olish (public)**

---

### 3. GET `/courses/get-one/:id`
**Kurs batafsili (public)**

---

### 4. PATCH `/courses/update-one/:id`
**Kursni yangilash (Mentor only)**

**Same as POST with all fields optional**

---

### 5. DELETE `/courses/delete-one/:id`
**Kursni o'chirish (Mentor only)**

---

## COURSE_CATEGORIES

### 1. POST `/course-categories/create`
```json
{
  "name": "string (required)"
}
```

### 2-5. GET/PATCH/DELETE
Standard CRUD operations

---

## ASSIGNED_COURSES

### 1. POST `/assigned-courses/create-one`
**Kursni foydalanuvchiga tayinlash (Admin)**

```json
{
  "userId": "UUID (required)",
  "courseId": "UUID (required)"
}
```

---

## PURCACHED_COURSES

### 1. POST `/purcached-courses/create-one`
**Kursni sotib olish (Payment)**

```json
{
  "userId": "UUID (required)",
  "courseId": "UUID (required)",
  "amount": "number (required)",
  "paidVia": "enum: PAYME, CLICK, CASH (required)"
}
```

**Response**:
```json
{
  "message": "Course purchased successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "courseId": "uuid",
    "amount": 50000,
    "paidVia": "PAYME",
    "purcachedAt": "2024-01-01T10:00:00Z"
  }
}
```

---

## LESSON_MODULES

### 1. POST `/lesson-modules/create`
**Yangi dars moduli yaratish**

```json
{
  "name": "string (required, e.g., 'Module 1: Basics')",
  "courseId": "UUID (required)"
}
```

---

## LESSONS

### 1. POST `/lessons/create-one`
**Yangi darsni yaratish (video bilan)**

```
Content-Type: multipart/form-data

Body:
- name: string (required)
- about: string (optional)
- lessonModulId: UUID (required)
- video: file (optional, video file)
```

---

## LESSON_FILES

### 1. POST `/lesson-files/v1/create-one`
**Dars faylini qo'shish (PDF, DOC, etc.)**

```
Content-Type: multipart/form-data

Body:
- note: string (required, e.g., 'Lecture slides')
- lessonId: UUID (required)
- file: file (required)
```

---

## LESSON_VIEWS

### 1. POST `/lesson-views`
**Darsni ko'rgan deb belgilash**

```json
{
  "userId": "UUID (required)",
  "lessonId": "UUID (required)"
}
```

**Frontend**: User darsni yakuniga yetgan vaqtda chaqirish

---

## HOMEWORKS

### 1. POST `/homeworks/create`
**Yangi homework yaratish**

```
Content-Type: multipart/form-data

Body:
- task: string (required, task description)
- lessonId: UUID (required)
- files: file[] (optional, max 10 files)
```

---

## HOMEWORK_SUBMISSIONS

### 1. POST `/homework-submissions/create`
**Homework topshirish**

```
Content-Type: multipart/form-data

Body:
- text: string (required, javob/izoh)
- reason: string (required, javob berish sababi)
- homeworkId: UUID (required)
- userId: UUID (required)
- status: enum: PENDING, APPROVED, REJECTED (required, default: PENDING)
- files: file (required, solution file)
```

---

## EXAMS

### 1. POST `/exams/create`
**Yangi test/imtixon savolini yaratish (Mentor)**

```json
{
  "question": "string (required)",
  "variantA": "string (required)",
  "variantB": "string (required)",
  "variantC": "string (required)",
  "variantD": "string (required)",
  "answer": "enum: A, B, C, D (required)",
  "lessonModulId": "UUID (required)"
}
```

---

## EXAM_RESULTS

### 1. POST `/exam-results/create`
**Imtixon natijasini saqlash**

```json
{
  "lessonModulId": "UUID (required)",
  "userId": "UUID (required)",
  "passed": "boolean (required)",
  "corrects": "number (required, to'g'ri javoblar soni)",
  "wrongs": "number (required, noto'g'ri javoblar soni)"
}
```

---

## QUESTIONS

### 1. POST `/questions/create`
**Mentorga savol berish**

```
Content-Type: multipart/form-data

Body:
- userId: UUID (required)
- courseId: UUID (required)
- text: string (required, savol matni)
- read: boolean (optional)
- readAt: Date (optional)
- files: file[] (optional)
```

---

## QUESTION_ANSWERS

### 1. POST `/question-answers/create`
**Savolga javob berish (Mentor)**

```
Content-Type: multipart/form-data

Body:
- userId: UUID (required)
- questionId: UUID (required)
- text: string (required, javob matni)
- files: file (optional)
```

---

## RATINGS

### 1. POST `/rating`
**Kursni baholash**

```json
{
  "userId": "UUID (required)",
  "courseId": "UUID (required)",
  "comment": "string (optional, izoh)"
}
```

---

## MENTOR_PROFILES

### 1. POST `/mentor-profiles/create`
**Mentor profili yaratish**

```json
{
  "userId": "UUID (required)",
  "about": "string (optional)",
  "job": "string (optional)",
  "experience": "number (optional)",
  "telegram": "URL (optional)",
  "instagram": "URL (optional)",
  "linkedin": "URL (optional)",
  "facebook": "URL (optional)",
  "github": "URL (optional)",
  "website": "URL (optional)"
}
```

---

## CONTACT

### 1. POST `/contact`
**Bog'lanish formasini yuborish**

```json
{
  "phone": "string (required, +998...)",
  "message": "string (required)"
}
```

---

## ADMIN

### 1. POST `/admin/new-user`
**Yangi foydalanuvchi yaratish (Admin only)**

**Description**: Admin paneldan to'liq ma'lumotlar bilan yangi foydalanuvchi yaratish

```json
{
  "fullName": "string (required, ismi familyasi)",
  "email": "string (required, email manzili)",
  "password": "string (required, parol)",
  "role": "enum: ADMIN, MENTOR, ASSISTANT, STUDENT (optional, default: STUDENT)",
  "image": "string (optional, rasm URL)"
}
```

**Response** (201):
```json
{
  "message": "Yangi foydalanuvchi muvaffaqiyatli yaratildi",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "image": null,
    "createdAt": "2026-07-19T13:14:56.769Z"
  }
}
```

**Features**:
- Parol avtomatik hash qilinadi
- Email unique bo'lishi kerak
- Role default STUDENT, lekin admin istasansa boshqa rol tanlashi mumkin
- Yangi user yaratilgandan keyin darhol foydalanish mumkin

---

### 2. POST `/admin/assign-role`
**Foydalanuvchiga rol tayinlash (Admin only)**

```json
{
  "userId": "string (required)",
  "role": "enum: ADMIN, MENTOR, ASSISTANT, STUDENT (required)"
}
```

### 3. POST `/admin/create-permission`
**Ruxsat yaratish**

```json
{
  "userId": "string (required)",
  "model": "string (required, e.g., 'courses', 'users')",
  "actions": "enum[]: GET, POST, PUT, PATCH, DELETE (required)"
}
```

**Example**:
```json
{
  "userId": "uuid",
  "model": "courses",
  "actions": ["GET", "POST", "PATCH", "DELETE"]
}
```

### 4. PUT `/admin/update-permission/:permissionId`
**Ruxsatni yangilash**

---

## FILE_STREAMING

### 1. GET `/video/:file`
**Video fayl streaming**

**Example**: `GET /video/lesson-video.mp4`

**Response**: Binary video data (Content-Type: video/mp4)

---

### 2. GET `/image/:file`
**Rasm fayl streaming**

**Example**: `GET /image/course-banner.jpg`

---

### 3. GET `/archive/:file`
**Archive fayl streaming**

---

### 4. GET `/docs/:file`
**Hujjat fayl streaming (PDF, DOC, etc.)**

---

## ERROR HANDLING

### Common HTTP Status Codes:

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Invalid data format |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Server-side error |

### Error Response Example:
```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "BadRequest"
}
```

### Frontend Error Handling:
```javascript
try {
  const response = await fetch('/api/endpoint', { /* options */ });
  
  if (!response.ok) {
    const error = await response.json();
    console.error(error.message);
  }
  
  const data = await response.json();
  return data.data; // Access actual data
} catch (err) {
  console.error('Network error:', err);
}
```

---

## DATA TYPES & ENUMS

### User Roles:
```
STUDENT - Talaba
MENTOR - Mentor
ASSISTANT - Assistent
ADMIN - Administrator
```

### Course Levels:
```
BEGINNER - Boshlang'ich
PRE_INTERMEDIATE - Pre-intermediate
INTERMEDIATE - O'rtacha
UPPER_INTERMEDIATE - Yuqori o'rtacha
ADVANCED - Ilg'or
```

### Payment Methods (PaidVia):
```
PAYME - Payme orqali
CLICK - Click orqali
CASH - Naqad
```

### Homework Status:
```
PENDING - Kutilmoqda
APPROVED - Tasdiqlangan
REJECTED - Rad etilgan
```

### Exam Answers:
```
A, B, C, D - Test variant javoblari
```

---

## FRONTEND INTEGRATION EXAMPLE

### React/Next.js API Hook:
```javascript
// hooks/useApi.ts
import { useEffect, useState } from 'react';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) throw new Error('API Error');
        
        const json = await response.json();
        setData(json.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

### Usage Example:
```javascript
const { data: courses, loading, error } = useApi('/courses/getall');

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    {courses.map(course => (
      <div key={course.id}>{course.name}</div>
    ))}
  </div>
);
```

---

## AUTHENTICATION FLOW (FRONTEND)

### 1. Registration:
```
POST /auth/register (email, fullName, password)
  ↓
User sees verification email prompt
  ↓
POST /auth/verify (email, code from email)
  ↓
Tokens returned in cookies + response
  ↓
Redirect to dashboard
```

### 2. Login:
```
POST /auth/login (email, password)
  ↓
Tokens returned in cookies + response
  ↓
Save accessToken in localStorage (optional)
  ↓
Redirect to dashboard
```

### 3. Token Refresh:
```
Auto-triggered on 401 response
  ↓
POST /auth/refresh-token
  ↓
New accessToken received
  ↓
Retry original request
```

### 4. Logout:
```
POST /auth/logout
  ↓
Cookies cleared server-side
  ↓
Clear localStorage
  ↓
Redirect to login page
```

---

## IMPORTANT NOTES

1. **JWT Tokens**: Cookies-da automatic saqlashiladi
2. **Content-Type**: File upload-da `multipart/form-data` ishlatish
3. **Authorization**: Private endpoints-da JWT token kerak
4. **Base URL**: Environment variable-dan olish (`.env.local`)
5. **CORS**: Backend-da configured
6. **Refresh Token**: Automatic background-da refresh qilinadi
7. **File Uploads**: Max file size 10MB (Configure in backend)
8. **Validation**: Frontend-da ham, backend-da ham validator

---

## TESTING TOOLS

- **Postman**: Full API collection yo'q, lekin har endpoint uchun schema bor
- **cURL**: Command-line testing uchun
- **Thunder Client**: VS Code extension
- **REST Client**: VS Code extension

---

## COMMON ISSUES & SOLUTIONS

### Issue: 401 Unauthorized
**Solution**: Token expired → Call `/auth/refresh-token`

### Issue: 403 Forbidden
**Solution**: Insufficient permissions → Check user role/permissions

### Issue: CORS Error
**Solution**: Backend-da CORS configured, check origin

### Issue: File Upload Fails
**Solution**: 
- Check file size (max 10MB)
- Use `multipart/form-data` Content-Type
- Ensure file input is properly appended to FormData

---

**Last Updated**: 2026-07-19  
**Status**: ✅ Complete & Verified (115+ endpoints)

---

## 🆕 YANGI ENDPOINTS (2026-07-19)

### Admin Modulida:
- **POST `/admin/new-user`** - Admin paneldan to'liq ma'lumotlar bilan yangi foydalanuvchi yaratish

### Users Modulida:
- **POST `/users/create`** - Endi public endpoint, ro'yxatdan o'tish uchun (STUDENT roli bilan)
