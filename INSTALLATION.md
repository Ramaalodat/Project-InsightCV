# دليل التثبيت السريع - InsightCV

## المتطلبات الأساسية

### Backend (Laravel)
- PHP >= 8.2
- Composer
- SQLite (مثبت افتراضياً مع PHP)

### Frontend (React)
- Node.js >= 16
- npm أو yarn

## خطوات التثبيت

### 1. تثبيت Backend

```bash
cd backend

# تثبيت التبعيات
composer install

# نسخ ملف البيئة
copy .env.example .env

# توليد مفتاح التطبيق
php artisan key:generate

# إنشاء قاعدة البيانات
type nul > database/database.sqlite

# تشغيل الـ Migrations
php artisan migrate

# إنشاء مجلد التخزين
php artisan storage:link

# تشغيل السيرفر
php artisan serve
```

السيرفر سيعمل على: `http://localhost:8000`

### 2. تثبيت Frontend

```bash
cd frontend

# تثبيت التبعيات
npm install

# نسخ ملف البيئة
copy .env.example .env

# تشغيل السيرفر
npm start
```

التطبيق سيعمل على: `http://localhost:3000`

## إعداد API Keys (اختياري)

لتفعيل ميزات الذكاء الاصطناعي المتقدمة، قم بإضافة المفاتيح التالية في `frontend/.env`:

### 1. Gemini API (الأفضل للعربية)
- احصل على المفتاح من: https://aistudio.google.com/app/apikey
- مجاني: 60 طلب/دقيقة
- لا يتطلب بطاقة ائتمان

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Groq API (سريع جداً)
- احصل على المفتاح من: https://console.groq.com
- مجاني تماماً

```env
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

### 3. Google Cloud TTS (للصوت العربي)
- احصل على المفتاح من: https://console.cloud.google.com
- مجاني: 1 مليون حرف/شهر
- فعّل Text-to-Speech API أولاً

```env
REACT_APP_GOOGLE_TTS_KEY=your_google_tts_key_here
```

## التحقق من التثبيت

1. افتح المتصفح على `http://localhost:3000`
2. سجل حساب جديد
3. جرب رفع السيرة الذاتية
4. جرب المقابلة الذكية

## حل المشاكل الشائعة

### مشكلة: Backend لا يعمل
```bash
# تأكد من تثبيت PHP
php -v

# تأكد من تثبيت Composer
composer -V

# امسح الـ cache
php artisan config:clear
php artisan cache:clear
```

### مشكلة: Frontend لا يعمل
```bash
# تأكد من تثبيت Node.js
node -v

# امسح node_modules وأعد التثبيت
rmdir /s /q node_modules
npm install
```

### مشكلة: CORS Errors
تأكد من أن Backend يعمل على `http://localhost:8000` والـ Frontend على `http://localhost:3000`

## الميزات المتاحة بدون API Keys

- تسجيل الدخول والتسجيل
- رفع وتحليل السيرة الذاتية (تحليل أساسي)
- المقابلة الذكية (أسئلة محددة مسبقاً)
- البحث عن الوظائف
- إدارة الملف الشخصي
- نظام النقاط والتقييمات

## الميزات المتاحة مع API Keys

- تحليل متقدم للسيرة الذاتية بالذكاء الاصطناعي
- أسئلة مقابلة ديناميكية ومخصصة
- دعم اللغة العربية الكامل
- تحويل النص إلى صوت عربي
- تحليل الإجابات بالذكاء الاصطناعي

## الدعم

للمزيد من المعلومات، راجع:
- [README.md](README.md) - نظرة عامة على المشروع
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - دليل التكامل التفصيلي
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - حل المشاكل الشائعة
