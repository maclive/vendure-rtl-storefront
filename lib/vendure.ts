import { GraphQLClient } from 'graphql-request'

const VENDURE_API = process.env.NEXT_PUBLIC_VENDURE_API || 'https://bramjlive.com/shop-api'

export const gqlClient = new GraphQLClient(VENDURE_API, {
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
})

// Client with auth token for checkout operations
export function getAuthClient(token?: string) {
  return new GraphQLClient(VENDURE_API, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  })
}

// ─── Queries ───────────────────────────────────────────────

export const GET_COLLECTIONS = `
  query GetCollections {
    collections(options: { topLevelOnly: true }) {
      items {
        id
        name
        slug
        featuredAsset { preview }
      }
    }
  }
`

export const GET_PRODUCTS = `
  query GetProducts($take: Int, $skip: Int, $sort: ProductSortParameter) {
    products(options: {
      take: $take
      skip: $skip
      sort: $sort
      filter: { enabled: { eq: true } }
    }) {
      totalItems
      items {
        id
        name
        slug
        description
        featuredAsset { preview }
        variants {
          id
          price
          currencyCode
          stockLevel
        }
        collections { slug name }
      }
    }
  }
`

export const GET_PRODUCT_BY_SLUG = `
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset { preview }
      assets { preview }
      variants {
        id
        name
        price
        currencyCode
        stockLevel
        options { name groupId }
      }
      collections { slug name }
    }
  }
`

export const SEARCH_PRODUCTS = `
  query Search($term: String!) {
    search(input: { term: $term, take: 12, groupByProduct: true }) {
      items {
        productId
        productName
        slug
        productAsset { preview }
        priceWithTax {
          ... on SinglePrice { value }
          ... on PriceRange { min max }
        }
        collectionIds
      }
    }
  }
`

// ─── Cart Mutations ─────────────────────────────────────────

export const ADD_TO_CART = `
  mutation AddToCart($variantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
      __typename
      ... on Order {
        id
        totalWithTax
        lines {
          id
          quantity
          linePriceWithTax
          productVariant {
            id
            name
            product { name slug featuredAsset { preview } }
          }
        }
      }
      ... on ErrorResult { errorCode message }
    }
  }
`

export const GET_ACTIVE_ORDER = `
  query GetOrder {
    activeOrder {
      id
      totalWithTax
      subTotalWithTax
      shippingWithTax
      lines {
        id
        quantity
        linePriceWithTax
        productVariant {
          id
          name
          price
          product { name slug featuredAsset { preview } }
        }
      }
    }
  }
`

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($lineId: ID!) {
    removeOrderLine(orderLineId: $lineId) {
      __typename
      ... on Order { id totalWithTax lines { id quantity } }
      ... on ErrorResult { errorCode message }
    }
  }
`

export const ADJUST_QTY = `
  mutation AdjustQty($lineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
      __typename
      ... on Order { id totalWithTax lines { id quantity linePriceWithTax } }
      ... on ErrorResult { errorCode message }
    }
  }
`

// ─── Checkout Mutations ────────────────────────────────────

export const SET_CUSTOMER = `
  mutation SetCustomer($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      __typename
      ... on Order { id }
      ... on ErrorResult { errorCode message }
      ... on AlreadyLoggedInError { errorCode message }
      ... on EmailAddressConflictError { errorCode message }
      ... on NoActiveOrderError { errorCode message }
      ... on GuestCheckoutError { errorCode message }
    }
  }
`

export const SET_SHIPPING_ADDRESS = `
  mutation SetShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      __typename
      ... on Order { id state }
      ... on ErrorResult { errorCode message }
      ... on NoActiveOrderError { errorCode message }
    }
  }
`

export const GET_SHIPPING_METHODS = `
  query GetShippingMethods {
    eligibleShippingMethods {
      id
      name
      description
      priceWithTax
    }
  }
`

export const SET_SHIPPING_METHOD = `
  mutation SetShippingMethod($id: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $id) {
      __typename
      ... on Order { id shippingWithTax }
      ... on ErrorResult { errorCode message }
      ... on OrderModificationError { errorCode message }
      ... on NoActiveOrderError { errorCode message }
    }
  }
`

export const TRANSITION_ORDER = `
  mutation TransitionOrder($state: String!) {
    transitionOrderToState(state: $state) {
      __typename
      ... on Order { id state code }
      ... on OrderStateTransitionError { errorCode message transitionError }
    }
  }
`

export const ADD_PAYMENT = `
  mutation AddPayment($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      __typename
      ... on Order { id state code }
      ... on ErrorResult { errorCode message }
      ... on OrderPaymentStateError { errorCode message }
      ... on IneligiblePaymentMethodError { errorCode message eligibilityCheckerMessage }
      ... on PaymentFailedError { errorCode message paymentErrorMessage }
      ... on PaymentDeclinedError { errorCode message paymentErrorMessage }
      ... on OrderStateTransitionError { errorCode message transitionError }
      ... on NoActiveOrderError { errorCode message }
    }
  }
`

// ─── Helper ────────────────────────────────────────────────

export function formatPrice(value: number, currency = 'EGP') {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value / 100)
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}
