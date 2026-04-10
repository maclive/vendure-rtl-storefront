import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { gqlClient, SEARCH_PRODUCTS, formatPrice } from '@/lib/vendure'
import styles from './search.module.css'

export const dynamic = 'force-dynamic'

interface Props { searchParams: { q?: string } }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return { title: searchParams.q ? `نتائج: ${searchParams.q}` : 'البحث' }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q || ''
  let results: any[] = []

  if (q) {
    try {
      const res = await gqlClient.request<any>(SEARCH_PRODUCTS, { term: q })
      results = res?.search?.items || []
    } catch {}
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {q ? <>نتائج البحث عن <span>"{q}"</span></> : 'البحث'}
        </h1>
        {q && <p className={styles.count}>{results.length} نتيجة</p>}

        {!q ? (
          <div className={styles.empty}>ابدأ بكتابة ما تبحث عنه في شريط البحث</div>
        ) : results.length === 0 ? (
          <div className={styles.empty}>
            <p>لا توجد نتائج لـ "{q}"</p>
            <Link href="/collections" className="btn-primary" style={{ marginTop: 16 }}>تصفح الأقسام</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {results.map((item: any) => {
              const price = item.priceWithTax?.value || item.priceWithTax?.min || 0
              return (
                <Link key={item.productId} href={`/products/${item.slug}`} className={styles.card}>
                  <div className={styles.imgWrap}>
                    {item.productAsset?.preview ? (
                      <Image
                        src={`${item.productAsset.preview}?w=300&h=300`}
                        alt={item.productName}
                        width={300}
                        height={300}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    ) : <span style={{ fontSize: 48 }}>🛍</span>}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardName}>{item.productName}</p>
                    <p className={styles.cardPrice}>{formatPrice(price)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
