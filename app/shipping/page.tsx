import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../static-page.module.css'

export const metadata: Metadata = {
  title: 'سياسة الشحن والتوصيل',
  description: 'سياسة الشحن والتوصيل في سوق إدكو — شحن مجاني داخل مدينة إدكو',
}

export default function ShippingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>🚚 سياسة الشحن والتوصيل</h1>
        <p className={styles.heroSub}>شحن مجاني داخل مدينة إدكو</p>
      </div>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link> ← <span>سياسة الشحن</span>
        </nav>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🆓</div>
            <strong>شحن مجاني</strong>
            <span>داخل مدينة إدكو</span>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>⚡</div>
            <strong>توصيل سريع</strong>
            <span>خلال 24-48 ساعة</span>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🎁</div>
            <strong>شحن مجاني</strong>
            <span>للطلبات فوق 400 ج.م</span>
          </div>
        </div>

        <div className={styles.card}>
          <h2>مناطق التوصيل</h2>
          <p>نوفر خدمة التوصيل لجميع مناطق مصر مع التركيز على خدمة أفضل داخل مدينة إدكو والمناطق المجاورة.</p>
          <ul>
            <li>داخل مدينة إدكو — شحن مجاني بالكامل</li>
            <li>محافظة البحيرة — رسوم شحن تبدأ من 30 ج.م</li>
            <li>باقي المحافظات — رسوم شحن تبدأ من 50 ج.م</li>
            <li>الطلبات فوق 400 ج.م — شحن مجاني لكل مصر</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>مواعيد التوصيل</h2>
          <ul>
            <li>داخل إدكو: نفس اليوم أو في موعد أقصاه 24 ساعة</li>
            <li>محافظة البحيرة: من 1 إلى 2 يوم عمل</li>
            <li>باقي المحافظات: من 2 إلى 4 أيام عمل</li>
            <li>أيام العمل: السبت إلى الخميس (عدا الجمعة والعطلات الرسمية)</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>طرق الدفع عند الاستلام</h2>
          <p>نقبل الدفع نقداً عند استلام الطلب (Cash on Delivery) لجميع المناطق. يمكنك الدفع بالبطاقة البنكية أو المحفظة الإلكترونية عبر منصتنا الإلكترونية.</p>
        </div>

        <div className={styles.card}>
          <h2>تتبع الطلب</h2>
          <p>بعد تأكيد طلبك، ستتلقى رسالة على رقم هاتفك تحتوي على رقم الطلب الخاص بك. يمكنك التواصل معنا في أي وقت لمعرفة حالة طلبك.</p>
          <p>للاستفسار: <strong>+201097090024</strong> أو عبر واتساب</p>
        </div>
      </div>
    </div>
  )
}
