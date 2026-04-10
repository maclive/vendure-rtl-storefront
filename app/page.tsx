import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { gqlClient, GET_COLLECTIONS, GET_PRODUCTS } from '@/lib/vendure'
import ProductCard from '@/components/product/ProductCard'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'سوق إدكو — تسوق الأحدث بأفضل الأسعار',
  description: 'سوق إدكو — متجرك الإلكتروني للملابس والإلكترونيات والعطور. شحن سريع، أسعار منافسة، دفع آمن.',
}

async function getData() {
  try {
    const [collectionsRes, productsRes] = await Promise.all([
      gqlClient.request<any>(GET_COLLECTIONS),
      gqlClient.request<any>(GET_PRODUCTS, { take: 8, skip: 0 }),
    ])
    return {
      collections: collectionsRes?.collections?.items || [],
      products: productsRes?.products?.items || [],
    }
  } catch {
    return { collections: [], products: [] }
  }
}

export default async function HomePage() {
  const { collections, products } = await getData()

  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-label="البانر الرئيسي">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.heroLabel}>✦ وصل جديد لسوق إدكو</span>
            <h1 className={styles.heroTitle}>
              تسوق <em>الأحدث</em><br />بأفضل الأسعار
            </h1>
            <p className={styles.heroSub}>
              ملابس، إلكترونيات، عطور وأكثر — شحن سريع لكل أنحاء مصر
            </p>
            <div className={styles.heroBtns}>
              <Link href="/collections" className="btn-primary">تسوق الآن</Link>
              <Link href="/search?q=عروض" className={styles.heroOutline}>اكتشف العروض</Link>
            </div>
          </div>

          <div className={styles.heroStats} aria-label="إحصائيات المتجر">
            {[
              { icon: '📦', num: '+10K', label: 'منتج متاح' },
              { icon: '⚡', num: '24h',  label: 'توصيل سريع' },
              { icon: '⭐', num: '4.9',  label: 'تقييم العملاء' },
              { icon: '🔒', num: '100%', label: 'دفع آمن' },
            ].map((s) => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statIcon} aria-hidden="true">{s.icon}</span>
                <strong className={styles.statNum}>{s.num}</strong>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <div className={styles.features} aria-label="مميزات التسوق">
        {[
          { icon: '🚚', title: 'شحن مجاني', sub: 'للطلبات فوق 500 ج.م' },
          { icon: '↩️', title: 'إرجاع مجاني', sub: 'خلال 14 يوم' },
          { icon: '🔒', title: 'دفع آمن 100%', sub: 'فيزا، ماستركارد، كاش' },
          { icon: '🎧', title: 'دعم 24/7', sub: 'خدمة عملاء متاحة دائماً' },
        ].map((f) => (
          <div key={f.title} className={styles.feature}>
            <span className={styles.featureIcon} aria-hidden="true">{f.icon}</span>
            <div>
              <strong>{f.title}</strong>
              <span>{f.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Categories ── */}
      {collections.length > 0 && (
        <section className={styles.section} aria-labelledby="cats-title">
          <div className={styles.sectionHeader}>
            <h2 id="cats-title" className="section-title">
              تسوق حسب <span>الفئة</span>
            </h2>
            <Link href="/collections" className={styles.seeAll}>عرض الكل ←</Link>
          </div>

          <div className={styles.catsGrid}>
            {collections.map((col: any) => (
              <Link key={col.id} href={`/collections/${col.slug}`} className={styles.catCard}>
                <div className={styles.catImg}>
                  {col.featuredAsset?.preview ? (
                    <Image
                      src={`${col.featuredAsset.preview}?w=200&h=200`}
                      alt={col.name}
                      width={200}
                      height={200}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <span aria-hidden="true">🛍</span>
                  )}
                </div>
                <p className={styles.catName}>{col.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Products ── */}
      <section className={styles.section} aria-labelledby="products-title">
        <div className={styles.sectionHeader}>
          <h2 id="products-title" className="section-title">
            منتجات <span>مميزة</span>
          </h2>
          <Link href="/collections" className={styles.seeAll}>عرض الكل ←</Link>
        </div>

        {products.length > 0 ? (
          <div className={styles.productsGrid}>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.noProducts}>
            <p>لا توجد منتجات حالياً، تفقد مرة أخرى قريباً!</p>
          </div>
        )}
      </section>

      {/* ── Promo Banner ── */}
      <section className={styles.promoBanner} aria-label="عرض خاص">
        <div className={styles.promoText}>
          <h2>خصم حتى <em>50%</em> على الإلكترونيات</h2>
          <p>عروض محدودة — انتهز الفرصة قبل نفاد الكمية</p>
        </div>
        <Link href="/search?q=إلكترونيات" className="btn-primary">
          تسوق العرض ←
        </Link>
      </section>
    </>
  )
}
