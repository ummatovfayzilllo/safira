# 📚 Imtihon Backend - TO'LIQ API ENDPOINTS

**Yangilandi:** Iyul 2026  
**Jami Endpoints:** 80+

---

## 📋 Fihrist

1. [Autentifikatsiya (3)](#autentifikatsiya)
2. [Foydalanuvchilar (7)](#foydalanuvchilar)
3. [Kurslar (4)](#kurslar)
4. [Darslar (5)](#darslar)
5. [Dars Modullar (5)](#dars-modullar)
6. [Dars Fayllari (5)](#dars-fayllari)
7. [Dars Ko'rishlar (5)](#dars-ko'rishlar)
8. [Kurs Kategoriyalari (5)](#kurs-kategoriyalari)
9. [Uyga Vazifalar (5)](#uyga-vazifalar)
10. [Uyga Vazifa Taqdimotlari (5)](#uyga-vazifa-taqdimotlari)
11. [Imtihonlar (5)](#imtihonlar)
12. [Imtihon Natijalar (5)](#imtihon-natijalar)
13. [Savollar (5)](#savollar)
14. [Javoblar (5)](#javoblar)
15. [Tayin Qilingan Kurslar (5)](#tayin-qilingan-kurslar)
16. [Sotib Olingan Kurslar (5)](#sotib-olingan-kurslar)
17. [Mentor Profillari (5)](#mentor-profillari)
18. [Baholash (5)](#baholash)
19. [Oxirgi Faoliyat (5)](#oxirgi-faoliyat)
20. [Aloqa (5)](#aloqa)

---

## 🔐 Autentifikatsiya

### 1. Ro'yxatdan O'tish (Register)

```http
POST /api/auth/register
Content-Type: application/json
Himoya: Kerak emas (Public)
```

**So'rov Tanasi:**
```json
{
  "fullName": "Fayzillo Ummatov",
  "email": "fayzillo@example.com",
  "password": "securePassword123"
}
```

**Javob (201):**
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

**Frontend da ishlatish:**
```javascript
const register = async (fullName, email, password) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password })
  });
  const data = await response.json();
  // data.data.code - foydalanuvchiga yuborilgan kod
  // data.data.time - timeout (minut)
  return data;
};
```

---

### 2. Kodni Tasdiqlas (Verify)

```http
POST /api/auth/verify
Content-Type: application/json
Himoya: Kerak emas (Public)
```

**So'rov Tanasi:**
```json
{
  "email": "fayzillo@example.com",
  "code": 123456
}
```

**Javob (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Frontend da ishlatish:**
```javascript
const verifyCode = async (email, code) => {
  const response = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code: parseInt(code) })
  });
  const data = await response.json();
  // Tokenlarni localStorage da saqla
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
};
```

---

### 3. Kirish (Login)

```http
POST /api/auth/login
Content-Type: application/json
Himoya: Kerak emas (Public)
```

**So'rov Tanasi:**
```json
{
  "email": "fayzillo@example.com",
  "password": "securePassword123"
}
```

**Javob (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Frontend da ishlatish:**
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
};
```

---

## 👥 Foydalanuvchilar

### 1. Yangi Foydalanuvchi Yaratish

```http
POST /api/users/create
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```
{
  "fullName": "Fayzillo Ummatov",
  "email": "fayzillo@example.com",
  "password": "securePassword123",
  "image": <binary_file> (optional)
}
```

**Javob (201):**
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

**Frontend da ishlatish:**
```javascript
const createUser = async (fullName, email, password, imageFile) => {
  const formData = new FormData();
  formData.append('fullName', fullName);
  formData.append('email', email);
  formData.append('password', password);
  if (imageFile) formData.append('image', imageFile);
  
  const response = await fetch('/api/users/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  return await response.json();
};
```

---

### 2. Barcha Foydalanuvchilarni Olish

```http
GET /api/users/get-all
Himoya: Kerak emas (Public)
```

**Javob (200):**
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
      "createdAt": "2026-07-19T10:30:00Z"
    }
  ]
}
```

**Frontend da ishlatish:**
```javascript
const getAllUsers = async () => {
  const response = await fetch('/api/users/get-all');
  return await response.json();
};
```

---

### 3. ID orqali Foydalanuvchini Olish

```http
GET /api/users/get-byid/:id
Himoya: Kerak (Bearer Token)
```

**Frontend da ishlatish:**
```javascript
const getUserById = async (userId) => {
  const response = await fetch(`/api/users/get-byid/${userId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return await response.json();
};
```

---

### 4. Mening Profilimni Olish

```http
GET /api/users/get-my
Himoya: Kerak (Bearer Token)
```

**Frontend da ishlatish:**
```javascript
const getMyProfile = async () => {
  const response = await fetch('/api/users/get-my', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return await response.json();
};
```

---

### 5. Foydalanuvchini O'zgartirish

```http
PATCH /api/users/:id
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**Frontend da ishlatish:**
```javascript
const updateUser = async (userId, updates) => {
  const formData = new FormData();
  Object.keys(updates).forEach(key => {
    formData.append(key, updates[key]);
  });
  
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  return await response.json();
};
```

---

### 6. Foydalanuvchi Rasmini Yangilash

```http
PATCH /api/users/updateimange/:id
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**Frontend da ishlatish:**
```javascript
const updateUserImage = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch(`/api/users/updateimange/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  return await response.json();
};
```

---

### 7. Foydalanuvchini O'chirish

```http
DELETE /api/users/:id
Himoya: Kerak (Bearer Token)
```

**Frontend da ishlatish:**
```javascript
const deleteUser = async (userId) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return await response.json();
};
```

---

## 📚 Kurslar

### 1. Yangi Kurs Yaratish

```http
POST /api/courses/create-one
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
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

**Frontend da ishlatish:**
```javascript
const createCourse = async (courseData, bannerFile, videoFile) => {
  const formData = new FormData();
  Object.keys(courseData).forEach(key => {
    formData.append(key, courseData[key]);
  });
  if (bannerFile) formData.append('banner', bannerFile);
  if (videoFile) formData.append('introVideo', videoFile);
  
  const response = await fetch('/api/courses/create-one', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  return await response.json();
};
```

---

### 2. Barcha Kurslarni Olish

```http
GET /api/courses/getall
Himoya: Kerak emas (Public)
```

**Frontend da ishlatish:**
```javascript
const getAllCourses = async () => {
  const response = await fetch('/api/courses/getall');
  return await response.json();
};
```

---

### 3. ID orqali Kursni Olish

```http
GET /api/courses/get-one/:id
Himoya: Kerak emas (Public)
```

**Frontend da ishlatish:**
```javascript
const getCourseById = async (courseId) => {
  const response = await fetch(`/api/courses/get-one/${courseId}`);
  return await response.json();
};
```

---

### 4. Kursni O'zgartirish

```http
PATCH /api/courses/update-one/:id
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**Frontend da ishlatish:**
```javascript
const updateCourse = async (courseId, updates, bannerFile, videoFile) => {
  const formData = new FormData();
  Object.keys(updates).forEach(key => {
    formData.append(key, updates[key]);
  });
  if (bannerFile) formData.append('banner', bannerFile);
  if (videoFile) formData.append('introVideo', videoFile);
  
  const response = await fetch(`/api/courses/update-one/${courseId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  return await response.json();
};
```

---

### 5. Kursni O'chirish

```http
DELETE /api/courses/delte-one/:id
Himoya: Kerak (Bearer Token)
```

---

## 📖 Darslar

### 1. Yangi Dars Yaratish

```http
POST /api/lessons/create-one
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```
{
  "name": "If Statement",
  "about": "Condition operatorlarini o'rganamiz",
  "lessonModulId": "lesson-module-uuid",
  "video": <binary_file> (required)
}
```

**Frontend da ishlatish:**
```javascript
const createLesson = async (lessonData, videoFile) => {
  const formData = new FormData();
  Object.keys(lessonData).forEach(key => {
    formData.append(key, lessonData[key]);
  });
  formData.append('video', videoFile);
  
  const response = await fetch('/api/lessons/create-one', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  return await response.json();
};
```

---

### 2. Barcha Darslarni Olish

```http
GET /api/lessons/getall
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Darsni Olish

```http
GET /api/lessons/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Darsni O'zgartirish

```http
PATCH /api/lessons/update-oen/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Darsni O'chirish

```http
DELETE /api/lessons/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## 📦 Dars Modullar

### 1. Yangi Dars Moduli Yaratish

```http
POST /api/lesson-modules/create
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```json
{
  "name": "JavaScript Asoslari",
  "about": "JavaScript asosiy kontseptsiyalari",
  "courseId": "course-uuid"
}
```

**Frontend da ishlatish:**
```javascript
const createLessonModule = async (name, about, courseId) => {
  const response = await fetch('/api/lesson-modules/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify({ name, about, courseId })
  });
  return await response.json();
};
```

---

### 2. Barcha Dars Modullarni Olish

```http
GET /api/lesson-modules/getall
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Dars Modulini Olish

```http
GET /api/lesson-modules/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Dars Modulini O'zgartirish

```http
PATCH /api/lesson-modules/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Dars Modulini O'chirish

```http
DELETE /api/lesson-modules/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## 📎 Dars Fayllari

### 1. Yangi Dars Fayli Yaratish

```http
POST /api/lesson-files/v1/create-one
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```
{
  "name": "JavaScript Cheat Sheet",
  "about": "JavaScript asosiy funksiyalari",
  "lessonId": "lesson-uuid",
  "file": <binary_file> (required)
}
```

---

### 2. Barcha Dars Fayllarni Olish

```http
GET /api/lesson-files/v2/get-all
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Dars Faylini Olish

```http
GET /api/lesson-files/v3/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Dars Faylini O'zgartirish

```http
PATCH /api/lesson-files/v4/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Dars Faylini O'chirish

```http
DELETE /api/lesson-files/v5/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## 👁️ Dars Ko'rishlar

### 1. Yangi Dars Ko'rishini Yaratish

```http
POST /api/lesson-views
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```json
{
  "lessonId": "lesson-uuid",
  "userId": "user-uuid",
  "watchedSeconds": 300
}
```

---

### 2. Barcha Dars Ko'rishlarni Olish

```http
GET /api/lesson-views
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Dars Ko'rishini Olish

```http
GET /api/lesson-views/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Dars Ko'rishini O'zgartirish

```http
PATCH /api/lesson-views/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Dars Ko'rishini O'chirish

```http
DELETE /api/lesson-views/:id
Himoya: Kerak (Bearer Token)
```

---

## 🏷️ Kurs Kategoriyalari

### 1. Yangi Kurs Kategoriyasi Yaratish

```http
POST /api/course-categories/create
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```json
{
  "name": "Programming Languages",
  "about": "Dasturlash tillarini o'rganish"
}
```

**Frontend da ishlatish:**
```javascript
const createCategory = async (name, about) => {
  const response = await fetch('/api/course-categories/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify({ name, about })
  });
  return await response.json();
};
```

---

### 2. Barcha Kurs Kategoriyalarni Olish

```http
GET /api/course-categories/get-all
Himoya: Kerak emas (Public)
```

**Frontend da ishlatish:**
```javascript
const getCategories = async () => {
  const response = await fetch('/api/course-categories/get-all');
  return await response.json();
};
```

---

### 3. ID orqali Kurs Kategoriyasini Olish

```http
GET /api/course-categories/get-one/:id
Himoya: Kerak emas (Public)
```

---

### 4. Kurs Kategoriyasini O'zgartirish

```http
PATCH /api/course-categories/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Kurs Kategoriyasini O'chirish

```http
DELETE /api/course-categories/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## 📝 Uyga Vazifalar

### 1. Yangi Uyga Vazifasi Yaratish

```http
POST /api/homeworks/create
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```
{
  "task": "JavaScript asosiy operatorlarini o'rganib misollar yozish",
  "lessonId": "lesson-uuid",
  "files": <binary_file[]> (up to 10 files, optional)
}
```

**Frontend da ishlatish:**
```javascript
const createHomework = async (task, lessonId, files) => {
  const formData = new FormData();
  formData.append('task', task);
  formData.append('lessonId', lessonId);
  files.forEach(file => formData.append('files', file));
  
  const response = await fetch('/api/homeworks/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  return await response.json();
};
```

---

### 2. Barcha Uyga Vazifalarni Olish

```http
GET /api/homeworks/get-all
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Uyga Vazifasini Olish

```http
GET /api/homeworks/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Uyga Vazifasini O'zgartirish

```http
PATCH /api/homeworks/update-one/:id
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

---

### 5. Uyga Vazifasini O'chirish

```http
DELETE /api/homeworks/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## ✅ Uyga Vazifa Taqdimotlari

### 1. Yangi Uyga Vazifa Taqdimoti Yaratish

```http
POST /api/homework-submissions/create
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```
{
  "homeworkId": "homework-uuid",
  "userId": "user-uuid",
  "submissionText": "Vazifani bajarildi va taqdim etildi",
  "files": <binary_file[]> (optional)
}
```

---

### 2. Barcha Uyga Vazifa Taqdimotlarni Olish

```http
GET /api/homework-submissions/get-all
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Uyga Vazifa Taqdimotini Olish

```http
GET /api/homework-submissions/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Uyga Vazifa Taqdimotini O'zgartirish

```http
PATCH /api/homework-submissions/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Uyga Vazifa Taqdimotini O'chirish

```http
DELETE /api/homework-submissions/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## ❓ Imtihonlar

### 1. Yangi Imtihon Yaratish

```http
POST /api/exams/create
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
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

**Frontend da ishlatish:**
```javascript
const createExam = async (examData) => {
  const response = await fetch('/api/exams/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(examData)
  });
  return await response.json();
};
```

---

### 2. Barcha Imtihonlarni Olish

```http
GET /api/exams/get-all
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Imtihonni Olish

```http
GET /api/exams/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Imtihonni O'zgartirish

```http
PATCH /api/exams/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Imtihonni O'chirish

```http
DELETE /api/exams/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## 📊 Imtihon Natijalar

### 1. Yangi Imtihon Natijasi Yaratish

```http
POST /api/exam-results/create
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```json
{
  "examId": "exam-uuid",
  "userId": "user-uuid",
  "selectedAnswer": "C",
  "isCorrect": true,
  "score": 100
}
```

---

### 2. Barcha Imtihon Natijalarni Olish

```http
GET /api/exam-results/get-all
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Imtihon Natijasini Olish

```http
GET /api/exam-results/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Imtihon Natijasini O'zgartirish

```http
PATCH /api/exam-results/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Imtihon Natijasini O'chirish

```http
DELETE /api/exam-results/delte-ne/:id
Himoya: Kerak (Bearer Token)
```

---

## 💬 Savollar (Q&A Forum)

### 1. Yangi Savol Yaratish

```http
POST /api/questions/create
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```
{
  "title": "JavaScript da async/await nima?",
  "content": "Async/await ning asosiy tushunchalarini tushuntirib bering",
  "courseId": "course-uuid",
  "files": <binary_file[]> (optional)
}
```

---

### 2. Barcha Savollarni Olish

```http
GET /api/questions/get-all
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Savolni Olish

```http
GET /api/questions/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Savolni O'zgartirish

```http
PATCH /api/questions/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Savolni O'chirish

```http
DELETE /api/questions/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## 📢 Javoblar

### 1. Yangi Javob Yaratish

```http
POST /api/question-answers/create
Content-Type: multipart/form-data
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```
{
  "content": "Async/await JavaScriptda ishlashni soddalashtiradi",
  "questionId": "question-uuid",
  "userId": "user-uuid",
  "files": <binary_file[]> (optional)
}
```

---

### 2. Barcha Javoblarni Olish

```http
GET /api/question-answers
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Javobni Olish

```http
GET /api/question-answers/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Javobni O'zgartirish

```http
PATCH /api/question-answers/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Javobni O'chirish

```http
DELETE /api/question-answers/:id
Himoya: Kerak (Bearer Token)
```

---

## 📚 Tayin Qilingan Kurslar

### 1. Yangi Kursni Tayin Qilish

```http
POST /api/assigned-courses/create-one
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```json
{
  "courseId": "course-uuid",
  "userId": "user-uuid",
  "assignedDate": "2026-07-19T10:30:00Z"
}
```

---

### 2. Barcha Tayin Qilingan Kurslarni Olish

```http
GET /api/assigned-courses/getall
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Tayin Qilingan Kursni Olish

```http
GET /api/assigned-courses/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Tayin Qilingan Kursni O'zgartirish

```http
PATCH /api/assigned-courses/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Tayin Qilingan Kursni O'chirish

```http
DELETE /api/assigned-courses/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## 💳 Sotib Olingan Kurslar

### 1. Yangi Kursni Sotib Olish

```http
POST /api/purcached-courses/create-one
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
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

---

### 2. Barcha Sotib Olingan Kurslarni Olish

```http
GET /api/purcached-courses/get-all
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Sotib Olingan Kursni Olish

```http
GET /api/purcached-courses/get-one/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Sotib Olingan Kursni O'zgartirish

```http
PATCH /api/purcached-courses/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Sotib Olingan Kursni O'chirish

```http
DELETE /api/purcached-courses/delete-oen/:id
Himoya: Kerak (Bearer Token)
```

---

## 👨‍🏫 Mentor Profillari

### 1. Yangi Mentor Profili Yaratish

```http
POST /api/mentor-profiles/create
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
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

---

### 2. Barcha Mentor Profillarini Olish

```http
GET /api/mentor-profiles/getall
Himoya: Kerak emas (Public)
```

---

### 3. ID orqali Mentor Profilini Olish

```http
GET /api/mentor-profiles/get-one/:id
Himoya: Kerak emas (Public)
```

---

### 4. Mentor Profilini O'zgartirish

```http
PATCH /api/mentor-profiles/update-one/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Mentor Profilini O'chirish

```http
DELETE /api/mentor-profiles/delete-one/:id
Himoya: Kerak (Bearer Token)
```

---

## ⭐ Baholash (Rating)

### 1. Yangi Baholash Yaratish

```http
POST /api/rating
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```json
{
  "courseId": "course-uuid",
  "userId": "user-uuid",
  "rating": 5,
  "comment": "Kurs juda yaxshi bo'ldi!"
}
```

---

### 2. Barcha Baholashlarni Olish

```http
GET /api/rating
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Baholashni Olish

```http
GET /api/rating/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Baholashni O'zgartirish

```http
PATCH /api/rating/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Baholashni O'chirish

```http
DELETE /api/rating/:id
Himoya: Kerak (Bearer Token)
```

---

## 📍 Oxirgi Faoliyat

### 1. Yangi Faoliyat Yaratish

```http
POST /api/last-activity
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

**So'rov Tanasi:**
```json
{
  "userId": "user-uuid",
  "courseId": "course-uuid",
  "activityType": "LESSON_VIEWED",
  "timestamp": "2026-07-19T10:30:00Z"
}
```

---

### 2. Barcha Faoliyatlarni Olish

```http
GET /api/last-activity
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Faoliyatni Olish

```http
GET /api/last-activity/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Faoliyatni O'zgartirish

```http
PATCH /api/last-activity/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Faoliyatni O'chirish

```http
DELETE /api/last-activity/:id
Himoya: Kerak (Bearer Token)
```

---

## 📞 Aloqa (Contact)

### 1. Yangi Aloqa Xabari Yaratish

```http
POST /api/contact
Content-Type: application/json
Himoya: Kerak emas (Public)
```

**So'rov Tanasi:**
```json
{
  "name": "Fayzillo Ummatov",
  "email": "fayzillo@example.com",
  "subject": "Platformani Ichida Xato Topildi",
  "message": "Sayt yuklashda sekin ishlayapti"
}
```

---

### 2. Barcha Aloqa Xabarlarmni Olish

```http
GET /api/contact
Himoya: Kerak (Bearer Token)
```

---

### 3. ID orqali Aloqa Xabarini Olish

```http
GET /api/contact/:id
Himoya: Kerak (Bearer Token)
```

---

### 4. Aloqa Xabarini O'zgartirish

```http
PATCH /api/contact/:id
Content-Type: application/json
Himoya: Kerak (Bearer Token)
```

---

### 5. Aloqa Xabarini O'chirish

```http
DELETE /api/contact/:id
Himoya: Kerak (Bearer Token)
```

---

## 🔑 HTTP Status Kodlari

| Kod | Tavsif |
|-----|--------|
| 200 | OK - Muvaffaqqiyatli so'rov |
| 201 | Created - Resurs yaratildi |
| 400 | Bad Request - Noto'g'ri so'rov |
| 401 | Unauthorized - Autentifikatsiya kerak |
| 403 | Forbidden - Ruxsat yo'q |
| 404 | Not Found - Resurs topilmadi |
| 500 | Internal Server Error - Server xatosi |

---

## ⚙️ So'rov Sarlavhalari

Barcha protected endpoints uchun:

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

## 🎯 Tez Havola

**Jami Endpoints:** 80+

- Autentifikatsiya: 3 (Public)
- Foydalanuvchilar: 7 (Mostly Protected)
- Kurslar: 4 (Mixed)
- Darslar: 5 (Protected)
- Dars Modullar: 5 (Protected)
- Dars Fayllari: 5 (Protected)
- Dars Ko'rishlar: 5 (Protected)
- Kurs Kategoriyalari: 5 (Mixed)
- Uyga Vazifalar: 5 (Protected)
- Uyga Vazifa Taqdimotlari: 5 (Protected)
- Imtihonlar: 5 (Protected)
- Imtihon Natijalar: 5 (Protected)
- Savollar: 5 (Protected)
- Javoblar: 5 (Protected)
- Tayin Qilingan Kurslar: 5 (Protected)
- Sotib Olingan Kurslar: 5 (Protected)
- Mentor Profillari: 5 (Mixed)
- Baholash: 5 (Protected)
- Oxirgi Faoliyat: 5 (Protected)
- Aloqa: 5 (Mixed)

---

**Oxirgi Yangilash:** Iyul 19, 2026  
**API Versiyasi:** 1.0
