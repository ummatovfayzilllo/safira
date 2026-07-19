Albatta! Quyida Prisma sxemangizdagi barcha model, enum va field'larning **o'zbek tilidagi izohi**ni yozib berdim. Har bir model real hayotdagi qanday ma'noni anglatishini ham tushuntiraman.

---

## ENUM'LAR — Tanlov uchun qiymatlar

### `Role`

Foydalanuvchining tizimdagi roli:

* `ADMIN` — Administrator
* `MENTOR` — O'qituvchi
* `ASSISTANT` — Yordamchi
* `STUDENT` — O'quvchi

### `Action`

Ruxsat berilgan amallar:

* CRUD (GET, POST, PUT, PATCH, DELETE)

### `CourseLevel`

Kurs darajasi:

* Boshlang'ichdan to Advancedgacha

### `PaidVia`

To'lov turi:

* `PAYME`, `CLICK`, `CASH`

### `HomeworkSubStatus`

Uy vazifasi holati:

* `PENDING` — Tekshirilmoqda
* `APPROVED` — Qabul qilindi
* `REJECTED` — Rad etildi

### `ExamAnswer`

Test varianti (A, B, C, D)

---

## MODELLAR — Ma'lumotlar bazasi jadvali

### `User`

Foydalanuvchi. Har kim tizimga kirganida shu model orqali ro'yxatdan o'tadi.

### `Permission`

Foydalanuvchining model va action'lar bo'yicha ruxsatlari.

### `MentorProfile`

O'qituvchining profili (faqat Mentorlar uchun). Bu joyda ish tajribasi, ijtimoiy tarmoqlar saqlanadi.

### `CourseCategory`

Kurslar kategoriyasi. Masalan: "Dasturlash", "Ingliz tili".

### `Course`

Bitta kurs haqida to‘liq ma’lumot: nomi, narxi, darajasi, mentor kim, qaysi kategoriyaga tegishli.

### `AssignedCourse`

O‘quvchiga tayinlangan kurslar.

### `PurcachedCourse`

O‘quvchining sotib olgan kurslari va to‘lov holati.

### `Rating`

Kurs uchun berilgan baho va izoh.

### `LastActivity`

Foydalanuvchining kursdagi so‘nggi faolligi (qaysi darsni ko‘rdi).

### `LessonModul`

Kurs ichidagi bo'lim yoki modul. Har bir modulda bir nechta dars bo'lishi mumkin.

### `Lesson`

Modul ichidagi bitta dars. Darsda video, matnli izoh, fayllar bo'lishi mumkin.

### `LessonView`

Foydalanuvchi darsni ko'rganmi yoki yo'qmi degan ma'lumot.

### `LessonFile`

Darsga biriktirilgan fayl (PDF, Word) yoki izoh.

### `Homework`

Darsga berilgan uy vazifasi.

### `HomeworkSubmission`

Foydalanuvchi tomonidan topshirilgan uy vazifasi (javobi, fayllari va holati bilan).

### `Exam`

Modulga oid test savoli (A, B, C, D variant bilan).

### `ExamResult`

Foydalanuvchining test natijasi.

### `Question`

Foydalanuvchi tomonidan kurs haqida berilgan savol.

### `QuestionAnswer`

Mentor yoki yordamchi tomonidan savolga berilgan javob.

---

Agar kerak bo‘lsa, har bir model uchun ER diagram (aloqalar sxemasi) yoki API uchun DTO'larni ham yaratib bera olaman.
