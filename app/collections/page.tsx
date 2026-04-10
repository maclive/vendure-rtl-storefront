import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { gqlClient, GET_COLLECTIONS } from '@/lib/vendure'
import styles from './collections.module.css'

export const metadata: Metadata = {
  title: 'كل الأقسام',
  description: 'تصفح جميع أقسام سوق إدكو — ملابس، إلكترونيات، عطور وأكثر',
}

export const dynamic = 'force-dynamic'

export default async function CollectionsPage() {
  let collections: any[] = []
  try {
    const res = await gqlClient.request<any>(GET_COLLECTIONS)
    collections = res?.collections?.items || []
  } catch {}

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="المسار">
          <Link href="/">الرئيسية</Link> ← <span>الأقسام</span>
        </nav>
        <h1 className={styles.title}>كل <span>الأقسام</span></h1>
        <div className={styles.grid}>
          {collections.length === 0 && (
            <p style={{ color: 'var(--c-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '60px 0' }}>
              لا توجد أقسام حالياً
            </p>
          )}
          {collections.map((col: any) => (
            <Link key={col.id} href={`/collections/${col.slug}`} className={styles.card}>
              <div className={styles.imgWrap}>
                {col.featuredAsset?.preview ? (
                  <Image
                    src={`${col.featuredAsset.preview}?w=400&h=300`}
                    alt={col.name}
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <span className={styles.placeholder} aria-hidden="true">🛍</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h2>{col.name}</h2>
                <span>تسوق الآن ←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

  let collections: any[] = []
  try {
    const res = await gqlClient.request<any>(GET_COLLECTIONS)
    collections = res?.collections?.items || []
  } catch {}

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="المسار">
          <Link href="/">الرئيسية</Link> ← <span>الأقسام</span>
        </nav>
        <h1 className={styles.title}>كل <span>الأقسام</span></h1>

        <div className={styles.grid}>
          {collections.map((col: any) => (
            <Link key={col.id} href={`/collections/${col.slug}`} className={styles.card}>
              <div className={styles.imgWrap}>
                {col.featuredAsset?.preview ? (
                  <Image
                    src={`${col.featuredAsset.preview}?w=400&h=300`}
                    alt={col.name}
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <span className={styles.placeholder} aria-hidden="true">🛍</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h2>{col.name}</h2>
                <span>تسوق الآن ←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
