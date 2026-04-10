# 🚀 دليل رفع سوق إدكو على Dokploy

## ⚙️ المتطلبات قبل البدء
- حساب GitHub وعندك الريبو على: `github.com/maclive/storefront-remix-starter`
- Dokploy مثبّت على السيرفر Ubuntu (1GB RAM + 4GB Swap)
- دومين مربوط: `pandastore.bramjlive.com`

---

## الخطوة 1 — رفع الكود على GitHub

```bash
# في جهازك المحلي — داخل مجلد souq-adko
git init
git add .
git commit -m "first commit: سوق إدكو Next.js 14"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/souq-adko.git
git push -u origin main
```

> استبدل `YOUR_USERNAME` باسم حسابك على GitHub

---

## الخطوة 2 — إعداد المشروع في Dokploy

### 2.1 افتح Dokploy Dashboard
اذهب إلى: `http://YOUR_SERVER_IP:3000`

### 2.2 أنشئ Project جديد
1. اضغط **"New Project"**
2. اكتب الاسم: `souq-adko`
3. اضغط **"Create"**

### 2.3 أضف Application
1. داخل المشروع → اضغط **"Add Service"** → **"Application"**
2. اختر **"GitHub"**
3. وصّل حساب GitHub (لو أول مرة)
4. اختر الريبو: `souq-adko`
5. الـ Branch: `main`

---

## الخطوة 3 — إعداد Build Settings

في صفحة الـ Application:

| الإعداد | القيمة |
|---------|--------|
| **Build Type** | `Dockerfile` |
| **Dockerfile Path** | `Dockerfile` |
| **Port** | `3000` |

---

## الخطوة 4 — Environment Variables

في تبويب **"Environment"**، أضف المتغيرات دي:

```
NEXT_PUBLIC_VENDURE_API=https://bramjlive.com/shop-api
NEXT_PUBLIC_SITE_URL=http://pandastore.bramjlive.com
NODE_OPTIONS=--max-old-space-size=512
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

اضغط **"Save"**

---

## الخطوة 5 — إعداد الدومين

1. اذهب إلى تبويب **"Domains"**
2. اضغط **"Add Domain"**
3. أدخل: `pandastore.bramjlive.com`
4. اختر **HTTPS** (لو عندك SSL)
5. اضغط **"Save"**

---

## الخطوة 6 — أول Deploy

1. اضغط **"Deploy"** (الزرار الأخضر)
2. تابع الـ Logs في تبويب **"Logs"**

### 🟡 مهم جداً للـ 1GB RAM:
لو فشل الـ Build بسبب الـ RAM، افعل الآتي:

#### الحل: Build في GitHub Actions (مش على السيرفر)

أنشئ الملف ده في ريبوك: `.github/workflows/deploy.yml`

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          NEXT_PUBLIC_VENDURE_API: https://bramjlive.com/shop-api
          NEXT_PUBLIC_SITE_URL: http://pandastore.bramjlive.com
          NODE_OPTIONS: --max-old-space-size=2048
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/souq-adko
            git pull
            docker build -t souq-adko .
            docker stop souq-adko-app || true
            docker rm souq-adko-app || true
            docker run -d \
              --name souq-adko-app \
              --restart unless-stopped \
              -p 3000:3000 \
              -e NODE_OPTIONS="--max-old-space-size=384" \
              -e NODE_ENV=production \
              souq-adko
```

#### GitHub Secrets المطلوبة:
في GitHub → Repository → Settings → Secrets → Actions:
- `SERVER_HOST` → IP السيرفر
- `SERVER_USER` → `root` أو اسم اليوزر
- `SERVER_SSH_KEY` → محتوى ملف `~/.ssh/id_rsa`

---

## الخطوة 7 — ربط Vendure Admin بالواجهة

### CORS في Vendure
في ملف `vendure-config.ts` على السيرفر، تأكد من وجود:

```typescript
apiOptions: {
  cors: {
    origin: [
      'http://pandastore.bramjlive.com',
      'https://pandastore.bramjlive.com',
    ],
    credentials: true,
  },
  shopApiPath: 'shop-api',
},
```

بعد التعديل → أعد تشغيل Vendure.

---

## الخطوة 8 — الربط مع لوحة التحكم Vendure Admin

افتح: `https://bramjlive.com/admin`

### إعدادات Shipping Methods (طرق الشحن):
1. اذهب إلى **Settings → Shipping Methods**
2. أضف طريقة شحن: `cash-on-delivery`
3. الكود: `cash-on-delivery`
4. السعر: حسب رغبتك

### Payment Methods (طرق الدفع):
1. **Settings → Payment Methods**
2. أضف: `cash-on-delivery`
3. Handler: `Manual Payment`

---

## الخطوة 9 — التحقق من الرفع

```bash
# تحقق إن الموقع شغّال
curl -I http://pandastore.bramjlive.com

# تحقق من الـ GraphQL API
curl https://bramjlive.com/shop-api \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ products(options:{take:1}){totalItems} }"}'
```

---

## 🔍 حل مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| Build فشل بـ OOM | استخدم GitHub Actions للبناء |
| الصور مش ظاهرة | تأكد من إضافة `bramjlive.com` في `next.config.js` remotePatterns |
| CORS error | أضف الدومين في Vendure config |
| السلة بتتمسح | تأكد إن cookies مفعّلة بين الدومينين |
| المنتجات مش بتظهر | تحقق من `NEXT_PUBLIC_VENDURE_API` في env vars |

---

## 📊 مراقبة الأداء

```bash
# مراقبة الـ RAM على السيرفر
free -h

# مراقبة الـ Docker containers
docker stats

# مشاهدة الـ logs
docker logs souq-adko-app -f
```

---

## ✅ قائمة التحقق النهائية

- [ ] الكود مرفوع على GitHub
- [ ] `.env` مضبوط في Dokploy
- [ ] الدومين مربوط
- [ ] CORS مضبوط في Vendure
- [ ] Shipping Method موجودة في Admin
- [ ] Payment Method موجودة في Admin
- [ ] الموقع بيعرض المنتجات
- [ ] السلة بتشتغل
- [ ] صفحة الـ Checkout بتكمل الطلب
