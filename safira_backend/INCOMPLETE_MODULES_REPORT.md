# 📋 INCOMPLETE MODULES - DETAILED REPORT

## ❌ 5 ta Module INCOMPLETE (4 stub + 1 broken model)

---

## 🔴 GROUP 1: STUB IMPLEMENTATIONS (4 modules)

### 1️⃣ LESSON_VIEWS - Dars ko'rish tracking
- **Status**: Stub methods (return strings)
- **DTO**: ✅ Defined (userId, lessonId)
- **Service**: ❌ Missing (create, findAll, findOne, update, remove)
- **Priority**: HIGH (simple logic)
- **Fields**: userId, lessonId, view (boolean)

**Service methods needed**:
```typescript
async create(data: CreateLessonViewDto) - Prisma create
async findAll() - Prisma findMany
async findOne(id: number) - Prisma findFirst
async update(id: number, data: UpdateLessonViewDto) - Prisma update
async remove(id: number) - Prisma delete
```

---

### 2️⃣ LAST_ACTIVITY - Oxirgi faoliyat log'i
- **Status**: Stub methods + EMPTY DTO
- **DTO**: ❌ Empty file (needs creation)
- **Service**: ❌ Missing
- **Priority**: CRITICAL (DTO empty)
- **Fields**: userId, courseId, lessonModulId, lessonId, url

**What needs to be done**:
1. Create CreateLastActivityDto with fields
2. Create UpdateLastActivityDto
3. Implement service methods with Prisma

**DTO structure**:
```typescript
// create-last_activity.dto.ts
export class CreateLastActivityDto {
  @IsUUID() userId: string;
  @IsUUID() courseId: string;
  @IsUUID() lessonModulId: string;
  @IsUUID() lessonId: string;
  @IsString() @IsNotEmpty() url: string;
}
```

---

### 3️⃣ QUESTION_ANSWERS - Savollarga javob
- **Status**: Stub methods
- **DTO**: ✅ Defined (userId, questionId, text) but MISSING file field
- **Service**: ❌ Missing
- **Priority**: MEDIUM (needs file handling)
- **Fields**: userId, questionId, text, file (optional)

**DTO update needed**:
```typescript
// update create-question_answer.dto.ts to add file
export class CreateQuestionAnswerDto {
  @IsUUID() userId: string;
  @IsUUID() questionId: string;
  @IsString() @IsNotEmpty() text: string;
  @IsString() @IsOptional() file?: string;  // <-- ADD THIS
}
```

---

### 4️⃣ RATING - Kursni baholash
- **Status**: Stub methods
- **DTO**: ✅ Defined (userId, courseId, comment)
- **Service**: ❌ Missing
- **Priority**: HIGH (simple logic)
- **Fields**: userId, courseId, comment (optional)

---

## 🔴 GROUP 2: BROKEN MODEL (1 module)

### 5️⃣ CONTACT - Bog'lanish formasini yuborish
- **Status**: Service implemented BUT Prisma model NOT EXIST
- **Error**: `Property 'contact' does not exist on type 'PrismaService'`
- **DTO**: ✅ Defined
- **Service**: ✅ Implemented (but using non-existent model)
- **Priority**: CRITICAL (model missing from schema)

**Problem**: 
- Service calls `this.prisma.contact.*` methods
- But schema.prisma doesn't have `model Contact`
- Need to either:
  1. Add model Contact to schema.prisma
  2. OR remove contact module

**Proposed Contact model** (if needed):
```prisma
model Contact {
  id        Int       @id @default(autoincrement())
  phone     String    @required
  message   String    @required
  updatedAt DateTime  @default(now())
  createdAt DateTime  @default(now())
  
  @@map("contacts")
}
```

---

## 📊 IMPLEMENTATION CHECKLIST

### Stub Implementations (4 modules)

```
❌ lesson_views - Service CRUD
❌ last_activity - DTO + Service CRUD
❌ question_answers - DTO (add file) + Service CRUD
❌ rating - Service CRUD
```

### Broken Model (1 module)

```
❌ contact - Add model to schema.prisma (or remove module)
```

---

## 🎯 RECOMMENDED ORDER

### Phase 1: Critical (Do First)
1. **last_activity** - Create DTO + implement service
2. **contact** - Add model to schema or remove module

### Phase 2: High Priority
3. **lesson_views** - Simple CRUD implementation
4. **rating** - Simple CRUD implementation

### Phase 3: Medium Priority
5. **question_answers** - Update DTO + add file handling + service

---

## 📝 CODE TEMPLATES

### Lesson Views Service Template
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLessonViewDto } from './dto/create-lesson_view.dto';

@Injectable()
export class LessonViewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLessonViewDto) {
    return await this.prisma.lessonView.create({
      data: { ...data, view: true },
      include: {
        user: { select: { id: true, fullName: true } },
        lesson: { select: { id: true, name: true } },
      },
    });
  }

  async findAll() {
    return await this.prisma.lessonView.findMany({
      include: { user: true, lesson: true },
    });
  }

  async findOne(id: number) {
    const result = await this.prisma.lessonView.findUnique({
      where: { id },
      include: { user: true, lesson: true },
    });
    if (!result) throw new NotFoundException('LessonView not found');
    return result;
  }

  async update(id: number, data: UpdateLessonViewDto) {
    return await this.prisma.lessonView.update({
      where: { id },
      data,
      include: { user: true, lesson: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.lessonView.delete({ where: { id } });
  }
}
```

---

## ✅ VERIFICATION STEPS

After implementing:

1. Check TypeScript compilation:
   ```bash
   npm run build
   ```

2. Check for Prisma type errors:
   - Should not see "Property 'contact' does not exist"
   - Should not see "Property 'lessonView' does not exist" (after create)

3. Test endpoints:
   ```bash
   # Test lesson-views
   POST /api/lesson-views
   GET /api/lesson-views
   GET /api/lesson-views/:id
   
   # Test other modules similarly
   ```

---

## 📌 SUMMARY

| Module | Type | Issue | Fix |
|--------|------|-------|-----|
| lesson_views | Stub | No service logic | Implement CRUD |
| last_activity | Stub + DTO | DTO empty + no service | Create DTO + Implement CRUD |
| question_answers | Stub | No service logic | Update DTO + Implement CRUD |
| rating | Stub | No service logic | Implement CRUD |
| contact | Broken | Model not in schema | Add to schema OR remove |

**Total endpoints affected**: ~25+ endpoints across 5 modules
**Estimated implementation time**: 2-3 hours
**Difficulty**: Easy-Medium
