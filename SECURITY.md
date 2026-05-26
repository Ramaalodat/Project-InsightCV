# سياسة الأمان - InsightCV

## الإصدارات المدعومة

نحن ندعم حالياً الإصدارات التالية بتحديثات الأمان:

| الإصدار | مدعوم          |
| ------- | -------------- |
| 1.0.x   | ✅ مدعوم       |
| < 1.0   | ❌ غير مدعوم   |

## الإبلاغ عن ثغرة أمنية

نحن نأخذ الأمان على محمل الجد. إذا اكتشفت ثغرة أمنية، يرجى اتباع الخطوات التالية:

### 1. لا تنشر الثغرة علناً
لا تفتح Issue عام على GitHub للثغرات الأمنية.

### 2. أرسل تقريراً خاصاً
أرسل تفاصيل الثغرة إلى: security@insightcv.com (أو افتح Security Advisory على GitHub)

### 3. قدم معلومات مفصلة
يرجى تضمين:
- وصف الثغرة
- خطوات إعادة إنتاج المشكلة
- التأثير المحتمل
- أي حلول مقترحة

### 4. انتظر الرد
سنرد على تقريرك خلال 48 ساعة ونعمل على إصلاح المشكلة.

## ممارسات الأمان

### للمطورين

#### 1. المصادقة والتفويض
```php
// استخدم Hash لكلمات المرور
$user->password = Hash::make($password);

// تحقق من الصلاحيات
if ($user->role !== 'company') {
    return response()->json(['message' => 'Unauthorized'], 403);
}
```

#### 2. التحقق من المدخلات
```php
// استخدم Validator دائماً
$validator = Validator::make($request->all(), [
    'email' => 'required|email',
    'password' => 'required|min:6',
]);
```

#### 3. حماية من SQL Injection
```php
// استخدم Eloquent أو Query Builder
User::where('email', $email)->first(); // ✅ آمن

// تجنب Raw Queries
DB::select("SELECT * FROM users WHERE email = '$email'"); // ❌ غير آمن
```

#### 4. حماية من XSS
```javascript
// استخدم React (يحمي تلقائياً)
<div>{userInput}</div> // ✅ آمن

// تجنب dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{__html: userInput}} /> // ❌ خطر
```

#### 5. حماية من CSRF
```php
// Laravel يحمي تلقائياً
// تأكد من تضمين CSRF token في النماذج
```

#### 6. رفع الملفات بأمان
```php
// تحقق من نوع الملف
$validator = Validator::make($request->all(), [
    'file' => 'required|file|mimes:pdf,doc,docx|max:5120',
]);

// لا تثق بامتداد الملف فقط
$mimeType = $file->getMimeType();
```

#### 7. حماية المعلومات الحساسة
```php
// لا تُرجع كلمات المرور
protected $hidden = ['password', 'remember_token'];

// استخدم .env للمفاتيح السرية
$apiKey = env('API_KEY');
```

### للمستخدمين

#### 1. كلمات مرور قوية
- استخدم 8 أحرف على الأقل
- اجمع بين الأحرف والأرقام والرموز
- لا تستخدم كلمات مرور شائعة

#### 2. حماية الحساب
- لا تشارك كلمة المرور
- سجل الخروج من الأجهزة المشتركة
- غيّر كلمة المرور بانتظام

#### 3. الوعي بالتصيد الاحتيالي
- تحقق من عنوان URL
- لا تنقر على روابط مشبوهة
- لا تشارك معلومات حساسة عبر البريد

#### 4. تحديثات الأمان
- حدّث المتصفح بانتظام
- استخدم برنامج مكافحة فيروسات
- فعّل جدار الحماية

## الثغرات المعروفة

لا توجد ثغرات معروفة حالياً.

## سجل التحديثات الأمنية

### [1.0.0] - 2025-10-21
- إطلاق أول إصدار مع ميزات الأمان الأساسية
- تشفير كلمات المرور
- التحقق من المدخلات
- حماية من CSRF

## الشكر

نشكر جميع الباحثين الأمنيين الذين يساعدون في تحسين أمان InsightCV.

### Hall of Fame
(سيتم إضافة أسماء من يبلغون عن ثغرات هنا)

---

## موارد إضافية

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security Best Practices](https://laravel.com/docs/security)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## الاتصال

للأسئلة الأمنية: security@insightcv.com
للأسئلة العامة: support@insightcv.com
