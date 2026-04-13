# صالون الحلاقة — نظام حجز كامل

موقع عربي (RTL) لحجز مواعيد الحلاقة مع لوحة تحكم للإدارة، قاعدة بيانات [Supabase](https://supabase.com/)، وجاهز للنشر على [Vercel](https://vercel.com/).

## المتطلبات

- Node.js 20+
- حساب Supabase (الطبقة المجانية كافية)

## أ) إنشاء مشروع Supabase

1. ادخل إلى [https://supabase.com/dashboard](https://supabase.com/dashboard) وأنشئ مشروعًا جديدًا.
2. انتظر حتى يكتمل تهيئة قاعدة البيانات.
3. من **Project Settings → API** انسخ:
   - **Project URL** → يُستخدم كـ `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → يُستخدم كـ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ب) لصق المفاتيح محليًا

1. انسخ الملف `.env.example` إلى `.env.local`.
2. الصق القيم الحقيقية من لوحة Supabase.
3. أضف رقم واتساب النشاط بصيغة مصرية مع كود الدولة **بدون علامة +**، مثال: `201234567890` → `NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE=201234567890`.

## ج) تشغيل SQL (الجداول + الحماية)

1. في Supabase: **SQL Editor → New query**.
2. افتح من المشروع الملف `supabase/schema.sql`، انسخه كاملًا والصقه في المحرر، ثم **Run**.
3. افتح `supabase/seed.sql`، انسخه والصقه، ثم **Run** (يضيف 3 حلاقين و3 خدمات).

**بديل (اختياري):** بعد إضافة `SUPABASE_SERVICE_ROLE_KEY` إلى `.env.local` (من إعدادات المشروع → API، ولا تشاركه ولا تنشره)، يمكنك تشغيل:

```bash
npm run seed
```

## د) إنشاء حساب مشرف وربطه باللوحة

1. في Supabase: **Authentication → Users → Add user → Create new user** (بريد وكلمة مرور).
   - للتجربة السريعة يمكن تعطيل **Confirm email** من **Authentication → Providers → Email** (يفضّل إعادة تفعيله في الإنتاج).
2. انسخ **User UID** للمستخدم الذي أنشأته.
3. في **SQL Editor** نفّذ (استبدل `PASTE_USER_UUID_HERE`):

```sql
INSERT INTO public.admin_users (user_id) VALUES ('PASTE_USER_UUID_HERE');
```

بعدها يمكنك تسجيل الدخول من `/admin/login` بنفس البريد وكلمة المرور.

## هـ) تشغيل المشروع محليًا

```bash
npm install
npm run dev
```

- الموقع العام: [http://localhost:3000](http://localhost:3000)
- لوحة التحكم: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## و) النشر على Vercel

1. ارفع المشروع إلى GitHub (أو GitLab/Bitbucket).
2. في [Vercel](https://vercel.com/) أنشئ مشروعًا جديدًا واربطه بالمستودع.
3. في **Environment Variables** أضف نفس المتغيرات الموجودة في `.env.example` (القيم الفعلية).
4. انشر — سيتم تشغيل `npm run build` تلقائيًا.

## السلوك التقني المهم

- **منع الحجز المزدوج**: فهرس فريد على `(barber_id, booking_date, booking_time)` للصفوف غير الملغاة، مع التحقق في الواجهة عبر الدالة `get_booked_slots`.
- **لا بيانات وهمية في المنطق**: الصفحة الرئيسية ونموذج الحجز يقرآن من Supabase فقط؛ الرسائل التوضيحية تظهر فقط عند نقص الإعداد أو البيانات.
- **واتساب**: بعد حجز ناجح يُفتح رابط `https://wa.me/20...?text=...` برسالة منسقة.

## هيكل الملفات المرتبط بالباكند

| الملف | الوصف |
|--------|--------|
| `supabase/schema.sql` | الجداول، الـ RLS، الدوال، منع التعارض |
| `supabase/seed.sql` | بيانات أولية للحلاقين والخدمات |

## الأوامر

| الأمر | الوظيفة |
|--------|----------|
| `npm run dev` | التطوير |
| `npm run build` | بناء الإنتاج |
| `npm run start` | تشغيل بعد البناء |
| `npm run lint` | فحص ESLint |

---

صُمم لصالونات حقيقية: واجهة عربية، حجز مع تحقق من المواعيد، ولوحة إدارة للحالات والفلترة.
