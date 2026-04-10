import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartLine {
  id: string
  quantity: number
  linePriceWithTax: number
  productVariant: {
    id: string
    name: string
    price: number
    product: {
      name: string
      slug: string
      featuredAsset?: { preview: string }
    }
  }
}

interface CartState {
  lines: CartLine[]
  total: number
  isOpen: boolean
  setCart: (lines: CartLine[], total: number) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  itemCount: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      total: 0,
      isOpen: false,
      setCart: (lines, total) => set({ lines, total }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      itemCount: () => get().lines.reduce((acc, l) => acc + l.quantity, 0),
    }),
    { name: 'souq-adko-cart', partialize: (s) => ({ lines: s.lines, total: s.total }) }
  )
)
