# 🔧 دليل حل المشاكل - InsightCV

## ❌ المشكلة: "Failed to load profile"

### السبب:
المستخدم ليس لديه candidate أو company profile في قاعدة البيانات.

### ✅ الحل:

#### الحل 1: إعادة إنشاء الحساب (الأسهل)
1. سجل خروج
2. سجل حساب جديد
3. سيتم إنشاء الـ profile تلقائياً

#### الحل 2: إصلاح المستخدمين الحاليين (من Backend)

```bash
cd backend
php artisan tinker
```

ثم شغّل:

```php
// للمستخدمين من نوع candidate
$users = User::where('role', 'candidate')->whereDoesntHave('candidate')->get();
foreach ($users as $user) {
    Candidate::create(['user_id' => $user->id]);
}

// للمستخدمين من نوع company
$users = User::where('role', 'company')->whereDoesntHave('company')->get();
foreach ($users as $user) {
    Company::create(['user_id' => $user->id, 'name' => $user->name]);
}
```

#### الحل 3: إعادة تشغيل قاعدة البيانات (يحذف جميع البيانات)

```bash
cd backend
php artisan migrate:fresh
```

ثم سجل حسابات جديدة.

---

## ❌ المشكلة: CV Analysis لا يعمل

### الأسباب المحتملة:

1. **الملف كبير جداً (أكثر من 5MB)**
   - الحل: استخدم ملف أصغر

2. **نوع الملف غير مدعوم**
   - الحل: استخدم PDF أو DOCX فقط

3. **المستخدم غير مسجل دخول**
   - الحل: سجل دخول أولاً

### ✅ الحل:

```bash
# تأكد من أن storage link موجود
cd backend
php artisan storage:link

# تأكد من الصلاحيات
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

---

## ❌ المشكلة: لا تظهر في اقتراحات الشركات

### الشروط المطلوبة:

لكي تظهر في صفحة "Suggested Employees" للشركات، يجب:

1. ✅ **Job Title** - أدخل مسماك الوظيفي
2. ✅ **Bio/About** - اكتب نبذة عنك
3. ✅ **Skills** - أضف مهاراتك (على الأقل مهارة واحدة)
4. ✅ **CV Upload** - ارفع سيرتك الذاتية

### ✅ الحل:

1. اذهب إلى **Profile**
2. اضغط **Edit Profile**
3. املأ جميع الحقول المطلوبة
4. اضغط **Save Changes**
5. اذهب إلى **Upload CV** وارفع سيرتك الذاتية

---

## ❌ المشكلة: التقييمات لا تظهر في الصفحة الرئيسية

### السبب:
التقييمات تحتاج موافقة قبل الظهور (is_approved = false).

### ✅ الحل:

```bash
cd backend
php artisan tinker
```

```php
// الموافقة على جميع التقييمات
Rating::where('is_approved', false)->update(['is_approved' => true]);

// أو الموافقة على تقييم محدد
Rating::find(1)->update(['is_approved' => true]);
```

---

## ❌ المشكلة: الوظائف لا تظهر

### الأسباب:

1. **لم يتم نشر أي وظائف بعد**
   - الحل: اذهب إلى Post Job وانشر وظيفة

2. **الوظائف مغلقة (status = closed)**
   - الحل: غيّر الحالة إلى Active

### ✅ الحل:

```bash
php artisan tinker
```

```php
// عرض جميع الوظائف
Job::all();

// تفعيل جميع الوظائف
Job::where('status', 'closed')->update(['status' => 'active']);
```

---

## ❌ المشكلة: CORS Error

### الخطأ:
```
Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

### ✅ الحل:

1. **تأكد من ملف CORS:**
```bash
# تحقق من وجود الملف
cat backend/config/cors.php
```

2. **أعد تشغيل Laravel:**
```bash
cd backend
php artisan config:clear
php artisan serve
```

3. **تأكد من URL في Frontend:**
```javascript
// في frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api';
```

---

## ❌ المشكلة: الإحصائيات تظهر 0

### السبب:
لم تقم بأي نشاط بعد.

### ✅ الحل:

**للموظفين:**
1. ارفع CV → سيزيد cvs_analyzed
2. مارس مقابلة → سيزيد practice_sessions
3. قدم على وظيفة → سيزيد jobs_applied
4. النقاط تزيد تلقائياً مع كل نشاط

**للشركات:**
1. انشر وظيفة → سيزيد jobs_posted
2. المتقدمون يزيدون تلقائياً

---

## ❌ المشكلة: الصور لا تظهر

### السبب:
Storage link غير موجود.

### ✅ الحل:

```bash
cd backend
php artisan storage:link
```

إذا ظهر خطأ:
```bash
php artisan storage:link --force
```

---

## ❌ المشكلة: Database Error

### الخطأ:
```
SQLSTATE[HY000]: General error: 1 no such table
```

### ✅ الحل:

```bash
cd backend
php artisan migrate:fresh
```

**تحذير:** هذا سيحذف جميع البيانات!

---

## 🔍 كيفية التحقق من المشاكل

### 1. تحقق من Backend Logs

```bash
# في Windows
type backend\storage\logs\laravel.log

# أو افتح الملف مباشرة
notepad backend\storage\logs\laravel.log
```

### 2. تحقق من Browser Console

1. اضغط F12
2. اذهب إلى Console
3. شاهد الأخطاء

### 3. تحقق من Network Tab

1. اضغط F12
2. اذهب إلى Network
3. شاهد API requests
4. تحقق من الـ Response

---

## 🧪 اختبار API مباشرة

### استخدم Postman أو curl:

```bash
# Test login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"password\"}"

# Test profile
curl http://localhost:8000/api/profile/1

# Test jobs
curl http://localhost:8000/api/jobs
```

---

## 🔄 إعادة تشغيل كل شيء

إذا لم يعمل أي شيء:

```bash
# 1. أوقف جميع الخوادم (Ctrl+C)

# 2. Backend
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan serve

# 3. Frontend (في terminal جديد)
cd frontend
npm start
```

---

## 📝 Checklist للتحقق

- [ ] Backend يعمل على http://localhost:8000
- [ ] Frontend يعمل على http://localhost:3000
- [ ] قاعدة البيانات موجودة وتحتوي على جداول
- [ ] Storage link موجود
- [ ] CORS مضبوط
- [ ] المستخدم مسجل دخول
- [ ] المستخدم لديه candidate/company profile

---

## 🆘 الحل السريع لجميع المشاكل

```bash
# 1. أعد إنشاء قاعدة البيانات
cd backend
php artisan migrate:fresh

# 2. أنشئ storage link
php artisan storage:link

# 3. امسح الـ cache
php artisan config:clear
php artisan cache:clear

# 4. أعد تشغيل الخادم
php artisan serve

# 5. في Frontend - امسح localStorage
# افتح Browser Console (F12) واكتب:
localStorage.clear()

# 6. سجل حساب جديد
```

---

## 💡 نصائح

1. **دائماً تحقق من Console** - معظم الأخطاء تظهر هناك
2. **تحقق من Laravel Logs** - الأخطاء التفصيلية موجودة هناك
3. **استخدم Postman** - لاختبار API مباشرة
4. **امسح localStorage** - إذا كانت هناك مشاكل في الجلسة

---

**إذا استمرت المشكلة، أخبرني بالخطأ الظاهر في Console!** 🔍
