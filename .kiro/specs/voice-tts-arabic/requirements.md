# Requirements: Arabic Voice TTS for AI Interview

## Introduction
إضافة دعم الصوت العربي لـ Voice Mode في نظام المقابلات الذكية باستخدام Google Cloud Text-to-Speech API المجاني.

## Glossary
- **TTS**: Text-to-Speech - تحويل النص إلى صوت
- **Voice Mode**: وضع المقابلة الصوتية
- **Google Cloud TTS**: خدمة Google لتحويل النص إلى صوت
- **Free Tier**: الطبقة المجانية (1 مليون حرف/شهر)

## Requirements

### Requirement 1: Google Cloud TTS Integration

**User Story:** كمستخدم، أريد أن أسمع ردود الـ AI بصوت عربي طبيعي في Voice Mode

#### Acceptance Criteria

1. WHEN المستخدم يختار Voice Mode والـ AI يرد بالعربي، THE System SHALL تشغيل الصوت باستخدام Google Cloud TTS
2. WHEN الـ AI يرد بالإنجليزي، THE System SHALL استخدام Browser TTS كـ fallback
3. THE System SHALL دعم 1 مليون حرف مجاناً شهرياً من Google Cloud
4. IF Google Cloud TTS فشل، THEN THE System SHALL استخدام Browser TTS تلقائياً

### Requirement 2: API Key Management

**User Story:** كمطور، أريد إدارة مفاتيح API بشكل آمن

#### Acceptance Criteria

1. THE System SHALL تخزين Google Cloud API key في ملف .env
2. THE System SHALL عدم رفع المفاتيح على GitHub
3. THE System SHALL توفير ملف .env.example مع تعليمات واضحة
4. THE System SHALL التحقق من وجود المفتاح قبل الاستخدام

### Requirement 3: Voice Quality & Performance

**User Story:** كمستخدم، أريد صوت عربي واضح وطبيعي

#### Acceptance Criteria

1. THE System SHALL استخدام صوت عربي عالي الجودة (WaveNet)
2. THE System SHALL تشغيل الصوت خلال أقل من 2 ثانية
3. THE System SHALL دعم النصوص حتى 5000 حرف
4. THE System SHALL عرض حالة التحميل أثناء توليد الصوت

### Requirement 4: Fallback Strategy

**User Story:** كمستخدم، أريد النظام يشتغل حتى لو Google Cloud فشل

#### Acceptance Criteria

1. THE System SHALL محاولة Google Cloud TTS أولاً
2. IF Google Cloud فشل، THEN THE System SHALL استخدام Browser TTS
3. THE System SHALL عرض رسالة واضحة في Console عن الـ TTS المستخدم
4. THE System SHALL الاستمرار في المقابلة بدون توقف

### Requirement 5: User Experience

**User Story:** كمستخدم، أريد تجربة سلسة بدون تعقيدات

#### Acceptance Criteria

1. THE System SHALL تشغيل الصوت تلقائياً بعد رد الـ AI
2. THE System SHALL عرض مؤشر "AI Speaking..." أثناء التشغيل
3. THE System SHALL إيقاف الصوت عند الضغط على زر التسجيل
4. THE System SHALL بدء الاستماع تلقائياً بعد انتهاء الصوت
