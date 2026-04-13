import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { gqlClient, GET_COLLECTIONS, GET_PRODUCTS } from '@/lib/vendure'
import ProductCard from '@/components/product/ProductCard'
import HeroSlider from '@/components/layout/HeroSlider'
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
      {/* Hero Slider */}
      <HeroSlider />

      {/* Features Strip */}
      <div className={styles.features}>
        {[
          { icon: '🚚', title: 'شحن مجاني', sub: 'للطلبات فوق 400 ج.م' },
          { icon: '↩️', title: 'إرجاع مجاني', sub: 'خلال 14 يوم' },
          { icon: '🔒', title: 'دفع آمن', sub: 'فيزا، كاش، فوري' },
          { icon: '🎧', title: 'دعم 24/7', sub: '+201097090024' },
        ].map((f) => (
          <div key={f.title} className={styles.feature}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <div>
              <strong>{f.title}</strong>
              <span>{f.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      {collections.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionSub}>تصفح حسب</p>
              <h2 className={styles.sectionTitle}>الأقسام <span>الرئيسية</span></h2>
            </div>
            <Link href="/collections" className={styles.seeAll}>عرض الكل ←</Link>
          </div>
          <div className={styles.catsGrid}>
            {collections.map((col: any) => (
              <Link key={col.id} href={`/collections/${col.slug}`} className={styles.catCard}>
                <div className={styles.catImgWrap}>
                  {col.featuredAsset?.preview ? (
                    <Image
                      src={`${col.featuredAsset.preview}?w=300&h=300`}
                      alt={col.name}
                      width={300} height={300}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <span className={styles.catEmoji}>🛍</span>
                  )}
                  <div className={styles.catOverlay} />
                </div>
                <div className={styles.catLabel}>
                  <span>{col.name}</span>
                  <span className={styles.catArrow}>←</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <div className={styles.promoBanner}>
        <div className={styles.promoContent}>
          <span className={styles.promoTag}>⚡ عرض محدود</span>
          <h2>شحن مجاني على جميع الطلبات<em> فوق 400 ج.م</em></h2>
          <p>استمتع بتجربة تسوق مريحة مع توصيل سريع لباب منزلك في إدكو وكل محافظات مصر</p>
          <Link href="/collections" className={styles.promoCta}>تسوق الآن</Link>
        </div>
        <div className={styles.promoIcons}>
          <span>🚚</span><span>📦</span><span>⭐</span>
        </div>
      </div>

      {/* Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionSub}>الأكثر مبيعاً</p>
            <h2 className={styles.sectionTitle}>منتجات <span>مميزة</span></h2>
          </div>
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
            <span style={{ fontSize: 48 }}>🛍</span>
            <p>لا توجد منتجات حالياً</p>
            <Link href="/collections" className="btn-primary">تصفح الأقسام</Link>
          </div>
        )}
      </section>

      {/* Why us */}
      <section className={styles.whySection}>
        <div className={styles.whyInner}>
          <div className={styles.whyText}>
            <p className={styles.sectionSub}>لماذا سوق إدكو؟</p>
            <h2 className={styles.sectionTitle}>تسوق بثقة<br /><span>وراحة بال</span></h2>
            <p className={styles.whySub}>نحن هنا في إدكو نقدم لك تجربة تسوق متكاملة بمنتجات أصيلة وأسعار منافسة وخدمة عملاء على مدار الساعة</p>
            <Link href="/contact" className={styles.whyCta}>تواصل معنا</Link>
          </div>
          <div className={styles.whyCards}>
            {[
              { icon: '✅', title: 'منتجات أصيلة', desc: 'جميع منتجاتنا أصلية 100% مع ضمان الجودة' },
              { icon: '💰', title: 'أسعار منافسة', desc: 'نضمن لك أفضل الأسعار في السوق المصري' },
              { icon: '⚡', title: 'توصيل سريع', desc: 'نفس اليوم داخل إدكو و24-48 ساعة لباقي المحافظات' },
              { icon: '🤝', title: 'خدمة متميزة', desc: 'فريق دعم متاح 7 أيام الأسبوع للمساعدة' },
            ].map(w => (
              <div key={w.title} className={styles.whyCard}>
                <span className={styles.whyIcon}>{w.icon}</span>
                <strong>{w.title}</strong>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <div className={styles.whatsappCta}>
        <div className={styles.whatsappInner}>
          <div>
            <h3>محتاج مساعدة في الاختيار؟</h3>
            <p>تواصل معنا على واتساب وسنساعدك في إيجاد المنتج المناسب</p>
          </div>
          <a
            href="https://wa.me/00201097090024"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            💬 تواصل على واتساب
          </a>
        </div>
      </div>
    </>
  )
}
