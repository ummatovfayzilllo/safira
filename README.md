# 🎓 Imtihon - Educational Platform Backend

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

**Faollashuv belgisi:** Brauzer yoki REST client da `http://localhost:15975/api-docs` saytiga o'tib Swagger UI bilan ishlashni boshlang.

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

## 🔌 API ENDPOINTS

### 🔐 Authentication Endpoints

Base URL: `/api/auth`

#### 1. **Register (Ro'yxatdan O'tish)**

```http
POST /api/auth/register
Content-Type: application/json

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

**Tavsif:**
- Yangi user yaratib, verification codeini emailga yuboradi
- Code 5 minut amal qiladi
- Tadiqlashdan oldin user database ga qo'shilmaydi

---

#### 2. **Verify Code (Kodni Tasdiqlas)**

```http
POST /api/auth/verify
Content-Type: application/json

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

**Tavsif:**
- Emailga yuborilgan codeni tekshiradi
- Kod to'g'ri bo'lsa, user databasega qo'shiladi
- Access va Refresh tokenlarni qaytaradi
- Tokenlar cookie sifatida ham saqlanadi

---

#### 3. **Login (Kirish)**

```http
POST /api/auth/login
Content-Type: application/json

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

**Tavsif:**
- Mavjud user uchun login qiladi
- Email va password ni tekshiradi
- Access va Refresh tokenlarni qaytaradi
- Tokenlar cookie sifatida ham saqlanadi

**Xatalarga misol:**
```json
{
  "message": "Invalid email or password !"
}
```

---

### 👥 Users Endpoints

Base URL: `/api/users`

#### 1. **Create User (Yangi Foydalanuvchi Yaratish)**

```http
POST /api/users/create
Content-Type: multipart/form-data
Authorization: Bearer <access_token>

