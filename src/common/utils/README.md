# Utils Directory

Bu papka loyihada ishlatiladigan barcha **helper funksiyalar, utility'lar va service'lar** ni o'z ichiga oladi.

## Fayl Tuzilmasi

- **check.functions.ts** - Database ma'lumotlarini tekshirish funksiyalari
  - `checAlreadykExistsResurs()` - Resurs allaqachon mavjudligini tekshirish
  - `checkExistsResurs()` - Resurs mavjudligini tekshirish

- **file.helpers.ts** - Fayl operatsiyalarining ko'magi funksiyalari
  - `unlinkFile()` - Faylni o'chirish

- **file.storage.ts** - Multer file storage konfiguratsiyasi
  - `fileStorages()` - Disk storage bilan fayl yuklamasi
  - `courseFileFields` - Kurs fayllarining konfiguratsiyasi

- **generators.ts** - Ma'lumot yaratish funksiyalari
  - `urlGenerator()` - Fayl URL'sini yaratish
  - `messageGenerator()` - Email xabar yaratish
  - `getPathInFileType()` - Fayl turi bo'yicha yo'l topish
  - `headerDataStream()` - Streaming fayllar uchun header o'rnatish

- **jwt.helper.ts** - JWT token'lari bilan ishlash funksiyalari
  - `getJwtOptions()` - JWT parametrlarini olish
  - `getToken()` - Token yaratish
  - `decodeToken()` - Token dekodlash

- **user.validation.ts** - Foydalanuvchi validatsiyasi funksiyalari

## Foydalanish

```typescript
import { checkExistsResurs } from 'src/common/utils/check.functions';
import { unlinkFile } from 'src/common/utils/file.helpers';
import { fileStorages } from 'src/common/utils/file.storage';
import { urlGenerator } from 'src/common/utils/generators';
import { getToken } from 'src/common/utils/jwt.helper';
```

## Qoidalar

1. **Faqat funksiyalar** - Bu papkada faqat utility funksiyalari bo'lishi kerak
2. **Type'lar types papkasida** - Type'lar va interface'lar `types` papkasiga o'tkazilsin
3. **Nomi** - Fayl nomlari functionality bo'yicha berilsin:
   - `.functions.ts` - Asosiy funksiyalar uchun
   - `.helper.ts` - Yordamchi funksiyalar uchun
   - `.storage.ts` - Storage konfiguratsiyasi uchun
4. **Import path'i** - Har doim `src/common/utils/...` dan import qiling

## Bog'liq Papkalar

- **types/** - TypeScript type'lari va interface'lari
- **config/** - Konfiguratsiya qo'shilmalari
