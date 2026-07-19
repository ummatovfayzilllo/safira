# Types Directory

Bu papka loyihada ishlatiladigan barcha **TypeScript types, interfaces, enums va type aliases** larni o'z ichiga oladi.

## Fayl Tuzilmasi

- **api.body.types.ts** - API request/response body type'lari
- **auth.types.ts** - Authentication bilan bog'liq type'lar
- **course.types.ts** - Kurs ma'lumotlari type'lari
- **cshig.map.types.ts** - Map'lanish type'lari
- **enum.types.ts** - Barcha enum'lar (EmailCodeEnum, CourseLevel, ExamAnswer, PaidVia va boshqalar)
- **filter.file.types.ts** - Fayl filtrlash uchun type'lar va ekstensiya massivlari
- **global.types.ts** - Global/umumiy type'lar (ModelsEnumInPrisma va boshqalar)
- **jwt.types.ts** - JWT token'lari bilan bog'liq type'lar (JwtPayload, jwtTokenType va boshqalar)
- **payments.types.ts** - To'lov sistemi type'lari
- **prisma.error_code.types.ts** - Prisma xatolariga doir type'lar
- **user.types.ts** - Foydalanuvchi bilan bog'liq type'lar (UserRoles va boshqalar)

## Foydalanish

```typescript
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { JwtPayload } from 'src/common/types/jwt.types';
import { EmailCodeEnum } from 'src/common/types/enum.types';
```

## Qoidalar

1. **Faqat type'lar** - Bu papkada faqat TypeScript type'lari, interface'lari va enum'lar bo'lishi kerak
2. **Funksiyalar emas** - Utility funksiyalar `utils` papkasiga o'tkazilsin
3. **Nomi** - Barcha fayl nomlari `.types.ts` bilan tugashi kerak
4. **Import path'i** - Har doim `src/common/types/...` dan import qiling

## Bog'liq Papkalar

- **utils/** - Utility funksiyalari va helper'lari
- **config/** - Konfiguratsiya qo'shilmalari
