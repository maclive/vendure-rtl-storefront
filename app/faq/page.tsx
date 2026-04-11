'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from '../static-page.module.css'
import fStyles from './faq.module.css'

const faqs = [
  { q: 'كيف أتتبع طلبي؟', a: 'بعد تأكيد طلبك، ستتلقى رسالة على رقم هاتفك برقم الطلب. يمكنك التواصل معنا على واتساب +201097090024 لمتابعة حالة طلبك في أي وقت.' },
  { q: 'ما هي مناطق التوصيل؟', a: 'نوصل لجميع محافظات مصر. الشحن مجاني داخل مدينة إدكو وللطلبات التي تزيد قيمتها عن 400 جنيه.' },
  { q: 'كم يستغرق وقت التوصيل؟', a: 'داخل إدكو: 24 ساعة. محافظة البحيرة: 1-2 يوم. باقي المحافظات: 2-4 أيام عمل.' },
  { q: 'هل يمكنني الدفع عند الاستلام؟', a: 'نعم، نقبل الدفع نقداً عند استلام الطلب لجميع المناطق.' },
  { q: 'كيف أسترجع منتجاً؟', a: 'تواصل معنا خلال 14 يوم من الاستلام عبر واتساب أو الهاتف. يجب أن يكون المنتج في حالته الأصلية غير مستخدم.' },
  { q: 'هل الأسعار تشمل الشحن؟', a: 'أسعار المنتجات لا تشمل رسوم الشحن إلا في حالة الطلبات التي تزيد عن 400 جنيه أو داخل مدينة إدكو.' },
  { q: 'كيف أتأكد من صحة المنتج عند الاستلام؟', a: 'ننصحك بفحص المنتج أمام المندوب قبل الدفع. في حالة وجود أي عيب، سنستبدله فوراً.' },
  { q: 'هل يمكنني تعديل طلبي بعد تقديمه؟', a: 'يمكن تعديل الطلب خلال ساعة من تقديمه. تواصل معنا فوراً عبر واتساب +201097090024.' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>❓ الأسئلة الشائعة</h1>
        <p className={styles.heroSub}>إجابات على أكثر الأسئلة شيوعاً</p>
      </div>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link> ← <span>الأسئلة الشائعة</span>
        </nav>
        <div className={fStyles.list}>
          {faqs.map((faq, i) => (
            <div key={i} className={`${fStyles.item} ${open === i ? fStyles.active : ''}`}>
              <button className={fStyles.question} onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                <span className={fStyles.icon}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <div className={fStyles.answer}>{faq.a}</div>}
            </div>
          ))}
        </div>
        <div className={styles.card} style={{ marginTop: 24, textAlign: 'center' }}>
          <p>لم تجد إجابة لسؤالك؟</p>
          <Link href="/contact" style={{ display: 'inline-block', marginTop: 12, background: 'var(--c-gold)', color: '#fff', padding: '12px 28px', borderRadius: '40px', fontWeight: 700 }}>
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  )
}
