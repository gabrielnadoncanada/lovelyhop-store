import "server-only";
import { customerQuery } from "./customer";
import type { Money } from "@/lib/types";

/** Lectures et écritures du compte client (Customer Account API). Les types ne gardent que ce que les pages affichent. */

export type CustomerAddress = {
  id: string; firstName: string | null; lastName: string | null; company: string | null;
  address1: string | null; address2: string | null; city: string | null; zoneCode: string | null; territoryCode: string | null; zip: string | null;
  phoneNumber: string | null; formatted: string[];
};
export type OrderSummary = {
  id: string; name: string; processedAt: string; financialStatus: string | null; fulfillmentStatus: string; statusPageUrl: string;
  totalPrice: Money; lineItems: { nodes: { title: string; quantity: number; image: { url: string; altText: string | null } | null }[] };
};
export type Account = {
  id: string; firstName: string | null; lastName: string | null; displayName: string;
  emailAddress: { emailAddress: string | null } | null; phoneNumber: { phoneNumber: string | null } | null;
  defaultAddress: { id: string } | null;
  addresses: { nodes: CustomerAddress[] };
  orders: { nodes: OrderSummary[] };
};
export type OrderDetail = Omit<OrderSummary, "lineItems"> & {
  cancelledAt: string | null;
  subtotal: Money | null; totalShipping: Money; totalTax: Money | null;
  shippingAddress: { formatted: string[] } | null; billingAddress: { formatted: string[] } | null;
  fulfillments: { nodes: { status: string | null; estimatedDeliveryAt: string | null; trackingInformation: { number: string | null; url: string | null; company: string | null }[] }[] };
  lineItems: { nodes: { id: string; title: string; quantity: number; variantTitle: string | null; image: { url: string; altText: string | null } | null; price: Money | null; totalPrice: Money | null }[] };
};

const ADDRESS = `fragment Addr on CustomerAddress { id firstName lastName company address1 address2 city zoneCode territoryCode zip phoneNumber formatted }`;
const ORDER_SUMMARY = `fragment OrderSummary on Order { id name processedAt financialStatus fulfillmentStatus statusPageUrl totalPrice { amount currencyCode } lineItems(first: 4) { nodes { title quantity image { url altText } } } }`;

export async function getAccount(ordersFirst = 5): Promise<Account> {
  const d = await customerQuery<{ customer: Account }>(
    `${ADDRESS} ${ORDER_SUMMARY}
    query Account($first: Int!) { customer {
      id firstName lastName displayName emailAddress { emailAddress } phoneNumber { phoneNumber } defaultAddress { id }
      addresses(first: 20) { nodes { ...Addr } }
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) { nodes { ...OrderSummary } }
    } }`,
    { first: ordersFirst },
  );
  return d.customer;
}

export async function getOrders(first = 25): Promise<OrderSummary[]> {
  const d = await customerQuery<{ customer: { orders: { nodes: OrderSummary[] } } }>(
    `${ORDER_SUMMARY} query Orders($first: Int!) { customer { orders(first: $first, sortKey: PROCESSED_AT, reverse: true) { nodes { ...OrderSummary } } } }`,
    { first },
  );
  return d.customer.orders.nodes;
}

export async function getOrder(id: string): Promise<OrderDetail | null> {
  const d = await customerQuery<{ order: OrderDetail | null }>(
    `query Order($id: ID!) { order(id: $id) {
      id name processedAt cancelledAt financialStatus fulfillmentStatus statusPageUrl
      subtotal { amount currencyCode } totalShipping { amount currencyCode } totalTax { amount currencyCode } totalPrice { amount currencyCode }
      shippingAddress { formatted } billingAddress { formatted }
      fulfillments(first: 5) { nodes { status estimatedDeliveryAt trackingInformation { number url company } } }
      lineItems(first: 50) { nodes { id title quantity variantTitle image { url altText } price { amount currencyCode } totalPrice { amount currencyCode } } }
    } }`,
    { id },
  );
  return d.order;
}

export type AddressInput = {
  firstName?: string; lastName?: string; company?: string; address1?: string; address2?: string; city?: string;
  zoneCode?: string; territoryCode?: string; zip?: string; phoneNumber?: string;
};
type UserError = { field: string[] | null; message: string };
const firstError = (errors: UserError[]) => errors[0]?.message ?? null;

export async function createAddress(address: AddressInput, defaultAddress: boolean): Promise<string | null> {
  const d = await customerQuery<{ customerAddressCreate: { userErrors: UserError[] } }>(
    `mutation AddrCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) { customerAddressCreate(address: $address, defaultAddress: $defaultAddress) { customerAddress { id } userErrors { field message } } }`,
    { address, defaultAddress },
  );
  return firstError(d.customerAddressCreate.userErrors);
}

export async function updateAddress(addressId: string, address: AddressInput, defaultAddress: boolean): Promise<string | null> {
  const d = await customerQuery<{ customerAddressUpdate: { userErrors: UserError[] } }>(
    `mutation AddrUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) { customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) { customerAddress { id } userErrors { field message } } }`,
    { addressId, address, defaultAddress },
  );
  return firstError(d.customerAddressUpdate.userErrors);
}

export async function deleteAddress(addressId: string): Promise<string | null> {
  const d = await customerQuery<{ customerAddressDelete: { userErrors: UserError[] } }>(
    `mutation AddrDelete($addressId: ID!) { customerAddressDelete(addressId: $addressId) { deletedAddressId userErrors { field message } } }`,
    { addressId },
  );
  return firstError(d.customerAddressDelete.userErrors);
}

export async function updateProfile(input: { firstName: string; lastName: string }): Promise<string | null> {
  const d = await customerQuery<{ customerUpdate: { userErrors: UserError[] } }>(
    `mutation Profile($input: CustomerUpdateInput!) { customerUpdate(input: $input) { customer { id } userErrors { field message } } }`,
    { input },
  );
  return firstError(d.customerUpdate.userErrors);
}
