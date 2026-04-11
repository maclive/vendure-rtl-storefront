import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              🛍 سوق <span>إدكو</span>
            </Link>
            <p>متجرك الإلكتروني الأول في إدكو — منتجات أصيلة، أسعار منافسة، شحن سريع لكل أنحاء مصر</p>
            <a href="https://wa.me/00201097090024" target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
              💬 تواصل على واتساب
            </a>
            <div className={styles.payments}>
              <span>Visa</span><span>MasterCard</span><span>Fawry</span><span>كاش</span>
            </div>
          </div>

          <div className={styles.col}>
            <h3>تسوق</h3>
            <ul>
              <li><Link href="/collections">كل الأقسام</Link></li>
              <li><Link href="/collections/mens">ملابس رجالية</Link></li>
              <li><Link href="/collections/tshirts">تيشيرتات</Link></li>
              <li><Link href="/search?q=عطور">عطور</Link></li>
              <li><Link href="/search?q=جديد">وصل جديد</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h3>خدمة العملاء</h3>
            <ul>
              <li><Link href="/contact">تواصل معنا</Link></li>
              <li><Link href="/shipping">سياسة الشحن</Link></li>
              <li><Link href="/returns">الاسترجاع والاسترداد</Link></li>
              <li><Link href="/faq">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h3>النشرة البريدية</h3>
            <p className={styles.newsletterText}>اشترك واحصل على أحدث العروض</p>
            <form className={styles.newsletter} action="#">
              <input type="email" placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني" />
              <button type="submit">اشترك</button>
            </form>
            <div className={styles.contact}>
              <p>📞 <a href="tel:+201097090024">+201097090024</a></p>
              <p>📧 <a href="mailto:help@souqedku.com">help@souqedku.com</a></p>
              <p>📍 إدكو - شارع الهناء</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} سوق إدكو — جميع الحقوق محفوظة</span>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">سياسة الخصوصية</Link>
            <Link href="/terms">الشروط والأحكام</Link>
            <Link href="/returns">الاسترجاع</Link>
          </div>
          <span>مصنوع بـ ❤ في إدكو، مصر</span>
        </div>
      </div>
    </footer>
  )
}
