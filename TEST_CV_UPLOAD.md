# اختبار رفع CV - حل المشكلة

## المشكلة
"Failed to upload CV: Something went wrong"

## الحلول المحتملة

### 1. تأكد من تشغيل Backend
```bash
cd backend
php artisan serve
```

### 2. تأكد من وجود مجلدات التخزين
```bash
cd backend
php artisan storage:link
```

### 3. تحقق من صلاحيات المجلدات
المجلدات المطلوبة:
- `backend/storage/app/public/cvs` ✅ (تم إنشاؤه)
- `backend/public/storage` ✅ (موجود)

### 4. اختبار API مباشرة

استخدم Postman أو curl:

```bash
curl -X POST http://localhost:8000/api/cv/upload \
  -F "cv_file=@path/to/your/cv.pdf" \
  -F "job_title=Software Developer" \
  -F "user_id=1"
```

### 5. تحقق من حجم الملف
الحد الأقصى: 5MB (5120 KB)

### 6. تحقق من نوع الملف
الأنواع المسموحة: PDF, DOC, DOCX

### 7. تحقق من وجود المستخدم
تأكد من أن `user_id` موجود في قاعدة البيانات

### 8. تحقق من وجود Candidate Profile
```sql
SELECT * FROM candidates WHERE user_id = YOUR_USER_ID;
```

إذا لم يكن موجوداً:
```sql
INSERT INTO candidates (user_id, created_at, updated_at) 
VALUES (YOUR_USER_ID, NOW(), NOW());
```

## الخطوات للحل

### الخطوة 1: تحقق من الـ Console في المتصفح
افتح Developer Tools (F12) وانظر إلى:
- Console tab - للأخطاء JavaScript
- Network tab - لرؤية الـ API request/response

### الخطوة 2: تحقق من Laravel Logs
```bash
tail -f backend/storage/logs/laravel.log
```

### الخطوة 3: جرب رفع ملف صغير
جرب رفع ملف PDF صغير (أقل من 1MB) للتأكد

### الخطوة 4: تحقق من CORS
تأكد من أن `backend/config/cors.php` يسمح بـ `http://localhost:3000`

## الحل السريع

إذا كانت المشكلة في Candidate Profile:

```bash
cd backend
php artisan tinker
```

ثم:
```php
$user = User::find(YOUR_USER_ID);
if (!$user->candidate) {
    Candidate::create(['user_id' => $user->id]);
}
```

## التحقق النهائي

1. ✅ Backend يعمل على http://localhost:8000
2. ✅ Frontend يعمل على http://localhost:3000
3. ✅ مجلد cvs موجود
4. ✅ Storage link موجود
5. ⚠️ تحقق من Candidate Profile

## معلومات إضافية

### API Endpoint
```
POST /api/cv/upload
```

### Required Fields
- `cv_file` (file): PDF/DOC/DOCX, max 5MB
- `job_title` (string): Job title
- `user_id` (integer): User ID

### Response Success
```json
{
  "message": "CV uploaded and analyzed successfully",
  "cv": {
    "id": 1,
    "overall_score": 85,
    "strengths": [...],
    "weaknesses": [...],
    ...
  },
  "points_earned": 10
}
```

### Response Error
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error details"]
  }
}
```
