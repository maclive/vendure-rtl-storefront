'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useCart } from '@/lib/store'
import {
  gqlClient, SET_CUSTOMER, SET_SHIPPING_ADDRESS,
  GET_SHIPPING_METHODS, SET_SHIPPING_METHOD,
  TRANSITION_ORDER, ADD_PAYMENT, formatPrice
} from '@/lib/vendure'
import styles from './checkout.module.css'

const EGYPT_GOVERNORATES = [
  'القاهرة','الجيزة','الإسكندرية','الدقهلية','البحر الأحمر','البحيرة','الفيوم','الغربية',
  'الإسماعيلية','المنوفية','المنيا','القليوبية','الوادي الجديد','السويس','أسوان','أسيوط',
  'بني سويف','بورسعيد','دمياط','جنوب سيناء','كفر الشيخ','مطروح','الأقصر','قنا',
  'شمال سيناء','الشرقية','سوهاج',
]

interface FormData {
  firstName: string
  lastName: string
  phoneNumber: string
  streetLine1: string
  city: string
  province: string
  area: string
  notes: string
}

export default function CheckoutPage() {
  const { lines, total, setCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderCode, setOrderCode] = useState('')
  const [done, setDone] = useState(false)

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    streetLine1: '',
    city: 'إدكو',
    province: 'البحيرة',
    area: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const setField = (key: keyof FormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.firstName.trim()) e.firstName = 'مطلوب'
    if (!form.lastName.trim()) e.lastName = 'مطلوب'
    if (!form.phoneNumber.match(/^(01)[0-9]{9}$/)) e.phoneNumber = 'رقم موبايل غير صحيح'
    if (!form.streetLine1.trim()) e.streetLine1 = 'مطلوب'
    if (!form.city.trim()) e.city = 'مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      // Step 1: Set customer
      const customerRes = await gqlClient.request<any>(SET_CUSTOMER, {
        input: {
          firstName: form.firstName,
          lastName: form.lastName,
          emailAddress: `${form.phoneNumber}@guest.souqedku.com`,
          phoneNumber: form.phoneNumber,
        },
      })

      const customerResult = customerRes?.setCustomerForOrder
      if (customerResult?.errorCode && customerResult.errorCode !== 'ALREADY_LOGGED_IN_ERROR') {
        toast.error(`خطأ في البيانات: ${customerResult.message}`)
        setLoading(false)
        return
      }

      // Step 2: Set shipping address
      const addrRes = await gqlClient.request<any>(SET_SHIPPING_ADDRESS, {
        input: {
          fullName: `${form.firstName} ${form.lastName}`,
          streetLine1: form.streetLine1,
          streetLine2: form.area || '',
          city: form.city,
          province: form.province,
          countryCode: 'EG',
          phoneNumber: form.phoneNumber,
        },
      })

      if (addrRes?.setOrderShippingAddress?.errorCode) {
        toast.error('خطأ في العنوان، يرجى المحاولة مرة أخرى')
        setLoading(false)
        return
      }

      // Step 3: Get shipping methods and set first available
      const methodsRes = await gqlClient.request<any>(GET_SHIPPING_METHODS)
      const methods = methodsRes?.eligibleShippingMethods || []

      if (methods.length > 0) {
        await gqlClient.request(SET_SHIPPING_METHOD, { id: [methods[0].id] })
      }

      // Step 4: Transition to ArrangingPayment
      const transRes = await gqlClient.request<any>(TRANSITION_ORDER, {
        state: 'ArrangingPayment',
      })

      if (transRes?.transitionOrderToState?.errorCode) {
        // Try to handle if already in correct state
        const errCode = transRes.transitionOrderToState.errorCode
        if (errCode !== 'ORDER_STATE_TRANSITION_ERROR') {
          toast.error('خطأ في معالجة الطلب')
          setLoading(false)
          return
        }
      }

      // Step 5: Add payment (cash on delivery)
      const payRes = await gqlClient.request<any>(ADD_PAYMENT, {
        input: {
          method: 'cash-on-delivery',
          metadata: {
            notes: form.notes || '',
            phone: form.phoneNumber,
          },
        },
      })

      const order = payRes?.addPaymentToOrder
      if (order?.code) {
        setOrderCode(order.code)
        setCart([], 0)
        setDone(true)
      } else if (order?.errorCode) {
        toast.error(`فشل الدفع: ${order.message || 'يرجى المحاولة مرة أخرى'}`)
      } else {
        toast.error('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      const msg = err?.response?.errors?.[0]?.message || ''
      if (msg.includes('No active order')) {
        toast.error('السلة فارغة أو انتهت الجلسة، يرجى إضافة منتجات مرة أخرى')
      } else {
        toast.error('تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Done ──
  if (done) {
    return (
      <div className={styles.donePage}>
        <div className={styles.doneCard}>
          <div className={styles.doneIcon}>✅</div>
          <h1>تم استلام طلبك!</h1>
          <p className={styles.doneCode}>رقم الطلب: <strong>#{orderCode}</strong></p>
          <p className={styles.doneMsg}>
            شكراً لك! سيتواصل معك فريقنا على رقم <strong>{form.phoneNumber}</strong> خلال 24 ساعة لتأكيد الطلب وترتيب التوصيل.
          </p>
          <a href={`https://wa.me/00201097090024?text=مرحباً، طلبي رقم ${orderCode}`}
            target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
            💬 تابع طلبك على واتساب
          </a>
          <Link href="/" className={styles.doneHome}>العودة للرئيسية</Link>
        </div>
      </div>
    )
  }

  // ── Empty cart ──
  if (lines.length === 0) {
    return (
      <div className={styles.donePage}>
        <div className={styles.doneCard}>
          <div className={styles.doneIcon}>🛒</div>
          <h1>السلة فارغة</h1>
          <p>أضف منتجات للسلة أولاً</p>
          <Link href="/" className={styles.doneHome}>تسوق الآن</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link> ← <span>إتمام الطلب</span>
        </nav>
        <h1 className={styles.pageTitle}>إتمام الطلب</h1>

        <div className={styles.layout}>
          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            {/* Personal Info */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>١</span>
                بياناتك الشخصية
              </h2>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="firstName">الاسم الأول <span className={styles.req}>*</span></label>
                  <input id="firstName" type="text" placeholder="مثال: محمد"
                    value={form.firstName} onChange={e => setField('firstName', e.target.value)}
                    className={errors.firstName ? styles.inputErr : ''} />
                  {errors.firstName && <span className={styles.errMsg}>{errors.firstName}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="lastName">الاسم الأخير <span className={styles.req}>*</span></label>
                  <input id="lastName" type="text" placeholder="مثال: أحمد"
                    value={form.lastName} onChange={e => setField('lastName', e.target.value)}
                    className={errors.lastName ? styles.inputErr : ''} />
                  {errors.lastName && <span className={styles.errMsg}>{errors.lastName}</span>}
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="phone">رقم الموبايل <span className={styles.req}>*</span></label>
                <input id="phone" type="tel" placeholder="01012345678"
                  value={form.phoneNumber} onChange={e => setField('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? styles.inputErr : ''}
                  maxLength={11} style={{ direction: 'ltr', textAlign: 'right' }} />
                {errors.phoneNumber && <span className={styles.errMsg}>{errors.phoneNumber}</span>}
              </div>
            </section>

            {/* Address */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>٢</span>
                عنوان التوصيل
              </h2>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="province">المحافظة <span className={styles.req}>*</span></label>
                  <select id="province" value={form.province}
                    onChange={e => setField('province', e.target.value)}>
                    {EGYPT_GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="city">المدينة / المركز <span className={styles.req}>*</span></label>
                  <input id="city" type="text" placeholder="مثال: إدكو"
                    value={form.city} onChange={e => setField('city', e.target.value)}
                    className={errors.city ? styles.inputErr : ''} />
                  {errors.city && <span className={styles.errMsg}>{errors.city}</span>}
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="area">المنطقة / الحي</label>
                <input id="area" type="text" placeholder="مثال: إدكو البلد، شارع..."
                  value={form.area} onChange={e => setField('area', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="street">العنوان التفصيلي <span className={styles.req}>*</span></label>
                <input id="street" type="text"
                  placeholder="مثال: شارع الجمهورية، أمام مسجد..."
                  value={form.streetLine1} onChange={e => setField('streetLine1', e.target.value)}
                  className={errors.streetLine1 ? styles.inputErr : ''} />
                {errors.streetLine1 && <span className={styles.errMsg}>{errors.streetLine1}</span>}
              </div>
              <div className={styles.field}>
                <label htmlFor="notes">ملاحظات للمندوب (اختياري)</label>
                <textarea id="notes" rows={3}
                  placeholder="أي تعليمات إضافية للتوصيل..."
                  value={form.notes} onChange={e => setField('notes', e.target.value)} />
              </div>
            </section>

            {/* Payment */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>٣</span>
                طريقة الدفع
              </h2>
              <div className={styles.payOption}>
                <span className={styles.payIcon}>💵</span>
                <div>
                  <strong>الدفع عند الاستلام</strong>
                  <span>ادفع نقداً عند وصول الطلب</span>
                </div>
                <span className={styles.payCheck}>✓</span>
              </div>
            </section>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? <><span className={styles.spinner} /> جاري إرسال الطلب...</>
                : '✓ تأكيد وإرسال الطلب'
              }
            </button>
            <p className={styles.secureNote}>🔒 بياناتك آمنة ومحمية</p>
          </form>

          {/* Summary */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>ملخص طلبك</h2>
            <div className={styles.summaryItems}>
              {lines.map(line => (
                <div key={line.id} className={styles.summaryItem}>
                  <div className={styles.summaryImg}>
                    {line.productVariant.product.featuredAsset?.preview ? (
                      <Image
                        src={`${line.productVariant.product.featuredAsset.preview}?w=60&h=60`}
                        alt={line.productVariant.product.name}
                        width={52} height={52}
                        style={{ objectFit: 'cover', borderRadius: 6 }}
                      />
                    ) : <span style={{ fontSize: 24 }}>🛍</span>}
                    <span className={styles.summaryQty}>{line.quantity}</span>
                  </div>
                  <div className={styles.summaryItemInfo}>
                    <p className={styles.summaryItemName}>{line.productVariant.product.name}</p>
                    <p className={styles.summaryItemPrice}>{formatPrice(line.linePriceWithTax)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>المجموع الفرعي</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>الشحن</span>
                <span className={styles.summaryShipping}>يُحسب لاحقاً</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>الإجمالي</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
