'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './HeroSlider.module.css'

const slides = [
  {
    id: 1,
    label: '✦ وصل جديد',
    title: 'تسوق الأحدث',
    titleEm: 'بأفضل الأسعار',
    sub: 'ملابس، إلكترونيات، عطور وأكثر — شحن سريع لكل أنحاء مصر',
    cta: 'تسوق الآن',
    ctaLink: '/collections',
    cta2: 'اكتشف العروض',
    cta2Link: '/search?q=عروض',
    bg: 'linear-gradient(135deg, #0f0f0f 0%, #1a1200 100%)',
    accent: '#c9933a',
    icon: '👕',
    items: ['👕 ملابس عصرية', '👟 أحذية', '👜 إكسسوارات'],
    stat: { num: '+500', label: 'منتج ملابس' },
  },
  {
    id: 2,
    label: '⚡ عروض الإلكترونيات',
    title: 'تكنولوجيا',
    titleEm: 'بأسعار لا تُقاوم',
    sub: 'سماعات، ساعات ذكية، هواتف وإكسسوارات إلكترونية بضمان',
    cta: 'تسوق الإلكترونيات',
    ctaLink: '/search?q=إلكترونيات',
    cta2: 'العروض الحصرية',
    cta2Link: '/collections',
    bg: 'linear-gradient(135deg, #0a1628 0%, #0f0f0f 100%)',
    accent: '#1D9E75',
    icon: '📱',
    items: ['📱 هواتف', '🎧 سماعات', '⌚ ساعات ذكية'],
    stat: { num: '+200', label: 'منتج إلكتروني' },
  },
  {
    id: 3,
    label: '🌸 عطور فاخرة',
    title: 'رائحتك',
    titleEm: 'هويتك الفريدة',
    sub: 'تشكيلة واسعة من أفخم العطور المحلية والعالمية بأسعار منافسة',
    cta: 'اكتشف العطور',
    ctaLink: '/search?q=عطور',
    cta2: 'عروض خاصة',
    cta2Link: '/collections',
    bg: 'linear-gradient(135deg, #1a0a00 0%, #0f0f0f 100%)',
    accent: '#c9933a',
    icon: '🌸',
    items: ['🌸 عطور نسائية', '🌿 عطور رجالية', '🎁 هدايا'],
    stat: { num: '+100', label: 'عطر فاخر' },
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  const slide = slides[current]

  return (
    <section
      className={styles.slider}
      style={{ background: slide.bg }}
      aria-label="عروض المتجر"
    >
      {/* Background circles */}
      <div className={styles.bgCircle1} style={{ background: slide.accent }} />
      <div className={styles.bgCircle2} style={{ background: slide.accent }} />

      <div className={styles.inner}>
        {/* Text side */}
        <div className={`${styles.content} ${animating ? styles.fadeIn : ''}`} key={current}>
          <span className={styles.label} style={{ background: slide.accent }}>{slide.label}</span>

          <h1 className={styles.title}>
            {slide.title}<br />
            <em style={{ color: slide.accent }}>{slide.titleEm}</em>
          </h1>

          <p className={styles.sub}>{slide.sub}</p>

          <div className={styles.tags}>
            {slide.items.map(item => (
              <span key={item} className={styles.tag}>{item}</span>
            ))}
          </div>

          <div className={styles.btns}>
            <Link href={slide.ctaLink} className={styles.btnPrimary}
              style={{ background: slide.accent }}>
              {slide.cta}
            </Link>
            <Link href={slide.cta2Link} className={styles.btnOutline}>
              {slide.cta2}
            </Link>
          </div>
        </div>

        {/* Visual side */}
        <div className={`${styles.visual} ${animating ? styles.fadeIn : ''}`} key={`v${current}`}>
          <div className={styles.mainIcon} style={{ borderColor: slide.accent }}>
            <span>{slide.icon}</span>
          </div>
          <div className={styles.statCard} style={{ borderColor: slide.accent }}>
            <strong style={{ color: slide.accent }}>{slide.stat.num}</strong>
            <span>{slide.stat.label}</span>
          </div>
          <div className={styles.floatBadge}>
            🚚 شحن مجاني فوق 400 ج.م
          </div>
        </div>
      </div>

      {/* Controls */}
      <button className={`${styles.arrow} ${styles.arrowPrev}`} onClick={prev} aria-label="السابق">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <button className={`${styles.arrow} ${styles.arrowNext}`} onClick={next} aria-label="التالي">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className={styles.dots} role="tablist">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            style={i === current ? { background: slide.accent } : {}}
            aria-label={`الشريحة ${i + 1}`}
            role="tab"
            aria-selected={i === current}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className={styles.progress} key={current}>
        <div className={styles.progressBar} style={{ background: slide.accent }} />
      </div>
    </section>
  )
}
