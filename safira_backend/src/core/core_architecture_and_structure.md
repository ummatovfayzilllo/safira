# Core Module Architecture va Struktura

## Umumiy Tavsif

`Core` modul NestJS ilovasining asosiy va umumiy funksiyalarni o'z ichiga oladi. Bu modul autentifikatsiya, emailga jo'natish, fayl stream'lanishi, prisma ORM, JWT, admin va boshqa kritik xizmatlarni taqdim etadi.

## Modul Tuzilmasi

```
src/core/
├── admin/                          # Admin va ruxsatni boshqarish
│   ├── admin.module.ts
│   ├── admin.service.ts
│   ├── admin.controller.ts
│   ├── dto/
│   │   ├── create-admin.dto.ts
│   │   ├── create-permission.dto.ts
│   │   └── update-permission.ts
│   ├── entities/
│   │   └── admin.entity.ts
│   ├── permission/
│   │   └── permission.service.ts
│   └── role/
│       └── role.service.ts
├── auth/                           # Autentifikatsiya
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── cache.service.ts
│   ├── dto/
│   │   ├── create-auth.dto.ts
│   │   └── login.dto.ts
│   └── entities/
│       └── auth.entity.ts
├── email/                          # Email xizmati
│   ├── email.module.ts
│   └── email.service.ts
├── jwt/                            # JWT tokenlar
│   ├── jwt.module.ts
│   └── jwt.service.ts
├── prisma/                         # Prisma ORM
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── services/                       # Qo'shimcha xizmatlar
│   ├── file.stream.controller.ts
│   └── file.stream.service.ts
├── error/                          # Xato filtrlari
│   └── validation.filter.ts
├── core.module.ts                  # Core modul
├── use_initilation.ts              # Global ilovani ishga tushirish
└── memory.manitoring_functions.ts  # Memory monitoring
```

## Modullar bo'yicha Tavsif

### 1. Admin Module (`admin/`)
- **Maqsad**: Foydalanuvchilarning admin roli va ruxsatlarini boshqarish
- **Xizmatlar**:
  - `AdminService` - Admin operatsiyalari
  - `PermissionService` - Ruxsatlar boshqarish
  - `RoleService` - Rollar boshqarish
- **Import qilgan Types**:
  - `UserRoles` from `src/common/types/user.types`
  - `ModelsEnumInPrisma` from `src/common/types/global.types`

### 2. Auth Module (`auth/`)
- **Maqsad**: Foydalanuvchi autentifikatsiyasi va ro'yxatdan o'tish
- **Xizmatlar**:
  - `AuthService` - Autentifikatsiya logikasi
  - `CacheService` - Kesh saqlash (OTP kodi va vaqtinchalik ma'lumotlar)
- **Import qilgan Types va Utilities**:
  - `EmailCodeEnum` from `src/common/types/enum.types`
  - `checAlreadykExistsResurs` from `src/common/utils/check.functions`
  - `ModelsEnumInPrisma` from `src/common/types/global.types`

### 3. Email Module (`email/`)
- **Maqsad**: Email jo'natish xizmati (Nodemailer orqali)
- **Xizmatlar**:
  - `EmailService` - Email jo'natish
- **Import qilgan Types va Utilities**:
  - `EmailCodeEnum` from `src/common/types/enum.types`
  - `messageGenerator` from `src/common/utils/generators`

### 4. JWT Module (`jwt/`)
- **Maqsad**: JWT token yaratish va tekshirish
- **Xizmatlar**:
  - `JwtSubService` - JWT operatsiyalari
- **Import qilgan Types**:
  - `jwtTokenType`, `jwtTokenTypeEnum`, `JwtPayload` from `src/common/types/jwt.types`

### 5. Prisma Module (`prisma/`)
- **Maqsad**: Database ulanishi va ORM
- **Xizmatlar**:
  - `PrismaService` - Prisma database operatsiyalari
- **Import qilgan Types**:
  - `ModelsEnumInPrisma` from `src/common/types/global.types`

### 6. File Stream Services (`services/`)
- **Maqsad**: Fayllarda streaming orqali foydalanuvchilarga uzatish
- **Controller**: `FileStreamerController` - Video/fayl stream'lash
- **Service**: `FileStreamService` - Stream logikasi
- **Import qilgan Utilities**:
  - `getPathInFileType`, `headerDataStream` from `src/common/utils/generators`

### 7. Error Handling (`error/`)
- **Maqsad**: Xatolarni boshqarish va filtrlash
- **Filters**: `MulterValidationExceptionFilter` - Fayl yuklamasi xatolari

### 8. Global Initialization (`use_initilation.ts`)
- **Maqsad**: Barcha global middleware, pipe va filter'larni o'rnatish
- **Konfiguratsiya**:
  - Swagger API dokumentatsiyasi
  - Cookie parser
  - Device middleware
  - CORS konfiguratsiyasi
  - Global validation pipe

### 9. Memory Monitoring (`memory.manitoring_functions.ts`)
- **Maqsad**: Deploy qo'lingandan keyin memory va resource monitoringi
- **Funksiyalar**:
  - `checkMemoryAfterDeploy()` - Asosiy tahlil
  - `showAppMemoryUsage()` - Ilovaning xotira sarfi
  - `showSystemMemoryOverview()` - Tizim xotirasi
  - `showTop10RamConsumers()` - En ko'p xotira ishlatuvchilar
  - `showContainerInfo()` - Docker konteyner ma'lumotlari
  - `setupMemoryAlert()` - Xotira ogohlantiruvi

## Bog'liq Papkalar

- **types/** (`src/common/types/`) - Type'lar va enum'lar
- **utils/** (`src/common/utils/`) - Helper funksiyalar
- **modules/** (`src/modules/`) - Business logika modullar

## Import Namunalari

```typescript
// Types import'i
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { EmailCodeEnum } from 'src/common/types/enum.types';
import { JwtPayload } from 'src/common/types/jwt.types';
import { UserRoles } from 'src/common/types/user.types';

// Utils import'i
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { messageGenerator } from 'src/common/utils/generators';
import { unlinkFile } from 'src/common/utils/file.helpers';
import { fileStorages } from 'src/common/utils/file.storage';
```

## Xizmatlar Orasidagi Bog'lanishlar

```
Auth Module
├── -> Email Service (OTP jo'natish)
├── -> JWT Service (Token yaratish)
├── -> Cache Service (OTP saqlash)
└── -> Users Service (Foydalanuvchi tekshirish)

Core Module (main)
├── -> Admin Module
├── -> Auth Module
├── -> Email Module
├── -> JWT Module
├── -> Prisma Module
└── -> File Stream Services
```

## Key Patterns

1. **DTO (Data Transfer Object)** - Request/Response validatsiyasi uchun
2. **Entity** - Database modeli
3. **Service** - Business logika
4. **Controller** - API endpoint'lari
5. **Module** - Xizmatlar birlashmasi

## Qoidalar va Best Practices

1. ✅ Barcha type'lar `src/common/types/` dan import qilinsin
2. ✅ Barcha utility funksiyalar `src/common/utils/` dan import qilinsin
3. ✅ Core modulida faqat framework va global xizmatlari bo'lsin
4. ✅ Business logika modules papkasida bo'lsin
5. ❌ Core fayllar boshqa core fayllarning ichki detaillari bilan bog'lanmasin
6. ❌ Circular dependency'lar paydo bo'lmasin