{
  "fullName": "Fayzillo Ummatov",
  "email": "fayzillo@example.com",
  "password": "securePassword123",
  "image": <binary_file>
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

**Tavsif:**
- Rasm fayli optional
- Password avtomatik bcrypt bilan hash qilinadi
- Default role: STUDENT

---

#### 2. **Get All Users (Barcha Foydalanuvchilarni Olish)**

```http
GET /api/users/get-all
Content-Type: application/json
Authorization: Bearer <access_token>
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
    },
    {
      "id": "user-uuid-2",
      "fullName": "Another User",
      "email": "another@example.com",
      "image": null,
      "role": "MENTOR",
      "createdAt": "2026-07-19T11:00:00Z",
      "updatedAt": "2026-07-19T11:00:00Z"
    }
  ]
}
```

**Tavsif:**
- Barcha usersni qaytaradi
- @Public() decorator bilan qo'shiladigan authentication kerak emas

---

#### 3. **Get User by ID (ID bilan Foydalanuvchini Olish)**

```http
GET /api/users/get-byid/:id
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Parametrlar:**
- `id` (path): Foydalanuvchi UUID si

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

#### 4. **Get My Profile (Mening Profilimni Olish)**

```http
GET /api/users/get-my
Content-Type: application/json
Authorization: Bearer <access_token>
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

**Tavsif:**
- @UserData() decoratordan foydalanib, JWT tokendan user IDni oladi
- Hozirgi foydalanuvchining profilini qaytaradi

---

#### 5. **Update User (Foydalanuvchini O'zgartirish)**

```http
PATCH /api/users/:id
Content-Type: multipart/form-data
Authorization: Bearer <access_token>

{
  "fullName": "Updated Name",
  "email": "newemail@example.com",
  "password": "newPassword123",
  "image": <binary_file> (optional)
}
```

**Parametrlar:**
- `id` (path): Foydalanuvchi UUID si

**Response (200):**
```json
{
  "message": "User updated successfully",
  "data": {
    "id": "user-uuid",
    "fullName": "Updated Name",
    "email": "newemail@example.com",
    "image": "https://res.cloudinary.com/... (yangi rasm)",
    "role": "STUDENT",
    "createdAt": "2026-07-19T10:30:00Z",
    "updatedAt": "2026-07-19T12:45:00Z"
  }
}
```

**Tavsif:**
- Barcha fieldlar optional
- Rasm yangilansa, eski rasm o'chiriladi
- Password hash bilan saqlanadi

---

#### 6. **Update User Image (Rasm Yangilash)**

```http
PATCH /api/users/updateimange/:id
Content-Type: multipart/form-data
Authorization: Bearer <access_token>

{
  "image": <binary_file>
}
```

**Parametrlar:**
- `id` (path): Foydalanuvchi UUID si

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

**Tavsif:**
- Faqat rasm yangilaydi
- Eski rasm Cloudinary dan o'chiriladi

---

#### 7. **Delete User (Foydalanuvchini O'chirish)**

```http
DELETE /api/users/:id
Authorization: Bearer <access_token>
```

**Parametrlar:**
- `id` (path): Foydalanuvchi UUID si

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Tavsif:**
- Foydalanuvchini database dan o'chirib tashlaydi
- Bog'langan hujjatlarning o'chish siyosati database trigger bilan boshqariladi

---

## 🔐 Authentication Details

### JWT Token Structures

**Access Token:**
- Expiration: 15 minutes (default)
- Scope: API endpoints ga kirish

**Refresh Token:**
- Expiration: 7 days (default)
- Scope: Yangi access token olish

### User Roles

```
- ADMIN        - Sistem administratori (barcha ruxsatlar)
- MENTOR       - Kurs yaratuvchi va oqituvchi
- ASSISTANT    - Asistent (kamomalama)
- STUDENT      - Talaba
```

### Header va Cookie Integration

API requests da:

```http
Authorization: Bearer <access_token>

# yoki

Cookie: accessToken=<access_token>; refreshToken=<refresh_token>
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

**Misol - Protected endpoint:**
```typescript
@Get('profile')
// JwtAuthGuard avtomatik faollashadi
getProfile(@UserData() user: JwtPayload) {
  return user; // JWT dan olingan user data
}
```

**Misol - Public endpoint:**
```typescript
@Public()
@Post('login')
// JwtAuthGuard bu route ni skip qiladi
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

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

**Misol - Role-restricted endpoint:**
```typescript
@UserRole(UserRoles.MENTOR, UserRoles.ADMIN)
@Post('create-course')
createCourse(@Body() createCourseDto: CreateCourseDto) {
  // Faqat MENTOR yoki ADMIN kirishi mumkin
  return this.coursesService.create(createCourseDto);
}
```

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

#### **@Permission(modelName) - Model Ruxsati**
```typescript
@Permission(ModelsEnumInPrisma.COURSES)
@Delete('courses/:id')
deleteCourse(@Param('id') id: string) {
  // Model-level ruxsatni tekshiradi
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

### 🔄 Authentication Flow (Amaliyot Ketma-ketligi)

```
┌─────────────────────────────────────────────────────────┐
│ 1. Client request yuboradi (Token bilan yoki bezi)      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │ JwtAuthGuard tekshiradi:      │
         │ • @Public() decorator bor?    │
         │ • Token topilgan mi?          │
         │ • Token tekis mi?             │
         └───────────┬───────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
  [Public] ✅        [Protected] Kirish bloklandi ❌
  Guard skip          if token error
        │
        ▼
  ┌──────────────────────────┐
  │ RoleAuthGuard tekshiradi │
  │ • @UserRole() decorator? │
  │ • User rolle mos?        │
  │ • ADMIN mi?              │
  └──────────┬───────────────┘
             │
   ┌─────────┴─────────┐
   │                   │
   ▼                   ▼
[Ruxsat]          [Rad]
 ✅                ❌
Request            403
proceed            Forbidden
   │
   ▼
[Controller] → [Service] → [Database]
   │
   ▼
Response (200, 201, etc.)
```

---

### 🔐 Security Best Practices

1. **Token Muhiflik:**
   - Token dan hech qachon logout bo'lmaydi (client side da reset qilish kerak)
   - Refresh token bilan yangi access token oling

2. **Role Management:**
   - ADMIN role eng yog'un role sifatida ishlatiladi
   - Har bir endpoint da explicit role tekshiring

3. **Public Routes:**
   - @Public() decorator faqat login, register, forgot password kabi endpoints da ishlatiladi
   - Boshqa barcha protected bo'lishi kerak

4. **Xatolar:**
   - 401: Authentication error (token yo'q yoki notiqni)
   - 403: Authorization error (ruxsat yo'q)

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

## 📝 API Documentation

### 🔗 Swagger UI
`http://localhost:15975/api/swagger`

### API Prefixi
Barcha endpoints `http://localhost:15975/api/` dan boshlanadi

**Swagger Konfigurasiyasi:**
- Title: "Online Courses Platform"
- Description: "Authentication & Verification API"
- Version: 1.0
- Bearer Token: Authentication header bilan

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

## 📧 Support & Issues

Xatolik yoki savollar bo'lsa, [GitHub Issues](https://github.com/yourusername/edfix-clone) ga yozib qo'ying.

---

## 📄 License

UNLICENSED

---

**Created by:** Fayzillo Ummatov  
**Last Updated:** July 2026
