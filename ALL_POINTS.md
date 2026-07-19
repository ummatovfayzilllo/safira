# 📚 Imtihon Backend - TO'LIQ API ENDPOINTS

**Updated:** July 2026  
**Total Endpoints:** 80+

---

## 📋 Fihrist

1. [Authentication (3)](#authentication)
2. [Users (7)](#users)
3. [Courses (4)](#courses)
4. [Lessons (5)](#lessons)
5. [Lesson Modules (5)](#lesson-modules)
6. [Lesson Files (5)](#lesson-files)
7. [Lesson Views (5)](#lesson-views)
8. [Course Categories (5)](#course-categories)
9. [Homeworks (5)](#homeworks)
10. [Homework Submissions (5)](#homework-submissions)
11. [Exams (5)](#exams)
12. [Exam Results (5)](#exam-results)
13. [Questions (5)](#questions)
14. [Question Answers (5)](#question-answers)
15. [Assigned Courses (5)](#assigned-courses)
16. [Purchased Courses (5)](#purchased-courses)
17. [Mentor Profiles (5)](#mentor-profiles)
18. [Rating (5)](#rating)
19. [Last Activity (5)](#last-activity)
20. [Contact (5)](#contact)

---

## 🔐 Authentication

### 1. Register (Ro'yxatdan O'tish)

```http
POST /api/auth/register
Content-Type: application/json
Authorization: Not Required (Public)
```

**Request Body:**
```json
{
  "fullName": "Fayzillo Ummatov",
  "email": "fayzillo@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "This action adds a new auth",
  "data": {
    "fullName": "Fayzillo Ummatov",
    "email": "fayzillo@example.com",
    "code": 123456,
    "time": 5
  }
}
```

**Tavsif:** Email orqali verification code yuboradi. Code 5 minut amal qiladi.

---

### 2. Verify Code (Kodni Tasdiqlas)

```http
POST /api/auth/verify
Content-Type: application/json
Authorization: Not Required (Public)
```

**Request Body:**
```json
{
  "email": "fayzillo@example.com",
  "code": 123456
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Tavsif:** Emailga yuborilgan codeni tekshiradi. Kod to'g'ri bo'lsa user database ga qo'shiladi.

---

### 3. Login (Kirish)

```http
POST /api/auth/login
Content-Type: application/json
Authorization: Not Required (Public)
```

**Request Body:**
```json
{
  "email": "fayzillo@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Tavsif:** Mavjud user uchun login qiladi. Email va password ni tekshiradi.

---

## 👥 Users

### 1. Create User

```http
POST /api/users/create
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "fullName": "Fayzillo Ummatov",
  "email": "fayzillo@example.com",
  "password": "securePassword123",
  "image": <binary_file> (optional)
}
```

**Response (201):**
```json
{
  "message": "Siz muoffaqqiyatli ro'yhatdan o'tdingiz",
  "data": {
    "id": "user-uuid",
    "fullName": "Fayzillo Ummatov",
    "email": "fayzillo@example.com",
    "image": "https://res.cloudinary.com/...",
    "role": "STUDENT",
    "createdAt": "2026-07-19T10:30:00Z",
    "updatedAt": "2026-07-19T10:30:00Z"
  }
}
```

**Tavsif:** Yangi user yaratadi. Rasm optional. Password bcrypt bilan hash qilinadi.

---

### 2. Get All Users

```http
GET /api/users/get-all
Authorization: Not Required (Public)
```

**Response (200):**
```json
{
  "message": "This action returns all users",
  "data": [
    {
      "id": "user-uuid-1",
      "fullName": "Fayzillo Ummatov",
      "email": "fayzillo@example.com",
      "image": "https://res.cloudinary.com/...",
      "role": "STUDENT",
      "createdAt": "2026-07-19T10:30:00Z",
      "updatedAt": "2026-07-19T10:30:00Z"
    }
  ]
}
```

**Tavsif:** Barcha usersni qaytaradi.

---

### 3. Get User by ID

```http
GET /api/users/get-byid/:id
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Foydalanuvchi UUID

**Response (200):**
```json
{
  "message": "This action returns a [ user-uuid ] user",
  "data": {
    "id": "user-uuid",
    "fullName": "Fayzillo Ummatov",
    "email": "fayzillo@example.com",
    "image": "https://res.cloudinary.com/...",
    "role": "STUDENT",
    "createdAt": "2026-07-19T10:30:00Z",
    "updatedAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 4. Get My Profile

```http
GET /api/users/get-my
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "This action returns a [ user-uuid ] user",
  "data": {
    "id": "user-uuid",
    "fullName": "Fayzillo Ummatov",
    "email": "fayzillo@example.com",
    "image": "https://res.cloudinary.com/...",
    "role": "STUDENT",
    "createdAt": "2026-07-19T10:30:00Z",
    "updatedAt": "2026-07-19T10:30:00Z"
  }
}
```

**Tavsif:** JWT tokendan user IDni oladi va mening profilimni qaytaradi.

---

### 5. Update User

```http
PATCH /api/users/:id
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Foydalanuvchi UUID

**Request Body:**
```
{
  "fullName": "Updated Name",
  "email": "newemail@example.com",
  "password": "newPassword123",
  "image": <binary_file> (optional)
}
```

**Response (200):**
```json
{
  "message": "User updated successfully",
  "data": {
    "id": "user-uuid",
    "fullName": "Updated Name",
    "email": "newemail@example.com",
    "image": "https://res.cloudinary.com/...",
    "role": "STUDENT",
    "createdAt": "2026-07-19T10:30:00Z",
    "updatedAt": "2026-07-19T12:45:00Z"
  }
}
```

**Tavsif:** Barcha fieldlar optional. Rasm yangilansa eski rasm o'chiriladi.

---

### 6. Update User Image

```http
PATCH /api/users/updateimange/:id
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Foydalanuvchi UUID

**Request Body:**
```
{
  "image": <binary_file>
}
```

**Response (200):**
```json
{
  "message": "UserImage update successfully",
  "data": {
    "id": "user-uuid",
    "fullName": "Fayzillo Ummatov",
    "email": "fayzillo@example.com",
    "image": "https://res.cloudinary.com/...new-image",
    "role": "STUDENT",
    "createdAt": "2026-07-19T10:30:00Z",
    "updatedAt": "2026-07-19T12:45:00Z"
  }
}
```

---

### 7. Delete User

```http
DELETE /api/users/:id
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Foydalanuvchi UUID

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## 📚 Courses

### 1. Create Course

```http
POST /api/courses/create-one
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "name": "JavaScript Asoslari",
  "about": "JavaScript dasturlash tilini o'rganamiz",
  "price": 150000,
  "discount": 10000,
  "categoryId": "category-uuid",
  "mentorId": "mentor-uuid",
  "level": "BEGINNER",
  "published": true,
  "banner": <binary_file> (optional),
  "introVideo": <binary_file> (optional)
}
```

**Response (201):**
```json
{
  "message": "Course created successfully",
  "data": {
    "id": "course-uuid",
    "name": "JavaScript Asoslari",
    "about": "JavaScript dasturlash tilini o'rganamiz",
    "price": 150000,
    "discount": 10000,
    "banner": "https://res.cloudinary.com/...",
    "introVideo": "https://res.cloudinary.com/...",
    "level": "BEGINNER",
    "published": true,
    "categoryId": "category-uuid",
    "mentorId": "mentor-uuid",
    "createdAt": "2026-07-19T10:30:00Z",
    "updatedAt": "2026-07-19T10:30:00Z"
  }
}
```

**Tavsif:** Yangi kurs yaratadi. Banner va introVideo optional.

---

### 2. Get All Courses

```http
GET /api/courses/getall
Authorization: Not Required (Public)
```

**Response (200):**
```json
{
  "message": "All courses",
  "data": [
    {
      "id": "course-uuid",
      "name": "JavaScript Asoslari",
      "about": "JavaScript dasturlash tilini o'rganamiz",
      "price": 150000,
      "discount": 10000,
      "banner": "https://res.cloudinary.com/...",
      "level": "BEGINNER",
      "published": true,
      "createdAt": "2026-07-19T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Course by ID

```http
GET /api/courses/get-one/:id
Authorization: Not Required (Public)
```

**Path Parameters:**
- `id` (string): Kurs UUID

**Response (200):**
```json
{
  "message": "Course details",
  "data": {
    "id": "course-uuid",
    "name": "JavaScript Asoslari",
    "about": "JavaScript dasturlash tilini o'rganamiz",
    "price": 150000,
    "discount": 10000,
    "banner": "https://res.cloudinary.com/...",
    "level": "BEGINNER",
    "published": true,
    "categoryId": "category-uuid",
    "mentorId": "mentor-uuid",
    "modules": [],
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 4. Update Course

```http
PATCH /api/courses/update-one/:id
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Kurs UUID

**Request Body:**
```
{
  "name": "JavaScript Asoslari (Updated)",
  "about": "JavaScript dasturlash tilini o'rganamiz",
  "price": 200000,
  "discount": 15000,
  "level": "PRE_INTERMEDIATE",
  "published": true,
  "banner": <binary_file> (optional),
  "introVideo": <binary_file> (optional)
}
```

**Response (200):**
```json
{
  "message": "Course updated successfully",
  "data": {
    "id": "course-uuid",
    "name": "JavaScript Asoslari (Updated)",
    "price": 200000,
    "level": "PRE_INTERMEDIATE",
    "updatedAt": "2026-07-19T12:45:00Z"
  }
}
```

---

### 5. Delete Course

```http
DELETE /api/courses/delte-one/:id
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Kurs UUID

**Response (200):**
```json
{
  "message": "Course deleted successfully"
}
```

---

## 📖 Lessons

### 1. Create Lesson

```http
POST /api/lessons/create-one
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "name": "If Statement",
  "about": "Condition operatorlarini o'rganamiz",
  "lessonModulId": "lesson-module-uuid",
  "video": <binary_file> (required)
}
```

**Response (201):**
```json
{
  "message": "Lesson created successfully",
  "data": {
    "id": "lesson-uuid",
    "name": "If Statement",
    "about": "Condition operatorlarini o'rganamiz",
    "video": "https://res.cloudinary.com/...",
    "lessonModulId": "lesson-module-uuid",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Lessons

```http
GET /api/lessons/getall
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All lessons",
  "data": [
    {
      "id": "lesson-uuid",
      "name": "If Statement",
      "about": "Condition operatorlarini o'rganamiz",
      "video": "https://res.cloudinary.com/...",
      "createdAt": "2026-07-19T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Lesson by ID

```http
GET /api/lessons/get-one/:id
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Lesson UUID

**Response (200):**
```json
{
  "message": "Lesson details",
  "data": {
    "id": "lesson-uuid",
    "name": "If Statement",
    "about": "Condition operatorlarini o'rganamiz",
    "video": "https://res.cloudinary.com/...",
    "lessonModulId": "lesson-module-uuid",
    "files": [],
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 4. Update Lesson

```http
PATCH /api/lessons/update-oen/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Lesson UUID

**Request Body:**
```json
{
  "name": "If Statement (Updated)",
  "about": "Condition operatorlarini o'rganamiz - yangilash"
}
```

**Response (200):**
```json
{
  "message": "Lesson updated successfully",
  "data": {
    "id": "lesson-uuid",
    "name": "If Statement (Updated)",
    "updatedAt": "2026-07-19T12:45:00Z"
  }
}
```

---

### 5. Delete Lesson

```http
DELETE /api/lessons/delete-one/:id
Authorization: Required (Bearer Token)
```

**Path Parameters:**
- `id` (string): Lesson UUID

**Response (200):**
```json
{
  "message": "Lesson deleted successfully"
}
```

---

## 📦 Lesson Modules

### 1. Create Lesson Module

```http
POST /api/lesson-modules/create
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "name": "JavaScript Asoslari",
  "about": "JavaScript asosiy kontseptsiyalari",
  "courseId": "course-uuid"
}
```

**Response (201):**
```json
{
  "message": "Lesson module created successfully",
  "data": {
    "id": "lesson-module-uuid",
    "name": "JavaScript Asoslari",
    "about": "JavaScript asosiy kontseptsiyalari",
    "courseId": "course-uuid",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Lesson Modules

```http
GET /api/lesson-modules/getall
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All lesson modules",
  "data": [
    {
      "id": "lesson-module-uuid",
      "name": "JavaScript Asoslari",
      "about": "JavaScript asosiy kontseptsiyalari",
      "courseId": "course-uuid"
    }
  ]
}
```

---

### 3. Get Lesson Module by ID

```http
GET /api/lesson-modules/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Lesson module details",
  "data": {
    "id": "lesson-module-uuid",
    "name": "JavaScript Asoslari",
    "about": "JavaScript asosiy kontseptsiyalari",
    "courseId": "course-uuid",
    "lessons": []
  }
}
```

---

### 4. Update Lesson Module

```http
PATCH /api/lesson-modules/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "name": "JavaScript Asoslari (Updated)",
  "about": "JavaScript asosiy kontseptsiyalari - yangilash"
}
```

**Response (200):**
```json
{
  "message": "Lesson module updated successfully",
  "data": {
    "id": "lesson-module-uuid",
    "name": "JavaScript Asoslari (Updated)"
  }
}
```

---

### 5. Delete Lesson Module

```http
DELETE /api/lesson-modules/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Lesson module deleted successfully"
}
```

---

## 📎 Lesson Files

### 1. Create Lesson File

```http
POST /api/lesson-files/v1/create-one
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "name": "JavaScript Cheat Sheet",
  "about": "JavaScript asosiy funksiyalari",
  "lessonId": "lesson-uuid",
  "file": <binary_file> (required)
}
```

**Response (201):**
```json
{
  "message": "Lesson file created successfully",
  "data": {
    "id": "lesson-file-uuid",
    "name": "JavaScript Cheat Sheet",
    "about": "JavaScript asosiy funksiyalari",
    "file": "https://res.cloudinary.com/...",
    "lessonId": "lesson-uuid",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Lesson Files

```http
GET /api/lesson-files/v2/get-all
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All lesson files",
  "data": [
    {
      "id": "lesson-file-uuid",
      "name": "JavaScript Cheat Sheet",
      "file": "https://res.cloudinary.com/..."
    }
  ]
}
```

---

### 3. Get Lesson File by ID

```http
GET /api/lesson-files/v3/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Lesson file details",
  "data": {
    "id": "lesson-file-uuid",
    "name": "JavaScript Cheat Sheet",
    "about": "JavaScript asosiy funksiyalari",
    "file": "https://res.cloudinary.com/...",
    "lessonId": "lesson-uuid"
  }
}
```

---

### 4. Update Lesson File

```http
PATCH /api/lesson-files/v4/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "name": "JavaScript Cheat Sheet (Updated)",
  "about": "JavaScript asosiy funksiyalari - yangilash"
}
```

**Response (200):**
```json
{
  "message": "Lesson file updated successfully"
}
```

---

### 5. Delete Lesson File

```http
DELETE /api/lesson-files/v5/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Lesson file deleted successfully"
}
```

---

## 👁️ Lesson Views

### 1. Create Lesson View

```http
POST /api/lesson-views
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "lessonId": "lesson-uuid",
  "userId": "user-uuid",
  "watchedSeconds": 300
}
```

**Response (201):**
```json
{
  "message": "Lesson view tracked",
  "data": {
    "id": 1,
    "lessonId": "lesson-uuid",
    "userId": "user-uuid",
    "watchedSeconds": 300,
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Lesson Views

```http
GET /api/lesson-views
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All lesson views",
  "data": [
    {
      "id": 1,
      "lessonId": "lesson-uuid",
      "userId": "user-uuid",
      "watchedSeconds": 300
    }
  ]
}
```

---

### 3. Get Lesson View by ID

```http
GET /api/lesson-views/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Lesson view details",
  "data": {
    "id": 1,
    "lessonId": "lesson-uuid",
    "userId": "user-uuid",
    "watchedSeconds": 300
  }
}
```

---

### 4. Update Lesson View

```http
PATCH /api/lesson-views/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "watchedSeconds": 500
}
```

**Response (200):**
```json
{
  "message": "Lesson view updated successfully"
}
```

---

### 5. Delete Lesson View

```http
DELETE /api/lesson-views/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Lesson view deleted successfully"
}
```

---

## 🏷️ Course Categories

### 1. Create Course Category

```http
POST /api/course-categories/create
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "name": "Programming Languages",
  "about": "Dasturlash tillarini o'rganish"
}
```

**Response (201):**
```json
{
  "message": "Course category created successfully",
  "data": {
    "id": "category-uuid",
    "name": "Programming Languages",
    "about": "Dasturlash tillarini o'rganish",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Course Categories

```http
GET /api/course-categories/get-all
Authorization: Not Required (Public)
```

**Response (200):**
```json
{
  "message": "All categories",
  "data": [
    {
      "id": "category-uuid",
      "name": "Programming Languages",
      "about": "Dasturlash tillarini o'rganish"
    }
  ]
}
```

---

### 3. Get Course Category by ID

```http
GET /api/course-categories/get-one/:id
Authorization: Not Required (Public)
```

**Response (200):**
```json
{
  "message": "Course category details",
  "data": {
    "id": "category-uuid",
    "name": "Programming Languages",
    "about": "Dasturlash tillarini o'rganish",
    "courses": []
  }
}
```

---

### 4. Update Course Category

```http
PATCH /api/course-categories/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "name": "Web Development",
  "about": "Web dasturlash tillarini o'rganish"
}
```

**Response (200):**
```json
{
  "message": "Course category updated successfully"
}
```

---

### 5. Delete Course Category

```http
DELETE /api/course-categories/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Course category deleted successfully"
}
```

---

## 📝 Homeworks

### 1. Create Homework

```http
POST /api/homeworks/create
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "task": "JavaScript asosiy operatorlarini o'rganib misollar yozish",
  "lessonId": "lesson-uuid",
  "files": <binary_file[]> (up to 10 files, optional)
}
```

**Response (201):**
```json
{
  "message": "Homework created successfully",
  "data": {
    "id": "homework-uuid",
    "task": "JavaScript asosiy operatorlarini o'rganib misollar yozish",
    "lessonId": "lesson-uuid",
    "files": [
      "https://res.cloudinary.com/..."
    ],
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Homeworks

```http
GET /api/homeworks/get-all
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All homeworks",
  "data": [
    {
      "id": "homework-uuid",
      "task": "JavaScript asosiy operatorlarini o'rganib misollar yozish",
      "lessonId": "lesson-uuid"
    }
  ]
}
```

---

### 3. Get Homework by ID

```http
GET /api/homeworks/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Homework details",
  "data": {
    "id": "homework-uuid",
    "task": "JavaScript asosiy operatorlarini o'rganib misollar yozish",
    "lessonId": "lesson-uuid",
    "files": []
  }
}
```

---

### 4. Update Homework

```http
PATCH /api/homeworks/update-one/:id
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "task": "JavaScript asosiy operatorlarini o'rganib misollar yozish - yangilash",
  "files": <binary_file[]> (optional)
}
```

**Response (200):**
```json
{
  "message": "Homework updated successfully"
}
```

---

### 5. Delete Homework

```http
DELETE /api/homeworks/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Homework deleted successfully"
}
```

---

## ✅ Homework Submissions

### 1. Create Homework Submission

```http
POST /api/homework-submissions/create
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "homeworkId": "homework-uuid",
  "userId": "user-uuid",
  "submissionText": "Vazifani bajarildi va taqdim etildi",
  "files": <binary_file[]> (optional)
}
```

**Response (201):**
```json
{
  "message": "Homework submission created successfully",
  "data": {
    "id": "submission-uuid",
    "homeworkId": "homework-uuid",
    "userId": "user-uuid",
    "submissionText": "Vazifani bajarildi va taqdim etildi",
    "status": "PENDING",
    "files": [],
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Homework Submissions

```http
GET /api/homework-submissions/get-all
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All homework submissions",
  "data": [
    {
      "id": "submission-uuid",
      "homeworkId": "homework-uuid",
      "userId": "user-uuid",
      "status": "PENDING"
    }
  ]
}
```

---

### 3. Get Homework Submission by ID

```http
GET /api/homework-submissions/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Homework submission details",
  "data": {
    "id": "submission-uuid",
    "homeworkId": "homework-uuid",
    "userId": "user-uuid",
    "submissionText": "Vazifani bajarildi va taqdim etildi",
    "status": "PENDING",
    "files": []
  }
}
```

---

### 4. Update Homework Submission

```http
PATCH /api/homework-submissions/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "status": "APPROVED",
  "feedback": "Yaxshi bajarildi!"
}
```

**Response (200):**
```json
{
  "message": "Homework submission updated successfully"
}
```

---

### 5. Delete Homework Submission

```http
DELETE /api/homework-submissions/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Homework submission deleted successfully"
}
```

---

## ❓ Exams

### 1. Create Exam

```http
POST /api/exams/create
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "question": "JavaScriptda '===' operatorining vazifasi nima?",
  "variantA": "Qiymatni solishtiradi, lekin turini emas",
  "variantB": "Faqat turini solishtiradi",
  "variantC": "Qiymat va turini solishtiradi",
  "variantD": "Faqat raqamlarni solishtiradi",
  "answer": "C",
  "lessonModulId": "lesson-module-uuid"
}
```

**Response (201):**
```json
{
  "message": "Exam created successfully",
  "data": {
    "id": "exam-uuid",
    "question": "JavaScriptda '===' operatorining vazifasi nima?",
    "variantA": "Qiymatni solishtiradi, lekin turini emas",
    "variantB": "Faqat turini solishtiradi",
    "variantC": "Qiymat va turini solishtiradi",
    "variantD": "Faqat raqamlarni solishtiradi",
    "answer": "C",
    "lessonModulId": "lesson-module-uuid",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Exams

```http
GET /api/exams/get-all
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All exams",
  "data": [
    {
      "id": "exam-uuid",
      "question": "JavaScriptda '===' operatorining vazifasi nima?",
      "variantA": "Qiymatni solishtiradi, lekin turini emas",
      "variantB": "Faqat turini solishtiradi",
      "variantC": "Qiymat va turini solishtiradi",
      "variantD": "Faqat raqamlarni solishtiradi",
      "answer": "C"
    }
  ]
}
```

---

### 3. Get Exam by ID

```http
GET /api/exams/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Exam details",
  "data": {
    "id": "exam-uuid",
    "question": "JavaScriptda '===' operatorining vazifasi nima?",
    "variantA": "Qiymatni solishtiradi, lekin turini emas",
    "variantB": "Faqat turini solishtiradi",
    "variantC": "Qiymat va turini solishtiradi",
    "variantD": "Faqat raqamlarni solishtiradi",
    "answer": "C"
  }
}
```

---

### 4. Update Exam

```http
PATCH /api/exams/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "question": "JavaScriptda '===' operatorining vazifasi nima? (Updated)",
  "variantA": "Updated variant A"
}
```

**Response (200):**
```json
{
  "message": "Exam updated successfully"
}
```

---

### 5. Delete Exam

```http
DELETE /api/exams/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Exam deleted successfully"
}
```

---

## 📊 Exam Results

### 1. Create Exam Result

```http
POST /api/exam-results/create
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "examId": "exam-uuid",
  "userId": "user-uuid",
  "selectedAnswer": "C",
  "isCorrect": true,
  "score": 100
}
```

**Response (201):**
```json
{
  "message": "Exam result created successfully",
  "data": {
    "id": "exam-result-uuid",
    "examId": "exam-uuid",
    "userId": "user-uuid",
    "selectedAnswer": "C",
    "isCorrect": true,
    "score": 100,
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Exam Results

```http
GET /api/exam-results/get-all
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All exam results",
  "data": [
    {
      "id": "exam-result-uuid",
      "examId": "exam-uuid",
      "userId": "user-uuid",
      "score": 100,
      "isCorrect": true
    }
  ]
}
```

---

### 3. Get Exam Result by ID

```http
GET /api/exam-results/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Exam result details",
  "data": {
    "id": "exam-result-uuid",
    "examId": "exam-uuid",
    "userId": "user-uuid",
    "selectedAnswer": "C",
    "isCorrect": true,
    "score": 100
  }
}
```

---

### 4. Update Exam Result

```http
PATCH /api/exam-results/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "score": 90,
  "isCorrect": false
}
```

**Response (200):**
```json
{
  "message": "Exam result updated successfully"
}
```

---

### 5. Delete Exam Result

```http
DELETE /api/exam-results/delte-ne/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Exam result deleted successfully"
}
```

---

## 💬 Questions (Q&A Forum)

### 1. Create Question

```http
POST /api/questions/create
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "title": "JavaScript da async/await nima?",
  "content": "Async/await ning asosiy tushunchalarini tushuntirib bering",
  "courseId": "course-uuid",
  "files": <binary_file[]> (optional)
}
```

**Response (201):**
```json
{
  "message": "Question created successfully",
  "data": {
    "id": "question-uuid",
    "title": "JavaScript da async/await nima?",
    "content": "Async/await ning asosiy tushunchalarini tushuntirib bering",
    "courseId": "course-uuid",
    "files": [],
    "userId": "user-uuid",
    "views": 0,
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Questions

```http
GET /api/questions/get-all
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All questions",
  "data": [
    {
      "id": "question-uuid",
      "title": "JavaScript da async/await nima?",
      "courseId": "course-uuid",
      "views": 0,
      "createdAt": "2026-07-19T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Question by ID

```http
GET /api/questions/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Question details",
  "data": {
    "id": "question-uuid",
    "title": "JavaScript da async/await nima?",
    "content": "Async/await ning asosiy tushunchalarini tushuntirib bering",
    "courseId": "course-uuid",
    "files": [],
    "userId": "user-uuid",
    "views": 5,
    "answers": []
  }
}
```

---

### 4. Update Question

```http
PATCH /api/questions/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "title": "JavaScript da async/await nima? (Updated)",
  "content": "Async/await ning asosiy tushunchalarini yangilangan versiyasi"
}
```

**Response (200):**
```json
{
  "message": "Question updated successfully"
}
```

---

### 5. Delete Question

```http
DELETE /api/questions/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Question deleted successfully"
}
```

---

## 📢 Question Answers

### 1. Create Question Answer

```http
POST /api/question-answers/create
Content-Type: multipart/form-data
Authorization: Required (Bearer Token)
```

**Request Body:**
```
{
  "content": "Async/await JavaScriptda ishlashni soddalashtiradi",
  "questionId": "question-uuid",
  "userId": "user-uuid",
  "files": <binary_file[]> (optional)
}
```

**Response (201):**
```json
{
  "message": "Question answer created successfully",
  "data": {
    "id": "answer-uuid",
    "content": "Async/await JavaScriptda ishlashni soddalashtiradi",
    "questionId": "question-uuid",
    "userId": "user-uuid",
    "files": [],
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Question Answers

```http
GET /api/question-answers
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All question answers",
  "data": [
    {
      "id": "answer-uuid",
      "content": "Async/await JavaScriptda ishlashni soddalashtiradi",
      "questionId": "question-uuid"
    }
  ]
}
```

---

### 3. Get Question Answer by ID

```http
GET /api/question-answers/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Question answer details",
  "data": {
    "id": "answer-uuid",
    "content": "Async/await JavaScriptda ishlashni soddalashtiradi",
    "questionId": "question-uuid",
    "userId": "user-uuid",
    "files": []
  }
}
```

---

### 4. Update Question Answer

```http
PATCH /api/question-answers/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "content": "Async/await JavaScriptda ishlashni soddalashtiradi - yangilash"
}
```

**Response (200):**
```json
{
  "message": "Question answer updated successfully"
}
```

---

### 5. Delete Question Answer

```http
DELETE /api/question-answers/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Question answer deleted successfully"
}
```

---

## 📚 Assigned Courses

### 1. Create Assigned Course

```http
POST /api/assigned-courses/create-one
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "userId": "user-uuid",
  "assignedDate": "2026-07-19T10:30:00Z"
}
```

**Response (201):**
```json
{
  "message": "Course assigned successfully",
  "data": {
    "id": "assigned-course-uuid",
    "courseId": "course-uuid",
    "userId": "user-uuid",
    "assignedDate": "2026-07-19T10:30:00Z",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Assigned Courses

```http
GET /api/assigned-courses/getall
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All assigned courses",
  "data": [
    {
      "id": "assigned-course-uuid",
      "courseId": "course-uuid",
      "userId": "user-uuid",
      "assignedDate": "2026-07-19T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Assigned Course by ID

```http
GET /api/assigned-courses/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Assigned course details",
  "data": {
    "id": "assigned-course-uuid",
    "courseId": "course-uuid",
    "userId": "user-uuid",
    "assignedDate": "2026-07-19T10:30:00Z"
  }
}
```

---

### 4. Update Assigned Course

```http
PATCH /api/assigned-courses/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "assignedDate": "2026-07-20T10:30:00Z"
}
```

**Response (200):**
```json
{
  "message": "Assigned course updated successfully"
}
```

---

### 5. Delete Assigned Course

```http
DELETE /api/assigned-courses/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Assigned course deleted successfully"
}
```

---

## 💳 Purchased Courses

### 1. Create Purchased Course

```http
POST /api/purcached-courses/create-one
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "userId": "user-uuid",
  "paymentMethod": "PAYME",
  "price": 150000,
  "discount": 10000,
  "totalPrice": 140000,
  "transactionId": "txn_12345"
}
```

**Response (201):**
```json
{
  "message": "Course purchased successfully",
  "data": {
    "id": "purchased-course-uuid",
    "courseId": "course-uuid",
    "userId": "user-uuid",
    "paymentMethod": "PAYME",
    "price": 150000,
    "discount": 10000,
    "totalPrice": 140000,
    "transactionId": "txn_12345",
    "purchasedDate": "2026-07-19T10:30:00Z",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Purchased Courses

```http
GET /api/purcached-courses/get-all
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All purchased courses",
  "data": [
    {
      "id": "purchased-course-uuid",
      "courseId": "course-uuid",
      "userId": "user-uuid",
      "totalPrice": 140000,
      "paymentMethod": "PAYME",
      "purchasedDate": "2026-07-19T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Purchased Course by ID

```http
GET /api/purcached-courses/get-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Purchased course details",
  "data": {
    "id": "purchased-course-uuid",
    "courseId": "course-uuid",
    "userId": "user-uuid",
    "paymentMethod": "PAYME",
    "price": 150000,
    "discount": 10000,
    "totalPrice": 140000,
    "transactionId": "txn_12345"
  }
}
```

---

### 4. Update Purchased Course

```http
PATCH /api/purcached-courses/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "transactionId": "txn_12345_updated"
}
```

**Response (200):**
```json
{
  "message": "Purchased course updated successfully"
}
```

---

### 5. Delete Purchased Course

```http
DELETE /api/purcached-courses/delete-oen/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Purchased course deleted successfully"
}
```

---

## 👨‍🏫 Mentor Profiles

### 1. Create Mentor Profile

```http
POST /api/mentor-profiles/create
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "userId": "user-uuid",
  "about": "10 yildan ortiq tajribasi bor JavaScript oqituvchi",
  "experience": "Professional Developer",
  "socialLinks": {
    "telegram": "https://t.me/username",
    "github": "https://github.com/username"
  }
}
```

**Response (201):**
```json
{
  "message": "Mentor profile created successfully",
  "data": {
    "id": "mentor-profile-uuid",
    "userId": "user-uuid",
    "about": "10 yildan ortiq tajribasi bor JavaScript oqituvchi",
    "experience": "Professional Developer",
    "socialLinks": {
      "telegram": "https://t.me/username",
      "github": "https://github.com/username"
    },
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Mentor Profiles

```http
GET /api/mentor-profiles/getall
Authorization: Not Required (Public)
```

**Response (200):**
```json
{
  "message": "All mentor profiles",
  "data": [
    {
      "id": "mentor-profile-uuid",
      "userId": "user-uuid",
      "about": "10 yildan ortiq tajribasi bor JavaScript oqituvchi",
      "experience": "Professional Developer"
    }
  ]
}
```

---

### 3. Get Mentor Profile by ID

```http
GET /api/mentor-profiles/get-one/:id
Authorization: Not Required (Public)
```

**Response (200):**
```json
{
  "message": "Mentor profile details",
  "data": {
    "id": "mentor-profile-uuid",
    "userId": "user-uuid",
    "about": "10 yildan ortiq tajribasi bor JavaScript oqituvchi",
    "experience": "Professional Developer",
    "socialLinks": {
      "telegram": "https://t.me/username",
      "github": "https://github.com/username"
    }
  }
}
```

---

### 4. Update Mentor Profile

```http
PATCH /api/mentor-profiles/update-one/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "about": "15 yildan ortiq tajribasi bor JavaScript oqituvchi (Updated)",
  "experience": "Senior Developer"
}
```

**Response (200):**
```json
{
  "message": "Mentor profile updated successfully"
}
```

---

### 5. Delete Mentor Profile

```http
DELETE /api/mentor-profiles/delete-one/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Mentor profile deleted successfully"
}
```

---

## ⭐ Rating (Baholash)

### 1. Create Rating

```http
POST /api/rating
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "courseId": "course-uuid",
  "userId": "user-uuid",
  "rating": 5,
  "comment": "Kurs juda yaxshi bo'ldi!"
}
```

**Response (201):**
```json
{
  "message": "Rating created successfully",
  "data": {
    "id": 1,
    "courseId": "course-uuid",
    "userId": "user-uuid",
    "rating": 5,
    "comment": "Kurs juda yaxshi bo'ldi!",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Ratings

```http
GET /api/rating
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All ratings",
  "data": [
    {
      "id": 1,
      "courseId": "course-uuid",
      "userId": "user-uuid",
      "rating": 5,
      "comment": "Kurs juda yaxshi bo'ldi!"
    }
  ]
}
```

---

### 3. Get Rating by ID

```http
GET /api/rating/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Rating details",
  "data": {
    "id": 1,
    "courseId": "course-uuid",
    "userId": "user-uuid",
    "rating": 5,
    "comment": "Kurs juda yaxshi bo'ldi!"
  }
}
```

---

### 4. Update Rating

```http
PATCH /api/rating/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Kurs yaxshi, lekin ba'zi qismlari yangilash kerak"
}
```

**Response (200):**
```json
{
  "message": "Rating updated successfully"
}
```

---

### 5. Delete Rating

```http
DELETE /api/rating/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Rating deleted successfully"
}
```

---

## 📍 Last Activity (Oxirgi Faoliyat)

### 1. Create Last Activity

```http
POST /api/last-activity
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "userId": "user-uuid",
  "courseId": "course-uuid",
  "activityType": "LESSON_VIEWED",
  "timestamp": "2026-07-19T10:30:00Z"
}
```

**Response (201):**
```json
{
  "message": "Activity tracked successfully",
  "data": {
    "id": 1,
    "userId": "user-uuid",
    "courseId": "course-uuid",
    "activityType": "LESSON_VIEWED",
    "timestamp": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Last Activities

```http
GET /api/last-activity
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All activities",
  "data": [
    {
      "id": 1,
      "userId": "user-uuid",
      "courseId": "course-uuid",
      "activityType": "LESSON_VIEWED",
      "timestamp": "2026-07-19T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Last Activity by ID

```http
GET /api/last-activity/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Activity details",
  "data": {
    "id": 1,
    "userId": "user-uuid",
    "courseId": "course-uuid",
    "activityType": "LESSON_VIEWED",
    "timestamp": "2026-07-19T10:30:00Z"
  }
}
```

---

### 4. Update Last Activity

```http
PATCH /api/last-activity/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "activityType": "EXAM_COMPLETED",
  "timestamp": "2026-07-19T11:45:00Z"
}
```

**Response (200):**
```json
{
  "message": "Activity updated successfully"
}
```

---

### 5. Delete Last Activity

```http
DELETE /api/last-activity/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Activity deleted successfully"
}
```

---

## 📞 Contact (Aloqa Shakli)

### 1. Create Contact Message

```http
POST /api/contact
Content-Type: application/json
Authorization: Not Required (Public)
```

**Request Body:**
```json
{
  "name": "Fayzillo Ummatov",
  "email": "fayzillo@example.com",
  "subject": "Platformani Ichida Xato Topildi",
  "message": "Sayt yuklashda sekin ishlayapti"
}
```

**Response (201):**
```json
{
  "message": "Contact message sent successfully",
  "data": {
    "id": 1,
    "name": "Fayzillo Ummatov",
    "email": "fayzillo@example.com",
    "subject": "Platformani Ichida Xato Topildi",
    "message": "Sayt yuklashda sekin ishlayapti",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 2. Get All Contact Messages

```http
GET /api/contact
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "All contact messages",
  "data": [
    {
      "id": 1,
      "name": "Fayzillo Ummatov",
      "email": "fayzillo@example.com",
      "subject": "Platformani Ichida Xato Topildi",
      "message": "Sayt yuklashda sekin ishlayapti",
      "createdAt": "2026-07-19T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Contact Message by ID

```http
GET /api/contact/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Contact message details",
  "data": {
    "id": 1,
    "name": "Fayzillo Ummatov",
    "email": "fayzillo@example.com",
    "subject": "Platformani Ichida Xato Topildi",
    "message": "Sayt yuklashda sekin ishlayapti",
    "createdAt": "2026-07-19T10:30:00Z"
  }
}
```

---

### 4. Update Contact Message

```http
PATCH /api/contact/:id
Content-Type: application/json
Authorization: Required (Bearer Token)
```

**Request Body:**
```json
{
  "status": "RESPONDED",
  "response": "Biz muammoniga qarab qarata berdik"
}
```

**Response (200):**
```json
{
  "message": "Contact message updated successfully"
}
```

---

### 5. Delete Contact Message

```http
DELETE /api/contact/:id
Authorization: Required (Bearer Token)
```

**Response (200):**
```json
{
  "message": "Contact message deleted successfully"
}
```

---

## 🔑 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Muvaffaqqiyatli so'rov |
| 201 | Created - Resurs yaratildi |
| 400 | Bad Request - Noto'g'ri so'rov |
| 401 | Unauthorized - Autentifikatsiya kerak |
| 403 | Forbidden - Ruxsat yo'q |
| 404 | Not Found - Resurs topilmadi |
| 500 | Internal Server Error - Server xatosi |

---

## ⚙️ Request Headers

Barcha protected endpoints uchun quyidagi headerlar kerak:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

Fayl yuklash uchun:

```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

---

## 📚 Error Response Format

```json
{
  "statusCode": 400,
  "message": "Xato tavsifi",
  "error": "Bad Request"
}
```

---

## 🎯 Quick Reference

**Total Endpoints:** 80+

- Authentication: 3 (Public)
- Users: 7 (Mostly Protected)
- Courses: 4 (Mixed)
- Lessons: 5 (Protected)
- Lesson Modules: 5 (Protected)
- Lesson Files: 5 (Protected)
- Lesson Views: 5 (Protected)
- Course Categories: 5 (Mixed)
- Homeworks: 5 (Protected)
- Homework Submissions: 5 (Protected)
- Exams: 5 (Protected)
- Exam Results: 5 (Protected)
- Questions: 5 (Protected)
- Question Answers: 5 (Protected)
- Assigned Courses: 5 (Protected)
- Purchased Courses: 5 (Protected)
- Mentor Profiles: 5 (Mixed)
- Rating: 5 (Protected)
- Last Activity: 5 (Protected)
- Contact: 5 (Mixed)

---

**Last Updated:** July 19, 2026  
**API Version:** 1.0
