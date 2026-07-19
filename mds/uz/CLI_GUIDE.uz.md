# 💻 CLI Qo'llanma - Frontend Development uchun

Frontend development davomida API ma'lumotlarini tezkor olish uchun bu qo'llanmani ishlating.

---

## 📋 Tezkor Havolalar

```bash
# Barcha API endpoints larni ko'rish
cat ./mds/uz/ALL_POINTS.uz.md

# README dan o'rganish
cat ./mds/uz/README.uz.md

# Architecture detallarini ko'rish
cat ./.claude/architecture.md
```

---

## 🔐 Autentifikatsiya API lar

### Register va Login uchun Endpoints

```bash
# Register - Public (Token kerak emas)
POST /api/auth/register
Body: { fullName, email, password }
Response: { data: { code, time } }

# Verify - Public
POST /api/auth/verify
Body: { email, code }
Response: { accessToken, refreshToken }

# Login - Public
POST /api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken }
```

### Frontend Code

```javascript
// .env
REACT_APP_API_URL=http://localhost:15975/api

// auth.service.js
class AuthService {
  async register(fullName, email, password) {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    }).then(r => r.json());
  }

  async verify(email, code) {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    }).then(r => r.json());
  }

  async login(email, password) {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json());
  }
}
```

---

## 👥 User Endpoints (7 ta)

```bash
# 1. Get My Profile
GET /api/users/get-my
Headers: Authorization: Bearer <token>
Response: { data: { id, fullName, email, image, role } }

# 2. Get All Users (Public)
GET /api/users/get-all
Response: { data: [user, ...] }

# 3. Get User by ID
GET /api/users/get-byid/:id
Headers: Authorization: Bearer <token>
Response: { data: { id, fullName, email, image, role } }

# 4. Create User
POST /api/users/create
Headers: Authorization: Bearer <token>
Body: multipart/form-data { fullName, email, password, image? }
Response: { data: { id, fullName, email, image, role } }

# 5. Update User
PATCH /api/users/:id
Headers: Authorization: Bearer <token>
Body: multipart/form-data { fullName?, email?, password?, image? }
Response: { data: { id, fullName, email, image } }

# 6. Update User Image
PATCH /api/users/updateimange/:id
Headers: Authorization: Bearer <token>
Body: multipart/form-data { image }
Response: { data: { id, image } }

# 7. Delete User
DELETE /api/users/:id
Headers: Authorization: Bearer <token>
Response: { message: "User deleted successfully" }
```

### Frontend Code - User Service

