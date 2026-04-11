import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../static-page.module.css'

export const metadata: Metadata = { title: 'الشروط والأحكام' }

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>📋 الشروط والأحكام</h1>
        <p className={styles.heroSub}>يرجى قراءة هذه الشروط بعناية قبل استخدام المتجر</p>
      </div>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link> ← <span>الشروط والأحكام</span>
        </nav>
        <div className={styles.card}>
          <h2>استخدام المتجر</h2>
          <p>باستخدامك لمتجر سوق إدكو، فإنك توافق على الالتزام بهذه الشروط والأحكام. يحق لنا تعديل هذه الشروط في أي وقت مع إشعار مسبق.</p>
        </div>
        <div className={styles.card}>
          <h2>الطلبات والدفع</h2>
          <ul>
            <li>جميع الأسعار بالجنيه المصري وتشمل ضريبة القيمة المضافة</li>
            <li>يتم تأكيد الطلب بعد التحقق من توفر المنتج</li>
            <li>نحتفظ بالحق في إلغاء أي طلب في حالة نفاد المخزون</li>
            <li>الدفع عند الاستلام متاح لجميع المناطق</li>
          </ul>
        </div>
        <div className={styles.card}>
          <h2>الملكية الفكرية</h2>
          <p>جميع المحتويات المنشورة على موقعنا من صور ونصوص وشعارات هي ملك حصري لسوق إدكو ولا يجوز استخدامها دون إذن كتابي مسبق.</p>
        </div>
        <div className={styles.card}>
          <h2>المسؤولية</h2>
          <p>سوق إدكو غير مسؤول عن أي تأخير في التوصيل ناتج عن ظروف خارجة عن إرادتنا كالكوارث الطبيعية أو الإضرابات. نلتزم بإبلاغك فور علمنا بأي تأخير.</p>
        </div>
        <div className={styles.card}>
          <h2>التواصل</h2>
          <p>لأي استفسار: <strong>help@souqedku.com</strong> أو <strong>+201097090024</strong></p>
        </div>
      </div>
    </div>
  )
}
