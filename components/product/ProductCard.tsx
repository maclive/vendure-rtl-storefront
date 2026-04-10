'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { gqlClient, ADD_TO_CART, GET_ACTIVE_ORDER, formatPrice } from '@/lib/vendure'
import { useCart } from '@/lib/store'
import styles from './ProductCard.module.css'

interface Props {
  product: {
    id: string
    name: string
    slug: string
    description?: string
    featuredAsset?: { preview: string }
    variants: { id: string; price: number; currencyCode: string; stockLevel?: string }[]
    collections?: { slug: string; name: string }[]
  }
}

export default function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const { setCart, openCart } = useCart()
  const router = useRouter()

  const variant = product.variants?.[0]
  const price = variant?.price ?? 0
  const inStock = variant?.stockLevel !== 'OUT_OF_STOCK'
  const category = product.collections?.[0]?.name

  const addToCartMutation = async () => {
    if (!variant) return
    setLoading(true)
    try {
      const data = await gqlClient.request<any>(ADD_TO_CART, {
        variantId: variant.id,
        quantity: 1,
      })
      const order = data?.addItemToOrder
      if (order?.__typename === 'Order') {
        setCart(order.lines, order.totalWithTax)
        return true
      } else {
        toast.error('حدث خطأ، حاول مرة أخرى')
        return false
      }
    } catch {
      toast.error('تعذر الاتصال بالخادم')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    const ok = await addToCartMutation()
    if (ok) {
      toast.success(`✓ أُضيف "${product.name}" للسلة`)
      openCart()
    }
  }

  const handleBuyNow = async () => {
    const ok = await addToCartMutation()
    if (ok) router.push('/checkout')
  }

  return (
    <article className={styles.card}>
      <div className={styles.imgWrap}>
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          {product.featuredAsset?.preview ? (
            <Image
              src={`${product.featuredAsset.preview}?w=400&h=400`}
              alt={product.name}
              width={400}
              height={400}
              className={styles.img}
              loading="lazy"
            />
          ) : (
            <div className={styles.imgPlaceholder} aria-hidden="true">🛍</div>
          )}
        </Link>

        {!inStock && <span className={`${styles.badge} ${styles.badgeOut}`}>نفد المخزون</span>}

        <button
          className={`${styles.wishBtn} ${wishlist ? styles.wishActive : ''}`}
          onClick={() => {
            setWishlist(!wishlist)
            toast(wishlist ? 'حُذف من المفضلة' : '❤ أُضيف للمفضلة')
          }}
          aria-label={wishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          {wishlist ? '❤' : '♡'}
        </button>
      </div>

      <div className={styles.body}>
        {category && <p className={styles.category}>{category}</p>}

        <Link href={`/products/${product.slug}`} className={styles.name}>
          {product.name}
        </Link>

        <div className={styles.stars} aria-label="التقييم">
          ★★★★★ <span className={styles.starsCount}>(24)</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.price} aria-label={`السعر: ${formatPrice(price)}`}>
            {formatPrice(price, variant?.currencyCode)}
          </div>
        </div>

        {inStock ? (
          <div className={styles.actions}>
            <button
              className={styles.btnCart}
              onClick={handleAddToCart}
              disabled={loading}
              aria-label={`أضف ${product.name} للسلة`}
            >
              {loading ? '...' : '🛒 أضف للسلة'}
            </button>
            <button
              className={styles.btnBuy}
              onClick={handleBuyNow}
              disabled={loading}
              aria-label={`اشتري ${product.name} الآن`}
            >
              ⚡ اشتري الآن
            </button>
          </div>
        ) : (
          <button className={styles.btnDisabled} disabled>نفد المخزون</button>
        )}
      </div>
    </article>
  )
}
