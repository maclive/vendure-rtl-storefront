import type { Metadata } from 'next'
import Link from 'next/link'
import styles from '../static-page.module.css'

export const metadata: Metadata = { title: 'سياسة الخصوصية' }

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>🔒 سياسة الخصوصية</h1>
        <p className={styles.heroSub}>بياناتك في أمان معنا</p>
      </div>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link> ← <span>سياسة الخصوصية</span>
        </nav>
        <div className={styles.card}>
          <h2>جمع المعلومات</h2>
          <p>نقوم بجمع المعلومات الضرورية فقط لإتمام طلبك وتوصيله إليك، وتشمل: الاسم، رقم الهاتف، والعنوان.</p>
          <p>لا نشارك بياناتك الشخصية مع أي طرف ثالث إلا شركات الشحن لغرض توصيل طلبك فقط.</p>
        </div>
        <div className={styles.card}>
          <h2>استخدام المعلومات</h2>
          <ul>
            <li>تأكيد الطلبات والتواصل معك بشأنها</li>
            <li>توصيل الطلبات إلى عنوانك</li>
            <li>إرسال عروض وتخفيضات (بموافقتك فقط)</li>
            <li>تحسين خدماتنا وتجربة التسوق</li>
          </ul>
        </div>
        <div className={styles.card}>
          <h2>حماية البيانات</h2>
          <p>نستخدم تشفير SSL لحماية جميع البيانات المرسلة عبر موقعنا. لا نحتفظ ببيانات بطاقاتك البنكية على خوادمنا.</p>
        </div>
        <div className={styles.card}>
          <h2>التواصل معنا</h2>
          <p>لأي استفسار حول سياسة الخصوصية، تواصل معنا على: <strong>help@souqedku.com</strong></p>
        </div>
      </div>
    </div>
  )
}