```javascript
// user.service.js
class UserService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  async getMyProfile() {
    return fetch(`${this.apiUrl}/users/get-my`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    }).then(r => r.json());
  }

  async getAllUsers() {
    return fetch(`${this.apiUrl}/users/get-all`)
      .then(r => r.json());
  }

  async getUserById(id) {
    return fetch(`${this.apiUrl}/users/get-byid/${id}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    }).then(r => r.json());
  }

  async updateUser(id, data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    return fetch(`${this.apiUrl}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData
    }).then(r => r.json());
  }
}
```

---

## 📚 Kurs Endpoints (4 ta)

```bash
# 1. Get All Courses (Public)
GET /api/courses/getall
Response: { data: [{ id, name, about, price, discount, level, published }, ...] }

# 2. Get Course by ID (Public)
GET /api/courses/get-one/:id
Response: { data: { id, name, about, price, discount, banner, level, modules } }

# 3. Create Course
POST /api/courses/create-one
Headers: Authorization: Bearer <token>
Body: multipart/form-data { name, about, price, discount, categoryId, mentorId, level, published, banner?, introVideo? }
Response: { data: { id, name, banner, introVideo, level } }

# 4. Update Course
PATCH /api/courses/update-one/:id
Headers: Authorization: Bearer <token>
Body: multipart/form-data { name?, about?, price?, discount?, level?, published?, banner?, introVideo? }
Response: { data: { id, name, price } }

# 5. Delete Course
DELETE /api/courses/delte-one/:id
Headers: Authorization: Bearer <token>
Response: { message: "Course deleted successfully" }
```

### Frontend Code - Courses Component

```javascript
// courses.service.js
class CoursesService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.token = localStorage.getItem('accessToken');
  }

  async getAllCourses() {
    return fetch(`${this.apiUrl}/courses/getall`)
      .then(r => r.json());
  }

  async getCourseById(id) {
    return fetch(`${this.apiUrl}/courses/get-one/${id}`)
      .then(r => r.json());
  }

  async createCourse(courseData, files) {
    const formData = new FormData();
    Object.keys(courseData).forEach(key => {
      formData.append(key, courseData[key]);
    });
    if (files.banner) formData.append('banner', files.banner);
    if (files.introVideo) formData.append('introVideo', files.introVideo);

    return fetch(`${this.apiUrl}/courses/create-one`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    }).then(r => r.json());
  }
}

// React Component
function CoursesList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const coursesService = new CoursesService(process.env.REACT_APP_API_URL);
    coursesService.getAllCourses().then(res => {
      setCourses(res.data);
    });
  }, []);

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.name}</h3>
          <p>{course.about}</p>
          <span>{course.price} so'm</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 📖 Dars Endpoints (5 ta)

```bash
# 1. Get All Lessons
GET /api/lessons/getall
Headers: Authorization: Bearer <token>
Response: { data: [{ id, name, about, video }, ...] }

# 2. Get Lesson by ID
GET /api/lessons/get-one/:id
Headers: Authorization: Bearer <token>
Response: { data: { id, name, about, video, files } }

# 3. Create Lesson
POST /api/lessons/create-one
Headers: Authorization: Bearer <token>
Body: multipart/form-data { name, about, lessonModulId, video }
Response: { data: { id, name, video } }

# 4. Update Lesson
PATCH /api/lessons/update-oen/:id
Headers: Authorization: Bearer <token>
Body: JSON { name?, about? }
Response: { data: { id, name } }

# 5. Delete Lesson
DELETE /api/lessons/delete-one/:id
Headers: Authorization: Bearer <token>
Response: { message: "Lesson deleted successfully" }
```

---

## 📦 Dars Modullar (5 ta)

```bash
# 1. Get All Lesson Modules
GET /api/lesson-modules/getall
Headers: Authorization: Bearer <token>
Response: { data: [{ id, name, about, courseId }, ...] }

# 2. Get Lesson Module by ID
GET /api/lesson-modules/get-one/:id
Headers: Authorization: Bearer <token>
Response: { data: { id, name, about, courseId, lessons } }

# 3. Create Lesson Module
POST /api/lesson-modules/create
Headers: Authorization: Bearer <token>
Body: JSON { name, about, courseId }
Response: { data: { id, name } }

# 4. Update Lesson Module
PATCH /api/lesson-modules/update-one/:id
Headers: Authorization: Bearer <token>
Body: JSON { name?, about? }
Response: { data: { id, name } }

# 5. Delete Lesson Module
DELETE /api/lesson-modules/delete-one/:id
Headers: Authorization: Bearer <token>
Response: { message: "Lesson module deleted successfully" }
```

---

## 🏷️ Kurs Kategoriyalari (5 ta)

```bash
# 1. Get All Categories (Public)
GET /api/course-categories/get-all
Response: { data: [{ id, name, about }, ...] }

# 2. Get Category by ID (Public)
GET /api/course-categories/get-one/:id
Response: { data: { id, name, about, courses } }

# 3. Create Category
POST /api/course-categories/create
Headers: Authorization: Bearer <token>
Body: JSON { name, about }
Response: { data: { id, name } }

# 4. Update Category
PATCH /api/course-categories/update-one/:id
Headers: Authorization: Bearer <token>
Body: JSON { name?, about? }
Response: { data: { id, name } }

# 5. Delete Category
DELETE /api/course-categories/delete-one/:id
Headers: Authorization: Bearer <token>
Response: { message: "Category deleted successfully" }
```

### Frontend Code - Categories

```javascript
// categories.service.js
class CategoriesService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async getCategories() {
    return fetch(`${this.apiUrl}/course-categories/get-all`)
      .then(r => r.json());
  }
}

// React Hook
function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = new CategoriesService(process.env.REACT_APP_API_URL);
    service.getCategories()
      .then(res => setCategories(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
```

---

## 📝 Uyga Vazifalar (5 ta)

```bash
# 1. Get All Homeworks
GET /api/homeworks/get-all
Headers: Authorization: Bearer <token>
Response: { data: [{ id, task, lessonId }, ...] }

# 2. Get Homework by ID
GET /api/homeworks/get-one/:id
Headers: Authorization: Bearer <token>
Response: { data: { id, task, lessonId, files } }

# 3. Create Homework
POST /api/homeworks/create
Headers: Authorization: Bearer <token>
Body: multipart/form-data { task, lessonId, files[]? }
Response: { data: { id, task, files } }

# 4. Update Homework
PATCH /api/homeworks/update-one/:id
Headers: Authorization: Bearer <token>
Body: multipart/form-data { task?, files[]? }
Response: { data: { id, task } }

# 5. Delete Homework
DELETE /api/homeworks/delete-one/:id
Headers: Authorization: Bearer <token>
Response: { message: "Homework deleted successfully" }
```

---

## ✅ Uyga Vazifa Taqdimotlari (5 ta)

```bash
# 1. Get All Submissions
GET /api/homework-submissions/get-all
Headers: Authorization: Bearer <token>
Response: { data: [{ id, homeworkId, userId, status }, ...] }

# 2. Get Submission by ID
GET /api/homework-submissions/get-one/:id
Headers: Authorization: Bearer <token>
Response: { data: { id, homeworkId, userId, submissionText, status, files } }

# 3. Create Submission
POST /api/homework-submissions/create
Headers: Authorization: Bearer <token>
Body: multipart/form-data { homeworkId, userId, submissionText, files[]? }
Response: { data: { id, status: "PENDING" } }

# 4. Update Submission (for grading)
PATCH /api/homework-submissions/update-one/:id
Headers: Authorization: Bearer <token>
Body: JSON { status, feedback? }
Response: { data: { id, status } }

# 5. Delete Submission
DELETE /api/homework-submissions/delete-one/:id
Headers: Authorization: Bearer <token>
Response: { message: "Submission deleted successfully" }
```

---

## ❓ Imtihonlar (5 ta)

```bash
# 1. Get All Exams
GET /api/exams/get-all
Headers: Authorization: Bearer <token>
Response: { data: [{ id, question, variantA, variantB, variantC, variantD, answer }, ...] }

# 2. Get Exam by ID
GET /api/exams/get-one/:id
Headers: Authorization: Bearer <token>
Response: { data: { id, question, variantA-D, answer, lessonModulId } }

# 3. Create Exam (Multiple Choice)
POST /api/exams/create
Headers: Authorization: Bearer <token>
Body: JSON { question, variantA, variantB, variantC, variantD, answer (A/B/C/D), lessonModulId }
Response: { data: { id, question, answer } }

# 4. Update Exam
PATCH /api/exams/update-one/:id
Headers: Authorization: Bearer <token>
Body: JSON { question?, variantA?, variantB?, variantC?, variantD?, answer? }
Response: { data: { id, question } }

# 5. Delete Exam
DELETE /api/exams/delete-one/:id
Headers: Authorization: Bearer <token>
Response: { message: "Exam deleted successfully" }
```

### Frontend Code - Quiz Component

```javascript
// quiz.component.js
function QuizComponent({ examId }) {
  const [exam, setExam] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    // Imtihonni olish
    fetch(`/api/exams/get-one/${examId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    }).then(r => r.json())
      .then(res => setExam(res.data));
  }, [examId]);

  const submitAnswer = () => {
    // Javob qayd qilish
    fetch('/api/exam-results/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        examId,
        userId: currentUser.id,
        selectedAnswer,
        isCorrect: selectedAnswer === exam.answer,
        score: selectedAnswer === exam.answer ? 100 : 0
      })
    }).then(r => r.json())
      .then(res => console.log('Natija qayd qilindi'));
  };

  if (!exam) return <div>Loading...</div>;

  return (
    <div>
      <h3>{exam.question}</h3>
      <div>
        {['A', 'B', 'C', 'D'].map(variant => (
          <label key={variant}>
            <input
              type="radio"
              name="answer"
              value={variant}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            {exam[`variant${variant}`]}
          </label>
        ))}
      </div>
      <button onClick={submitAnswer}>Javobni Yuborish</button>
    </div>
  );
}
```

---

## 💬 Savollar (Q&A Forum) (5 ta)

```bash
# 1. Get All Questions
GET /api/questions/get-all
Headers: Authorization: Bearer <token>
Response: { data: [{ id, title, courseId, views }, ...] }

# 2. Get Question by ID
GET /api/questions/get-one/:id
Headers: Authorization: Bearer <token>
Response: { data: { id, title, content, courseId, answers: [], views } }

# 3. Create Question
POST /api/questions/create
Headers: Authorization: Bearer <token>
Body: multipart/form-data { title, content, courseId, files[]? }
Response: { data: { id, title, views: 0 } }

# 4. Update Question
PATCH /api/questions/update-one/:id
Headers: Authorization: Bearer <token>
Body: JSON { title?, content? }
Response: { data: { id, title } }

# 5. Delete Question
DELETE /api/questions/delete-one/:id
Headers: Authorization: Bearer <token>
Response: { message: "Question deleted successfully" }
```

---

## 📢 Javoblar (Answers) (5 ta)

```bash
# 1. Get All Answers
GET /api/question-answers
Headers: Authorization: Bearer <token>
Response: { data: [{ id, content, questionId, userId }, ...] }

# 2. Get Answer by ID
GET /api/question-answers/:id
Headers: Authorization: Bearer <token>
Response: { data: { id, content, questionId, userId } }

# 3. Create Answer
POST /api/question-answers/create
Headers: Authorization: Bearer <token>
Body: multipart/form-data { content, questionId, userId, files[]? }
Response: { data: { id, content } }

# 4. Update Answer
PATCH /api/question-answers/:id
Headers: Authorization: Bearer <token>
Body: JSON { content? }
Response: { data: { id, content } }

# 5. Delete Answer
DELETE /api/question-answers/:id
Headers: Authorization: Bearer <token>
Response: { message: "Answer deleted successfully" }
```

---

## 🎯 Tez API Service Template

```javascript
// api.service.js
class ApiService {
  constructor(baseUrl = 'http://localhost:15975/api') {
    this.baseUrl = baseUrl;
  }

  getHeaders(isFormData = false) {
    const headers = {};
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }

    return await response.json();
  }

  // GET
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST (JSON)
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // POST (FormData)
  postFormData(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData
    });
  }

  // PATCH (JSON)
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // PATCH (FormData)
  patchFormData(endpoint, formData) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: formData
    });
  }

  // DELETE
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Ishlatish
const api = new ApiService();

// Login
const loginRes = await api.post('/auth/login', { email, password });

// Kurslarni olish
const courses = await api.get('/courses/getall');

// Yangi kurs yaratish (fayl bilan)
const formData = new FormData();
formData.append('name', 'My Course');
formData.append('banner', bannerFile);
const courseRes = await api.postFormData('/courses/create-one', formData);
```

---

## 🚀 Har Safar Tekshiring

### Server Ishlayaptimi?

```bash
# Terminal da
npm run start:dev

# Output ko'rishga:
# [Nest] 1234  - 07/19/2026, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
# ...
# [Nest] 1234  - 07/19/2026, 10:30:05 AM     LOG [InstanceLoader] Nest application successfully started
```

### Swagger UI ni Ko'rish

```bash
# Browser da
http://localhost:15975/api/swagger
```

### Token Tekshirish (devTools Console)

```javascript
// Browser Console da
localStorage.getItem('accessToken') // Token bor yoki yo'qligini ko'rish
localStorage.getItem('refreshToken')

// Token malumotini decode qilish
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload); // { id, email, role, iat, exp }
```

---

## 🆘 Common Errors

### 401 Unauthorized

```bash
Sabab: Token topilmadi yoki eskirgan
Yechim:
1. localStorage da token bor ekaniga qarang
2. Authorization header to'g'ri yozilgan
3. Token refresh qilishni sinang
```

### 403 Forbidden

```bash
Sabab: User rolida ruxsat yo'q
Yechim:
1. User rolesini tekshiring (ADMIN/MENTOR/STUDENT)
2. Endpoint uchun kerakli role borligini tekshiring
```

### 400 Bad Request

```bash
Sabab: So'rov tanasi noto'g'ri
Yechim:
1. DTO struktuarasini ALL_POINTS.uz.md dan ko'rish
2. Validation error xabarini o'qish
3. Field turlarini tekshirish
```

---

## 📚 Qo'shimcha Resurslar

- **Barcha Endpoints:** `./mds/uz/ALL_POINTS.uz.md`
- **Setup Qo'llanma:** `./mds/uz/README.uz.md`
- **Architecture:** `./.claude/architecture.md`
- **API Docs (Live):** `http://localhost:15975/api/swagger`

---

**Happy Coding! 🚀**
