'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useCart } from '@/lib/store'
import { gqlClient, ADJUST_QTY, REMOVE_FROM_CART, GET_ACTIVE_ORDER, formatPrice } from '@/lib/vendure'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { lines, total, isOpen, closeCart, setCart } = useCart()

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [closeCart])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const changeQty = async (lineId: string, qty: number) => {
    try {
      if (qty === 0) {
        const d = await gqlClient.request<any>(REMOVE_FROM_CART, { lineId })
        const o = d?.removeOrderLine
        if (o?.__typename === 'Order') setCart(o.lines, o.totalWithTax)
      } else {
        const d = await gqlClient.request<any>(ADJUST_QTY, { lineId, quantity: qty })
        const o = d?.adjustOrderLine
        if (o?.__typename === 'Order') setCart(o.lines, o.totalWithTax)
      }
    } catch {
      toast.error('حدث خطأ')
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="سلة التسوق"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>🛒 سلة التسوق</h2>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="إغلاق السلة">✕</button>
        </div>

        <div className={styles.items}>
          {lines.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🛍</span>
              <p>السلة فارغة</p>
              <button className={styles.continueShopping} onClick={closeCart}>
                تابع التسوق
              </button>
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.id} className={styles.item}>
                <div className={styles.itemImg}>
                  {line.productVariant.product.featuredAsset?.preview ? (
                    <Image
                      src={`${line.productVariant.product.featuredAsset.preview}?w=80&h=80`}
                      alt={line.productVariant.product.name}
                      width={72}
                      height={72}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    <span style={{ fontSize: 32 }}>🛍</span>
                  )}
                </div>

                <div className={styles.itemInfo}>
                  <Link
                    href={`/products/${line.productVariant.product.slug}`}
                    className={styles.itemName}
                    onClick={closeCart}
                  >
                    {line.productVariant.product.name}
                  </Link>
                  <p className={styles.itemVariant}>{line.productVariant.name}</p>
                  <p className={styles.itemPrice}>{formatPrice(line.linePriceWithTax)}</p>

                  <div className={styles.qty}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => changeQty(line.id, line.quantity - 1)}
                      aria-label="تقليل الكمية"
                    >−</button>
                    <span className={styles.qtyNum} aria-label={`الكمية: ${line.quantity}`}>
                      {line.quantity}
                    </span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => changeQty(line.id, line.quantity + 1)}
                      aria-label="زيادة الكمية"
                    >+</button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => changeQty(line.id, 0)}
                      aria-label="حذف المنتج"
                    >🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>الإجمالي الفرعي</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className={styles.shippingNote}>🚚 الشحن يُحسب عند إتمام الطلب</p>
            <Link href="/checkout" className={styles.checkoutBtn} onClick={closeCart}>
              إتمام الشراء ←
            </Link>
            <button className={styles.continueBtn} onClick={closeCart}>
              متابعة التسوق
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
