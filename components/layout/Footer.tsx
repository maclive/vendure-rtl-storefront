import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>🛍 سوق <span>إدكو</span></Link>
            <p>متجرك الإلكتروني الأول للتسوق الذكي — منتجات أصيلة، أسعار منافسة، شحن سريع لكل أنحاء مصر</p>
            <div className={styles.payments}>
              <span>Visa</span><span>MasterCard</span><span>Fawry</span><span>كاش</span>
            </div>
          </div>

          {/* Shop */}
          <div className={styles.col}>
            <h3>تسوق</h3>
            <ul>
              <li><Link href="/collections">كل الأقسام</Link></li>
              <li><Link href="/collections/mens">ملابس رجالية</Link></li>
              <li><Link href="/collections/tshirts">تيشيرتات</Link></li>
              <li><Link href="/search?q=عطور">عطور فاخرة</Link></li>
              <li><Link href="/search?q=إلكترونيات">إلكترونيات</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className={styles.col}>
            <h3>المساعدة</h3>
            <ul>
              <li><Link href="/orders">تتبع الطلب</Link></li>
              <li><Link href="/returns">سياسة الإرجاع</Link></li>
              <li><Link href="/shipping">الشحن والتوصيل</Link></li>
              <li><Link href="/faq">الأسئلة الشائعة</Link></li>
              <li><Link href="/contact">تواصل معنا</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.col}>
            <h3>النشرة البريدية</h3>
            <p className={styles.newsletterText}>اشترك واحصل على أحدث العروض والتخفيضات</p>
            <form className={styles.newsletter} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني" />
              <button type="submit">اشترك</button>
            </form>
            <div className={styles.social}>
              <a href="#" aria-label="فيسبوك">📘</a>
              <a href="#" aria-label="انستغرام">📸</a>
              <a href="#" aria-label="واتساب">💬</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} سوق إدكو — جميع الحقوق محفوظة</span>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">الخصوصية</Link>
            <Link href="/terms">الشروط</Link>
          </div>
          <span>مصنوع بـ ❤ في إدكو، مصر</span>
        </div>
      </div>
    </footer>
  )
}
