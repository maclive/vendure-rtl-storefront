import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../static-page.module.css'

export const metadata: Metadata = {
  title: 'سياسة الاسترجاع والاسترداد',
  description: 'سياسة الاسترجاع والاسترداد في سوق إدكو',
}

export default function ReturnsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>↩️ سياسة الاسترجاع والاسترداد</h1>
        <p className={styles.heroSub}>رضاك يهمنا — استرجاع سهل وسريع</p>
      </div>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link> ← <span>سياسة الاسترجاع</span>
        </nav>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📅</div>
            <strong>14 يوم</strong>
            <span>مدة الاسترجاع</span>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>💰</div>
            <strong>استرداد كامل</strong>
            <span>للمنتجات المعيبة</span>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📞</div>
            <strong>دعم سريع</strong>
            <span>خلال 24 ساعة</span>
          </div>
        </div>

        <div className={styles.card}>
          <h2>شروط الاسترجاع</h2>
          <ul>
            <li>يمكن استرجاع المنتج خلال 14 يوم من تاريخ الاستلام</li>
            <li>يجب أن يكون المنتج في حالته الأصلية غير مستخدم</li>
            <li>يجب الاحتفاظ بالتغليف الأصلي والفاتورة</li>
            <li>المنتجات المعيبة أو التالفة يتم استبدالها أو استرداد قيمتها بالكامل</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>منتجات غير قابلة للاسترجاع</h2>
          <ul>
            <li>المنتجات التي تم استخدامها أو تلفت بسبب الإهمال</li>
            <li>المنتجات التي نقصت أجزاؤها أو تغير شكلها الأصلي</li>
            <li>المنتجات المخفضة بنسبة أكثر من 50% (عروض خاصة)</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>خطوات الاسترجاع</h2>
          <ul>
            <li>تواصل معنا عبر واتساب أو الهاتف على <strong>+201097090024</strong></li>
            <li>أخبرنا برقم طلبك وسبب الاسترجاع</li>
            <li>سنرتب معك موعد الاستلام</li>
            <li>سيتم استرداد المبلغ خلال 3-5 أيام عمل</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>الاستبدال</h2>
          <p>في حال رغبتك في استبدال المنتج بمقاس أو لون آخر، يمكنك التواصل معنا وسنوفر لك المنتج المطلوب بأسرع وقت ممكن دون أي رسوم إضافية في حالة المنتجات المعيبة.</p>
        </div>
      </div>
    </div>
  )
}
