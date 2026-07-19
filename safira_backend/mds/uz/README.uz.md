# 🎓 Imtihon - O'quv Platformasi Backend

![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=flat-square)
![License](https://img.shields.io/badge/License-UNLICENSED-black?style=flat-square)

## 📋 Loyiha Haqida

**Imtihon** - bu o'quv tizimini boshqarish uchun mo'ljallangan zamonaviy backend platforma. NestJS framework, TypeScript, PostgreSQL va Prisma ORM bilan qurilgan.

### 🎯 Asosiy Xususiyatlari

- 👥 Foydalanuvchi autentifikatsiyasi va ro'yxatdan o'tish (JWT)
- 📚 Kurs menejment (yaratish, o'zgartirish, o'chirish)
- 📖 Dars va modullar tashkili
- 📝 Uyga vazifa (Homework) tizimi
- ✅ Imtihonlar va natijalar
- ❓ O'quvchi Q&A forumi
- 📊 Baholash va sharhlar
- 💳 To'lovni boshqarish (PayMe, CLICK, CASH)
- 🎥 Video va fayl yuklash (Cloudinary)
- 📧 Email xabarnomalar

---

## 🚀 O'rnatish va Ishga Tushirish

### 📦 Talablar

- **Node.js** 18.0+ versiyasi
- **PostgreSQL** 12.0+ versiyasi
- **npm** yoki **yarn** paket menejer

### 1️⃣ Proyektni Klonlash va Bog'liqliklarni O'rnatish

```bash
# Proyektni klonlash (agar git orqali bo'lsa)
git clone <repository-url>
cd edfix_clone

# Bog'liqliklarni o'rnatish
npm install
```

### 2️⃣ .env Fayilni Tayyorlash

`.env.example` faylini `.env` ga nusxala qilib tayyorlab oling:

```bash
cp .env.example .env
```

**Zarur o'zgaruvchilar:**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/imtihon_db

# Server
PORT=15975
APP_BASE_URL=http://localhost:15975

# JWT
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Cloudinary (File Storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@imtihon.uz
```

### 3️⃣ Database Migraciyalarini Ishga Tushirish

```bash
# Prisma migraciyalarini o'tkazish
npx prisma migrate deploy

# (Optional) Database seed qilish
npx prisma db seed
```

### 4️⃣ Applicationni Ishga Tushirish

```bash
# Development rejimida
npm run start:dev

# Production rejimida
npm run build
npm run start:prod

# Debug rejimida
npm run start:debug
```

**Faollashuv belgisi:** Brauzer yoki REST client da `http://localhost:15975/api/swagger` saytiga o'tib Swagger UI bilan ishlashni boshlang.

---

## 📚 Loyiha Strukturasi

```
src/
├── common/                    # Umumiy utilities va konfiguratsiyalar
│   ├── config/               # App konfiguratsiyasi
│   ├── interfaces/           # Interfacelar
│   ├── types/                # TypeScript turlari
│   └── utils/                # Yordamchi funksiyalar va generatorlar
│
├── core/                      # Asosiy servislari
│   ├── admin/                # Admin role va ruxsatlar
│   ├── auth/                 # Autentifikatsiya (login, register)
│   ├── email/                # Email xabarnomalar
│   ├── jwt/                  # JWT token menejment
│   ├── prisma/               # Prisma database kliyenti
│   └── services/             # Shared servislari (file, streaming)
│
├── global/                    # Global middleware va decoratorlar
│   ├── decorators/           # @Public, @UserData va h.k.
│   ├── guards/               # JWT Authentication guardlari
│   └── middlewares/          # Express middlewares
│
└── modules/                   # Feature modullar
    ├── users/                # User menejment
    ├── courses/              # Kurs menejment
    ├── lessons/              # Dars kontenti
    ├── homeworks/            # Uyga vazifalar
    ├── exams/                # Imtihonlar
    ├── questions/            # Q&A forumi
    └── [16+ boshqa modullar...]
```

---

## 🔌 Frontend uchun API Integratsiyasi

### API Base URL

```javascript
const API_BASE = 'http://localhost:15975/api';
```

### Token Saqlash va O'tkazish

```javascript
// Tokenlarni localStorage da saqlash
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);

// So'rovga token qo'shish
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
  'Content-Type': 'application/json'
};
```

### Fetch Helper Funksiyasi

```javascript
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  const token = localStorage.getItem('accessToken');
  if (token && !options.public) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
};

// Ishlatish
const courses = await apiCall('/courses/getall');
```

---

## 🔐 Autentifikatsiya (Frontend)

### Login Flow

```javascript
// 1. Login
const loginResponse = await apiCall('/auth/login', {
  method: 'POST',
  public: true,
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// 2. Tokenlarni saqlash
localStorage.setItem('accessToken', loginResponse.accessToken);
localStorage.setItem('refreshToken', loginResponse.refreshToken);

// 3. Redirect dashboard ga
window.location.href = '/dashboard';
```

### Register va Verification Flow

```javascript
// 1. Ro'yxatdan o'tish
const registerResponse = await apiCall('/auth/register', {
  method: 'POST',
  public: true,
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

// 2. Code kiriting sahifasiga o'tish
// registerResponse.data.code - test uchun
// registerResponse.data.time - timeout (minut)

// 3. Kodni tasdiqlash
const verifyResponse = await apiCall('/auth/verify', {
  method: 'POST',
  public: true,
  body: JSON.stringify({
    email: 'john@example.com',
    code: 123456 // Foydalanuvchi kiritgan kod
  })
});

// 4. Tokenlarni saqlash va redirect
localStorage.setItem('accessToken', verifyResponse.accessToken);
localStorage.setItem('refreshToken', verifyResponse.refreshToken);
window.location.href = '/dashboard';
```

---

## 🛡️ Global Guards va Authentication Qoidalari

### 1️⃣ JwtAuthGuard (JWT Autentifikatsiya Shifringini)

**Maqsadi:** Har bir requestda JWT tokenni tekshiradi

**Qaidalar:**
- Barcha endpoints default sifatida protected (JWT token kerak)
- Authorization headeri yoki cookie dan tokenni qidiradi
- `@Public()` decorator bilan belgilangan routelarda guard ishlamaydi

**Token pozitsiyalari (amaliyot tartibida):**
1. Authorization header: `Bearer <token>`
2. Cookie: `accessToken=<token>`
3. Topilmasa: `UnauthorizedException` - "Token not found in header or cookie!"

**Xatolar:**
- ❌ Token topilmadi: `401 Unauthorized - Token not found in header or cookie!`
- ❌ Token notiqni: `401 Unauthorized - Invalid token or expired token!`
- ❌ Token eskirgan: `401 Unauthorized - Invalid token or expired token!`

---

### 2️⃣ RoleAuthGuard (Role-based Ruxsatlar)

**Maqsadi:** Foydalanuvchi rolini tekshiradi

**Qaidalar:**
- `@UserRole(...)` decorator bilan belgilangan endpoints uchun faol
- ADMIN roli barcha rollardan ustun (har qanday role-based endpoint ga kirishi mumkin)
- Boshqa rolelni faqat o'z rolesiga mos endpoints da kirishi mumkin
- `@Public()` decorator bilan belgilangan routelarda RoleAuthGuard ishlamaydi

**Xatolar:**
- ❌ Foydalanuvchi roli aniqlanmadi: `403 Forbidden - Foydalanuvchi roli aniqlanmadi`
- ❌ Huqoq yo'q: `403 Forbidden - Sizda ushbu sahifaga kirish huquqi yo'q`

---

### 3️⃣ Custom Decorators

#### **@Public() - Himoyasiz Route**
```typescript
@Public()
@Post('auth/register')
register(@Body() registerDto: CreateAuthDto) {
  // JwtAuthGuard va RoleAuthGuard ishlamaydi
}
```

#### **@UserRole(...roles) - Role Tahdidi**
```typescript
@UserRole(UserRoles.STUDENT, UserRoles.MENTOR)
@Get('my-courses')
getMyCourses() {
  // Faqat STUDENT va MENTOR rolelari kirishi mumkin
}
```

#### **@UserData() - User Malumotlari**
```typescript
@Get('profile')
getMyProfile(@UserData() user: JwtPayload) {
  // JWT tokendan user ma'lumotlarini oladi
  console.log(user.id, user.email, user.role);
}
```

---

## 🎯 User Rolelari

```
- ADMIN        - Sistem administratori (barcha ruxsatlar)
- MENTOR       - Kurs yaratuvchi va oqituvchi
- ASSISTANT    - Asistent (kamomalama)
- STUDENT      - Talaba
```

---

## 📝 API ENDPOINTS

### 🔐 Autentifikatsiya (3 ta)

| Metodi | URL | Tavsif |
|--------|-----|--------|
| POST | `/auth/register` | Ro'yxatdan o'tish |
| POST | `/auth/verify` | Kodni tasdiqlas |
| POST | `/auth/login` | Login qilish |

### 👥 Foydalanuvchilar (7 ta)

| Metodi | URL | Tavsif |
|--------|-----|--------|
| POST | `/users/create` | Yangi user yaratish |
| GET | `/users/get-all` | Barcha usersni olish |
| GET | `/users/get-byid/:id` | ID orqali user olish |
| GET | `/users/get-my` | Mening profilim |
| PATCH | `/users/:id` | Userni o'zgartirish |
| PATCH | `/users/updateimange/:id` | Rasmni yangilash |
| DELETE | `/users/:id` | Userni o'chirish |

### 📚 Kurslar (4 ta)

| Metodi | URL | Tavsif |
|--------|-----|--------|
| POST | `/courses/create-one` | Yangi kurs yaratish |
| GET | `/courses/getall` | Barcha kurslarni olish |
| GET | `/courses/get-one/:id` | ID orqali kursni olish |
| PATCH | `/courses/update-one/:id` | Kursni o'zgartirish |
| DELETE | `/courses/delte-one/:id` | Kursni o'chirish |

### Boshqa Modullar (har birida CRUD + variants)

- **Darslar** - `/lessons`
- **Dars Modullar** - `/lesson-modules`
- **Dars Fayllari** - `/lesson-files`
- **Kurs Kategoriyalari** - `/course-categories`
- **Uyga Vazifalar** - `/homeworks`
- **Uyga Vazifa Taqdimotlari** - `/homework-submissions`
- **Imtihonlar** - `/exams`
- **Imtihon Natijalar** - `/exam-results`
- **Savollar** - `/questions`
- **Javoblar** - `/question-answers`
- **Tayin Qilingan Kurslar** - `/assigned-courses`
- **Sotib Olingan Kurslar** - `/purcached-courses`
- **Mentor Profillari** - `/mentor-profiles`
- **Baholash** - `/rating`
- **Oxirgi Faoliyat** - `/last-activity`
- **Aloqa** - `/contact`

---

## 🔍 Validation va Data Processing

### Global Validation Pipe

Barcha request bodylari avtomatik tekshiriladi:

**Qoidalari:**
- ✅ `whitelist: true` - Faqat DTO da belgilangan fieldlar qabul qilinadi
- ✅ `forbidNonWhitelisted: true` - Noaniq fieldlar bilan request rad qilinadi
- ✅ `transform: true` - Data turlari avtomatik o'zgartiriladi

**Misol - Validation Error:**
```json
{
  "message": [
    "email must be an email",
    "password must be a string",
    "unknownField should not exist"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 🛠️ Development Commands

```bash
# Watch mode da development
npm run start:dev

# Production build
npm run build

# Production start
npm run start:prod

# Debug mode
npm run start:debug

# Linting
npm run lint

# Code formatting
npm run format

# Tests
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
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

## 📊 Database Schema

Key models:

- **User** - Foydalanuvchilar (email, password, role, image)
- **Course** - Kurslar (title, description, price, mentor)
- **Lesson** - Darslar (title, video, course)
- **Homework** - Uyga vazifalar (title, description, deadline)
- **Exam** - Imtihonlar (questions, multiple choice)
- **Question** - Q&A (title, content, user)
- **PurchasedCourse** - To'lov (course, user, payment method)

**Database connection:** `.env` da `DATABASE_URL` orqali

---

## 📱 Frontend State Management

### Context API bilan User State

```javascript
// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Mening profiliamni olish
      apiCall('/users/get-my')
        .then(res => setUser(res.data))
        .catch(err => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables (.env) to'g'ri o'rnatilgan
- [ ] Database migratsiyalari o'tkazilgan
- [ ] Cloudinary credentials saqlanagan
- [ ] Email service konfiguratsiyasi
- [ ] JWT secrets kuchli va xavfsiz
- [ ] CORS aytanyarasi to'g'ri
- [ ] Logs saqlanish tizimi

### Deploy qilish (misol):

```bash
# Build
npm run build

# Start
npm run start:prod
```

---

## 📧 Support & Issues

Xatolik yoki savollar bo'lsa, loyiha o'zgarishlariga qarab o'z CLI da tekshirib qo'ying.

---

## 📄 License

UNLICENSED

---

**Yaratdi:** Fayzillo Ummatov  
**Oxirgi Yangilash:** Iyul 2026

---

## 🎯 Tez Havola

**API Documentation:** `./mds/uz/ALL_POINTS.uz.md`  
**Architecture:** `./.claude/architecture.md`  
**Swagger UI:** `http://localhost:15975/api/swagger`
