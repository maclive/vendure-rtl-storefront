import type { Metadata } from 'next'
import Link from 'next/link'
import { gqlClient, GET_PRODUCTS } from '@/lib/vendure'
import ProductCard from '@/components/product/ProductCard'
import styles from './collection.module.css'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
  searchParams: { sort?: string; page?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: decodeURIComponent(params.slug).replace(/-/g, ' '),
    description: `تسوق منتجات ${decodeURIComponent(params.slug)} في سوق إدكو`,
  }
}

const SORT_OPTIONS: Record<string, any> = {
  newest:   { createdAt: { direction: 'DESC' } },
  oldest:   { createdAt: { direction: 'ASC' } },
  price_asc:  { price: { direction: 'ASC' } },
  price_desc: { price: { direction: 'DESC' } },
  name:     { name: { direction: 'ASC' } },
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const slug = params.slug
  const sortKey = searchParams.sort || 'newest'
  const page = Number(searchParams.page || 1)
  const perPage = 12
  const skip = (page - 1) * perPage

  let products: any[] = []
  let totalItems = 0

  try {
    const res = await gqlClient.request<any>(GET_PRODUCTS, {
      take: perPage,
      skip,
      sort: SORT_OPTIONS[sortKey],
    })
    products = res?.products?.items || []
    totalItems = res?.products?.totalItems || 0
  } catch {}

  const totalPages = Math.ceil(totalItems / perPage)
  const collectionName = slug.replace(/-/g, ' ')

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="المسار">
          <Link href="/">الرئيسية</Link> ←{' '}
          <Link href="/collections">الأقسام</Link> ←{' '}
          <span>{collectionName}</span>
        </nav>

        <div className={styles.header}>
          <h1 className={styles.title}>{collectionName}</h1>
          <span className={styles.count}>{totalItems} منتج</span>
        </div>

        {/* Filters */}
        <div className={styles.filtersBar}>
          <span className={styles.filterLabel}>ترتيب حسب:</span>
          {[
            { key: 'newest',    label: 'الأحدث' },
            { key: 'price_asc', label: 'السعر: الأقل' },
            { key: 'price_desc',label: 'السعر: الأعلى' },
            { key: 'name',      label: 'الاسم' },
          ].map((opt) => (
            <Link
              key={opt.key}
              href={`/collections/${slug}?sort=${opt.key}`}
              className={`${styles.chip} ${sortKey === opt.key ? styles.chipActive : ''}`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>لا توجد منتجات في هذا القسم حالياً</p>
            <Link href="/collections" className="btn-primary" style={{ marginTop: 16 }}>
              تصفح الأقسام الأخرى
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="الصفحات">
            {page > 1 && (
              <Link href={`/collections/${slug}?sort=${sortKey}&page=${page - 1}`} className={styles.pageBtn}>
                ← السابق
              </Link>
            )}
            <span className={styles.pageInfo}>صفحة {page} من {totalPages}</span>
            {page < totalPages && (
              <Link href={`/collections/${slug}?sort=${sortKey}&page=${page + 1}`} className={styles.pageBtn}>
                التالي →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
