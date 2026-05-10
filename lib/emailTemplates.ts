import type { OrderRecord } from "./order";
import { formatMoney, product } from "./product";

const brand = process.env.BRAND_NAME || product.brandName;
const supportEmail =
  process.env.EMAIL_FROM || process.env.BUSINESS_EMAIL || product.replyToEmail;

export function businessOrderEmail(order: OrderRecord) {
  return emailShell(`
    <h1 style="margin:0;color:#111;font-size:24px;line-height:32px;">New Product Order Received</h1>
    <p style="margin:8px 0 0;color:#555;font-size:14px;">A new Cash on Delivery order has been submitted.</p>
    ${statusBadge(order.orderStatus)}
    ${section("Order Details", [
      ["Order ID", order.orderId],
      ["Date & Time", order.dateTime],
      ["Payment Method", order.paymentMethod],
      ["Order Status", order.orderStatus],
    ])}
    ${section("Customer Details", [
      ["Customer Name", order.customerName],
      ["Phone Number", order.phone],
      ["Email Address", order.email],
      ["Exact Location", order.location],
    ])}
    ${section("Product Details", [
      ["Product Name", order.productName],
      ["Quantity", String(order.quantity)],
      ["Price Per Piece", formatMoney(order.pricePerPiece)],
      ["Total Price", formatMoney(order.totalPrice)],
    ])}
    <div style="margin-top:22px;background:#fff7df;border:1px solid #e6c368;border-radius:10px;padding:16px;color:#4b3408;font-weight:700;">
      Please call the customer soon to confirm this order.
    </div>
  `);
}

export function customerOrderEmail(order: OrderRecord) {
  return emailShell(`
    <h1 style="margin:0;color:#111;font-size:24px;line-height:32px;">Thank you for your order.</h1>
    <p style="margin:10px 0 0;color:#555;font-size:15px;line-height:24px;">Hi ${escapeHtml(order.customerName)},</p>
    <p style="margin:8px 0 0;color:#555;font-size:15px;line-height:24px;">We have received your order successfully.</p>
    ${section("Here are your order details", [
      ["Order ID", order.orderId],
      ["Product", order.productName],
      ["Quantity", String(order.quantity)],
      ["Total Price", formatMoney(order.totalPrice)],
      ["Payment Method", order.paymentMethod],
    ])}
    <div style="margin-top:22px;background:#f6f6f6;border-radius:10px;padding:16px;color:#333;line-height:24px;">
      Our sales representative will call you soon to confirm your order.
    </div>
    <p style="margin:22px 0 0;color:#555;font-size:15px;line-height:24px;">For support, reply to this email: <strong>${escapeHtml(supportEmail)}</strong></p>
    <p style="margin:16px 0 0;color:#111;font-size:15px;line-height:24px;">Thank you,<br /><strong>${escapeHtml(brand)}</strong></p>
  `);
}

function emailShell(content: string) {
  return `
  <!doctype html>
  <html>
    <body style="margin:0;background:#f4f4f4;padding:24px;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;border-collapse:collapse;background:#ffffff;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="background:#080808;padding:24px 28px;color:#f7d57b;font-size:20px;font-weight:800;">
                  ${escapeHtml(brand)}
                </td>
              </tr>
              <tr>
                <td style="padding:28px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="background:#080808;padding:18px 28px;color:#d7d7d7;font-size:12px;line-height:20px;">
                  Cash on Delivery order notification from ${escapeHtml(brand)}.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function section(title: string, rows: [string, string][]) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;border-collapse:collapse;border:1px solid #ececec;border-radius:10px;overflow:hidden;">
      <tr>
        <td colspan="2" style="background:#111;color:#f7d57b;padding:12px 14px;font-weight:800;font-size:14px;">
          ${escapeHtml(title)}
        </td>
      </tr>
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="width:42%;padding:12px 14px;border-top:1px solid #ececec;color:#666;font-size:14px;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border-top:1px solid #ececec;color:#111;font-size:14px;font-weight:700;">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join("")}
    </table>`;
}

function statusBadge(status: string) {
  return `<div style="display:inline-block;margin-top:16px;background:#fff7df;color:#5a3d08;border:1px solid #e6c368;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:800;">${escapeHtml(status)}</div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
