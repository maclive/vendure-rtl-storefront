import { GraphQLClient } from 'graphql-request'

const VENDURE_API = process.env.NEXT_PUBLIC_VENDURE_API || 'http://localhost:3000/shop-api'

export const gqlClient = new GraphQLClient(VENDURE_API, {
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
})

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
  query GetProducts($collectionSlug: String, $take: Int, $skip: Int, $sort: ProductSortParameter) {
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

// ─── Mutations ─────────────────────────────────────────────

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
            product { name featuredAsset { preview } }
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

export const SET_SHIPPING_ADDRESS = `
  mutation SetShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      __typename
      ... on Order { id state }
      ... on ErrorResult { errorCode message }
    }
  }
`

export const SET_CUSTOMER = `
  mutation SetCustomer($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      __typename
      ... on Order { id }
      ... on ErrorResult { errorCode message }
      ... on AlreadyLoggedInError { errorCode message }
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
    }
  }
`

export const TRANSITION_TO_ARRANGING = `
  mutation TransitionToArranging {
    transitionOrderToState(state: "ArrangingPayment") {
      __typename
      ... on Order { id state }
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
