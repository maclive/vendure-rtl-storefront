'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store'
import { gqlClient, GET_COLLECTIONS } from '@/lib/vendure'
import styles from './Header.module.css'

export default function Header() {
  const { itemCount, toggleCart } = useCart()
  const [collections, setCollections] = useState<{ id: string; name: string; slug: string }[]>([])
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    gqlClient.request<any>(GET_COLLECTIONS).then((d) => {
      setCollections(d?.collections?.items || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const count = itemCount()

  return (
    <>
      <div className={styles.topbar}>
        🎉 شحن مجاني على الطلبات فوق 500 ج.م — استخدم كود: <strong>ADKO20</strong>
      </div>

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="سوق إدكو - الرئيسية">
            🛍 سوق <span>إدكو</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="التنقل الرئيسي">
            <Link href="/" className={styles.navLink}>الرئيسية</Link>
            {collections.slice(0, 4).map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className={styles.navLink}>
                {c.name}
              </Link>
            ))}
            <Link href="/collections" className={styles.navLink}>كل الأقسام</Link>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search (desktop) */}
            <form onSubmit={handleSearch} className={styles.searchForm} role="search">
              <input
                ref={inputRef}
                type="search"
                className={styles.searchInput}
                placeholder="ابحث عن منتجات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="بحث عن منتجات"
              />
              <button type="submit" className={styles.searchBtn} aria-label="بحث">🔍</button>
            </form>

            <Link href="/account" className={styles.iconBtn} aria-label="حسابي">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            <button
              className={styles.iconBtn}
              onClick={toggleCart}
              aria-label={`السلة - ${count} عناصر`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {count > 0 && (
                <span className={styles.cartBadge} aria-hidden="true">{count}</span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="القائمة"
              aria-expanded={menuOpen}
            >
              <span className={`${styles.menuIcon} ${menuOpen ? styles.open : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className={styles.mobileMenu} aria-label="التنقل المحمول">
            <form onSubmit={handleSearch} className={styles.mobileSearch}>
              <input
                type="search"
                placeholder="ابحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="بحث"
              />
              <button type="submit">🔍</button>
            </form>
            <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>الرئيسية</Link>
            {collections.map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                {c.name}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
