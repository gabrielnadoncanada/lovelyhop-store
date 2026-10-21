/**
 * Requêtes Storefront. Métachamps attendus sur les produits (espace de noms « lovelyhop ») :
 *   univers (texte : creer|imaginer|ranger|bouger|cpe), age (texte), materiau (texte),
 *   badge (texte : phare|nouveau|bientot), dessin (texte : nom d'un dessin de marque), details (JSON : ProductDetails)
 * et sur les variantes : description (texte court). Tous traduisibles avec Translate & Adapt.
 */

const IMAGE = `url altText width height`;
const MONEY = `amount currencyCode`;

export const PRODUCT_FIELDS = `
  id handle title description availableForSale
  seo { title description }
  priceRange { minVariantPrice { ${MONEY} } }
  images(first: 8) { nodes { ${IMAGE} } }
  variants(first: 20) { nodes { id title availableForSale price { ${MONEY} } description: metafield(namespace: "lovelyhop", key: "description") { value } } }
  univers: metafield(namespace: "lovelyhop", key: "univers") { value }
  age: metafield(namespace: "lovelyhop", key: "age") { value }
  materiau: metafield(namespace: "lovelyhop", key: "materiau") { value }
  badge: metafield(namespace: "lovelyhop", key: "badge") { value }
  dessin: metafield(namespace: "lovelyhop", key: "dessin") { value }
  details: metafield(namespace: "lovelyhop", key: "details") { value }
`;

export const PRODUCT_QUERY = `
  query Product($handle: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }`;

/** Handle d'un produit dans une autre langue (sélecteur de langue, hreflang). */
export const PRODUCT_HANDLE_QUERY = `
  query ProductHandle($id: ID!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    product(id: $id) { handle }
  }`;

/** Plusieurs produits par handle, un alias par produit (p0, p1…), dans l'ordre demandé. */
export function productsByHandlesQuery(n: number) {
  const vars = Array.from({ length: n }, (_, i) => `$h${i}: String!`).join(", ");
  const fields = Array.from({ length: n }, (_, i) => `p${i}: product(handle: $h${i}) { ${PRODUCT_FIELDS} }`).join("\n");
  return `query Products(${vars}, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {\n${fields}\n}`;
}

export const ALL_PRODUCTS_QUERY = `
  query AllProducts($language: LanguageCode, $country: CountryCode, $cursor: String) @inContext(language: $language, country: $country) {
    products(first: 100, after: $cursor) { nodes { id handle title description updatedAt featuredImage { url } univers: metafield(namespace: "lovelyhop", key: "univers") { value } } pageInfo { hasNextPage endCursor } }
  }`;

export const COLLECTION_QUERY = `
  query Collection($handle: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    collection(handle: $handle) {
      id handle title description
      univers: metafield(namespace: "lovelyhop", key: "univers") { value }
      products(first: 100) { nodes { ${PRODUCT_FIELDS} } }
    }
  }`;

export const COLLECTION_HANDLE_QUERY = `
  query CollectionHandle($id: ID!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    collection(id: $id) { handle }
  }`;

export const SEARCH_QUERY = `
  query Search($q: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    predictiveSearch(query: $q, limit: 6, types: [PRODUCT]) { products { ${PRODUCT_FIELDS} } }
  }`;

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { ${MONEY} } }
  lines(first: 100) { nodes {
    id quantity
    cost { totalAmount { ${MONEY} } amountPerQuantity { ${MONEY} } }
    merchandise { ... on ProductVariant { id title product { handle title featuredImage { ${IMAGE} } dessin: metafield(namespace: "lovelyhop", key: "dessin") { value } } } }
  } }
`;

export const CART_QUERY = `query Cart($id: ID!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) { cart(id: $id) { ${CART_FIELDS} } }`;
export const CART_CREATE = `mutation CartCreate($lines: [CartLineInput!], $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) { cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: $country } }) { cart { ${CART_FIELDS} } userErrors { message } } }`;
export const CART_ADD = `mutation CartAdd($id: ID!, $lines: [CartLineInput!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) { cartLinesAdd(cartId: $id, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`;
export const CART_UPDATE = `mutation CartUpdate($id: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) { cartLinesUpdate(cartId: $id, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`;
export const CART_REMOVE = `mutation CartRemove($id: ID!, $lineIds: [ID!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) { cartLinesRemove(cartId: $id, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } } }`;
