'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useCart } from '@/lib/store'
import { gqlClient, SET_CUSTOMER, SET_SHIPPING_ADDRESS, GET_SHIPPING_METHODS, SET_SHIPPING_METHOD, TRANSITION_TO_ARRANGING, ADD_PAYMENT, formatPrice } from '@/lib/vendure'
import styles from './checkout.module.css'

const EGYPT_GOVERNORATES = [
  'القاهرة','الجيزة','الإسكندرية','الدقهلية','البحر الأحمر','البحيرة','الفيوم','الغربية',
  'الإسماعيلية','المنوفية','المنيا','القليوبية','الوادي الجديد','السويس','أسوان','أسيوط',
  'بني سويف','بورسعيد','دمياط','جنوب سيناء','كفر الشيخ','مطروح','الأقصر','قنا',
  'شمال سيناء','الشرقية','سوهاج',
]

const ADKO_AREAS = [
  'إدكو المركز','إدكو البلد','كفر عزاز','أبو طبل','المحمودية','رشيد','شبراخيت','أبو المطامير',
]

interface FormData {
  firstName: string
  lastName: string
  phoneNumber: string
  streetLine1: string
  city: string
  province: string
  area: string
  paymentMethod: string
  notes: string
}

export default function CheckoutPage() {
  const { lines, total, setCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form')
  const [loading, setLoading] = useState(false)
  const [orderCode, setOrderCode] = useState('')

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    streetLine1: '',
    city: '',
    province: 'البحيرة',
    area: '',
    paymentMethod: 'cash',
    notes: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const set = (key: keyof FormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.firstName.trim()) e.firstName = 'الاسم الأول مطلوب'
    if (!form.lastName.trim()) e.lastName = 'الاسم الأخير مطلوب'
    if (!form.phoneNumber.match(/^(01)[0-9]{9}$/)) e.phoneNumber = 'رقم موبايل مصري غير صحيح (مثال: 01012345678)'
    if (!form.streetLine1.trim()) e.streetLine1 = 'العنوان التفصيلي مطلوب'
    if (!form.city.trim()) e.city = 'المدينة مطلوبة'
    if (!form.area.trim()) e.area = 'المنطقة مطلوبة'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      // 1. Set customer info
      await gqlClient.request(SET_CUSTOMER, {
        input: {
          firstName: form.firstName,
          lastName: form.lastName,
          emailAddress: `${form.phoneNumber}@souq-adko.com`,
          phoneNumber: form.phoneNumber,
        },
      })

      // 2. Set shipping address
      await gqlClient.request(SET_SHIPPING_ADDRESS, {
        input: {
          fullName: `${form.firstName} ${form.lastName}`,
          streetLine1: form.streetLine1,
          streetLine2: form.area,
          city: form.city,
          province: form.province,
          countryCode: 'EG',
          phoneNumber: form.phoneNumber,
        },
      })

      // 3. Get & set shipping method
      const methodsRes = await gqlClient.request<any>(GET_SHIPPING_METHODS)
      const methods = methodsRes?.eligibleShippingMethods || []
      if (methods.length > 0) {
        await gqlClient.request(SET_SHIPPING_METHOD, { id: [methods[0].id] })
      }

      // 4. Transition to ArrangingPayment
      await gqlClient.request(TRANSITION_TO_ARRANGING)

      // 5. Add payment (cash on delivery)
      const payRes = await gqlClient.request<any>(ADD_PAYMENT, {
        input: { method: 'cash-on-delivery', metadata: { notes: form.notes } },
      })

      const order = payRes?.addPaymentToOrder
      if (order?.code) {
        setOrderCode(order.code)
        setCart([], 0)
        setStep('done')
      } else {
        toast.error('حدث خطأ في إتمام الطلب، يرجى المحاولة مرة أخرى')
      }
    } catch (err) {
      console.error(err)
      toast.error('تعذر إتمام الطلب، تحقق من الاتصال')
    } finally {
      setLoading(false)
    }
  }

  // ── Done ──────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className={styles.donePage}>
        <div className={styles.doneCard}>
          <div className={styles.doneIcon}>✅</div>
          <h1>تم استلام طلبك!</h1>
          <p className={styles.doneCode}>رقم الطلب: <strong>#{orderCode}</strong></p>
          <p className={styles.doneMsg}>
            شكراً لك! سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الطلب وترتيب التوصيل.
          </p>
          <div className={styles.doneBtns}>
            <Link href="/" className={styles.doneHome}>العودة للرئيسية</Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Empty cart ─────────────────────────────────────────────
  if (lines.length === 0) {
    return (
      <div className={styles.donePage}>
        <div className={styles.doneCard}>
          <div className={styles.doneIcon}>🛒</div>
          <h1>السلة فارغة</h1>
          <p>أضف منتجات للسلة أولاً</p>
          <Link href="/" className={styles.doneHome} style={{ marginTop: 20 }}>تسوق الآن</Link>
        </div>
      </div>
    )
  }

  // ── Checkout form ──────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="المسار">
          <Link href="/">الرئيسية</Link> ← <Link href="/cart">السلة</Link> ← <span>إتمام الطلب</span>
        </nav>

        <h1 className={styles.pageTitle}>إتمام الطلب</h1>

        <div className={styles.layout}>
          {/* ── Form ── */}
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
                  <input
                    id="firstName"
                    type="text"
                    placeholder="مثال: محمد"
                    value={form.firstName}
                    onChange={e => set('firstName', e.target.value)}
                    className={errors.firstName ? styles.inputErr : ''}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <span className={styles.errMsg}>{errors.firstName}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="lastName">الاسم الأخير <span className={styles.req}>*</span></label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="مثال: أحمد"
                    value={form.lastName}
                    onChange={e => set('lastName', e.target.value)}
                    className={errors.lastName ? styles.inputErr : ''}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <span className={styles.errMsg}>{errors.lastName}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">رقم الموبايل <span className={styles.req}>*</span></label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="01012345678"
                  value={form.phoneNumber}
                  onChange={e => set('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? styles.inputErr : ''}
                  autoComplete="tel"
                  maxLength={11}
                  style={{ direction: 'ltr', textAlign: 'right' }}
                />
                {errors.phoneNumber && <span className={styles.errMsg}>{errors.phoneNumber}</span>}
              </div>
            </section>

            {/* Delivery Address */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>٢</span>
                عنوان التوصيل
              </h2>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="province">المحافظة <span className={styles.req}>*</span></label>
                  <select
                    id="province"
                    value={form.province}
                    onChange={e => set('province', e.target.value)}
                  >
                    {EGYPT_GOVERNORATES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="city">المدينة / المركز <span className={styles.req}>*</span></label>
                  <input
                    id="city"
                    type="text"
                    placeholder="مثال: إدكو"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    className={errors.city ? styles.inputErr : ''}
                    autoComplete="address-level2"
                  />
                  {errors.city && <span className={styles.errMsg}>{errors.city}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="area">المنطقة / الحي <span className={styles.req}>*</span></label>
                <input
                  id="area"
                  type="text"
                  placeholder="مثال: إدكو البلد، أبو طبل..."
                  value={form.area}
                  onChange={e => set('area', e.target.value)}
                  className={errors.area ? styles.inputErr : ''}
                  list="areas-list"
                />
                <datalist id="areas-list">
                  {ADKO_AREAS.map(a => <option key={a} value={a} />)}
                </datalist>
                {errors.area && <span className={styles.errMsg}>{errors.area}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="street">العنوان التفصيلي <span className={styles.req}>*</span></label>
                <input
                  id="street"
                  type="text"
                  placeholder="مثال: شارع الجمهورية، أمام مسجد النور، بجانب..."
                  value={form.streetLine1}
                  onChange={e => set('streetLine1', e.target.value)}
                  className={errors.streetLine1 ? styles.inputErr : ''}
                  autoComplete="street-address"
                />
                {errors.streetLine1 && <span className={styles.errMsg}>{errors.streetLine1}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="notes">ملاحظات للتوصيل (اختياري)</label>
                <textarea
                  id="notes"
                  placeholder="أي تعليمات إضافية للمندوب..."
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </section>

            {/* Payment Method */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>٣</span>
                طريقة الدفع
              </h2>

              <div className={styles.paymentOptions}>
                <label className={`${styles.payOption} ${form.paymentMethod === 'cash' ? styles.paySelected : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={form.paymentMethod === 'cash'}
                    onChange={() => set('paymentMethod', 'cash')}
                  />
                  <span className={styles.payIcon}>💵</span>
                  <div>
                    <strong>الدفع عند الاستلام</strong>
                    <span>ادفع نقداً عند وصول الطلب</span>
                  </div>
                </label>

                <label className={`${styles.payOption} ${form.paymentMethod === 'instapay' ? styles.paySelected : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="instapay"
                    checked={form.paymentMethod === 'instapay'}
                    onChange={() => set('paymentMethod', 'instapay')}
                  />
                  <span className={styles.payIcon}>📱</span>
                  <div>
                    <strong>إنستا باي / محفظة</strong>
                    <span>Vodafone Cash, Orange Money, InstaPay</span>
                  </div>
                </label>
              </div>
            </section>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              aria-label="تأكيد وإرسال الطلب"
            >
              {loading ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                '✓ تأكيد وإرسال الطلب'
              )}
            </button>

            <p className={styles.secureNote}>🔒 بياناتك آمنة ومحمية</p>
          </form>

          {/* ── Order Summary ── */}
          <aside className={styles.summary} aria-label="ملخص الطلب">
            <h2 className={styles.summaryTitle}>ملخص طلبك</h2>

            <div className={styles.summaryItems}>
              {lines.map(line => (
                <div key={line.id} className={styles.summaryItem}>
                  <div className={styles.summaryImg}>
                    {line.productVariant.product.featuredAsset?.preview ? (
                      <Image
                        src={`${line.productVariant.product.featuredAsset.preview}?w=60&h=60`}
                        alt={line.productVariant.product.name}
                        width={52}
                        height={52}
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
