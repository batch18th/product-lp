import { getOrderTotal } from "./product";

export type OrderInput = {
  customerName: string;
  phone: string;
  email: string;
  location: string;
  productName: string;
  quantity: number;
  pricePerPiece: number;
  totalPrice: number;
};

export type OrderRecord = OrderInput & {
  orderId: string;
  dateTime: string;
  paymentMethod: "Cash On Delivery";
  orderStatus: "New Order";
  notes: string;
};

export function validateOrderInput(body: unknown):
  | { ok: true; data: OrderInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid order payload." };
  }

  const value = body as Record<string, unknown>;
  const customerName = stringValue(value.customerName);
  const phone = stringValue(value.phone);
  const email = stringValue(value.email);
  const location = stringValue(value.location);
  const productName = stringValue(value.productName);
  const quantity = numberValue(value.quantity);
  const pricePerPiece = numberValue(value.pricePerPiece);
  const totalPrice = numberValue(value.totalPrice);

  if (!customerName) return { ok: false, error: "Name is required." };
  if (!phone) return { ok: false, error: "Phone number is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Email must be valid." };
  }
  if (!location) return { ok: false, error: "Exact location is required." };
  if (!productName) return { ok: false, error: "Product name is required." };
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, error: "Quantity must be at least 1." };
  }
  if (!Number.isFinite(pricePerPiece) || pricePerPiece <= 0) {
    return { ok: false, error: "Price per piece must be valid." };
  }
  if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
    return { ok: false, error: "Total price must be valid." };
  }

  const expectedTotal = getOrderTotal(quantity).total;
  if (Math.abs(expectedTotal - totalPrice) > 1) {
    return { ok: false, error: "Total price does not match selected quantity." };
  }

  return {
    ok: true,
    data: {
      customerName,
      phone,
      email,
      location,
      productName,
      quantity,
      pricePerPiece,
      totalPrice,
    },
  };
}

export function createOrderRecord(input: OrderInput): OrderRecord {
  return {
    ...input,
    orderId: `FWN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    dateTime: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kathmandu",
    }).format(new Date()),
    paymentMethod: "Cash On Delivery",
    orderStatus: "New Order",
    notes: "",
  };
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return Number.NaN;
}
