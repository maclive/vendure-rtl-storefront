'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import styles from '../static-page.module.css'
import cStyles from './contact.module.css'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      toast.error('يرجى تعبئة الحقول المطلوبة')
      return
    }
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('✓ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً')
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>تواصل معنا</h1>
        <p className={styles.heroSub}>نحن هنا لمساعدتك في أي وقت</p>
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link> ← <span>تواصل معنا</span>
        </nav>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📞</div>
            <strong>رقم الهاتف</strong>
            <span>+201097090024</span>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📧</div>
            <strong>البريد الإلكتروني</strong>
            <span>help@souqedku.com</span>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📍</div>
            <strong>العنوان</strong>
            <span>إدكو - شارع الهناء</span>
          </div>
        </div>

        <div className={styles.card}>
          <h2>أرسل لنا رسالة</h2>
          <form onSubmit={handleSubmit} className={cStyles.form} noValidate>
            <div className={cStyles.row}>
              <div className={cStyles.field}>
                <label>الاسم الكامل <span className={cStyles.req}>*</span></label>
                <input type="text" placeholder="اسمك" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className={cStyles.field}>
                <label>رقم الهاتف <span className={cStyles.req}>*</span></label>
                <input type="tel" placeholder="01xxxxxxxxx" value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
            <div className={cStyles.field}>
              <label>البريد الإلكتروني</label>
              <input type="email" placeholder="example@email.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className={cStyles.field}>
              <label>الموضوع</label>
              <input type="text" placeholder="موضوع رسالتك" value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})} />
            </div>
            <div className={cStyles.field}>
              <label>الرسالة <span className={cStyles.req}>*</span></label>
              <textarea rows={5} placeholder="اكتب رسالتك هنا..." value={form.message}
                onChange={e => setForm({...form, message: e.target.value})} />
            </div>
            <button type="submit" className={cStyles.submitBtn} disabled={sending}>
              {sending ? 'جاري الإرسال...' : '✉️ إرسال الرسالة'}
            </button>
          </form>
        </div>

        <div className={cStyles.whatsapp}>
          <a href="https://wa.me/00201097090024" target="_blank" rel="noopener noreferrer">
            <span>💬</span>
            <div>
              <strong>تواصل معنا على واتساب</strong>
              <span>متاح من 9 صباحاً حتى 11 مساءً</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
