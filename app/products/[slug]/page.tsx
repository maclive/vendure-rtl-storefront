'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { gqlClient, GET_PRODUCT_BY_SLUG, ADD_TO_CART, formatPrice } from '@/lib/vendure'
import { useCart } from '@/lib/store'
import styles from './product.module.css'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const { setCart, openCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    gqlClient.request<any>(GET_PRODUCT_BY_SLUG, { slug: params.slug })
      .then((d) => {
        const p = d?.product
        setProduct(p)
        setSelectedVariant(p?.variants?.[0])
      })
      .catch(() => toast.error('تعذر تحميل المنتج'))
      .finally(() => setLoading(false))
  }, [params.slug])

  const addToCart = async () => {
    if (!selectedVariant) return
    setAdding(true)
    try {
      const d = await gqlClient.request<any>(ADD_TO_CART, {
        variantId: selectedVariant.id,
        quantity: qty,
      })
      const order = d?.addItemToOrder
      if (order?.__typename === 'Order') {
        setCart(order.lines, order.totalWithTax)
        toast.success(`✓ أُضيف للسلة`)
        openCart()
        return true
      }
    } catch { toast.error('حدث خطأ') }
    finally { setAdding(false) }
    return false
  }

  const buyNow = async () => {
    const ok = await addToCart()
    if (ok) router.push('/checkout')
  }

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.skeleton} style={{ height: 400 }} />
    </div>
  )

  if (!product) return (
    <div className={styles.notFound}>
      <h1>المنتج غير موجود</h1>
      <Link href="/collections" className="btn-primary">تصفح المنتجات</Link>
    </div>
  )

  const images = product.assets?.length ? product.assets : (product.featuredAsset ? [product.featuredAsset] : [])
  const inStock = selectedVariant?.stockLevel !== 'OUT_OF_STOCK'

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="المسار">
          <Link href="/">الرئيسية</Link> ←{' '}
          {product.collections?.[0] && (
            <><Link href={`/collections/${product.collections[0].slug}`}>{product.collections[0].name}</Link> ← </>
          )}
          <span>{product.name}</span>
        </nav>

        <div className={styles.layout}>
          {/* Images */}
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              {images[activeImg]?.preview ? (
                <Image
                  src={`${images[activeImg].preview}?w=600&h=600`}
                  alt={product.name}
                  width={600}
                  height={600}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  priority
                />
              ) : (
                <span style={{ fontSize: 80 }}>🛍</span>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img: any, i: number) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`صورة ${i + 1}`}
                  >
                    <Image
                      src={`${img.preview}?w=80&h=80`}
                      alt=""
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            {product.collections?.[0] && (
              <Link href={`/collections/${product.collections[0].slug}`} className={styles.category}>
                {product.collections[0].name}
              </Link>
            )}

            <h1 className={styles.productName}>{product.name}</h1>

            <div className={styles.stars} aria-label="التقييم 4.8 من 5">
              ★★★★★ <span>(24 تقييم)</span>
            </div>

            <div className={styles.price} aria-label={`السعر ${formatPrice(selectedVariant?.price || 0)}`}>
              {formatPrice(selectedVariant?.price || 0, selectedVariant?.currencyCode)}
            </div>

            {/* Variants */}
            {product.variants?.length > 1 && (
              <div className={styles.variants}>
                <p className={styles.variantLabel}>الاختيار:</p>
                <div className={styles.variantBtns}>
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      className={`${styles.variantBtn} ${selectedVariant?.id === v.id ? styles.variantActive : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={styles.qtyRow}>
              <span className={styles.variantLabel}>الكمية:</span>
              <div className={styles.qtyCtrl}>
                <button className={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="تقليل">−</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button className={styles.qtyBtn} onClick={() => setQty(qty + 1)} aria-label="زيادة">+</button>
              </div>
              <span className={`${styles.stock} ${inStock ? styles.inStock : styles.outStock}`}>
                {inStock ? '✓ متوفر' : '✕ نفد المخزون'}
              </span>
            </div>

            {/* Actions */}
            {inStock ? (
              <div className={styles.actions}>
                <button className={styles.btnCart} onClick={addToCart} disabled={adding}>
                  {adding ? '...' : '🛒 أضف للسلة'}
                </button>
                <button className={styles.btnBuy} onClick={buyNow} disabled={adding}>
                  ⚡ اشتري الآن
                </button>
              </div>
            ) : (
              <button className={styles.btnDisabled} disabled>نفد المخزون</button>
            )}

            {/* Description */}
            {product.description && (
              <div className={styles.description}>
                <h2>وصف المنتج</h2>
                <p dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Trust badges */}
            <div className={styles.trust}>
              <span>🚚 شحن سريع</span>
              <span>↩️ إرجاع مجاني 14 يوم</span>
              <span>🔒 دفع آمن</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
