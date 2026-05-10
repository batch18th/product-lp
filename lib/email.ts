import nodemailer from "nodemailer";
import { businessOrderEmail, customerOrderEmail } from "./emailTemplates";
import type { OrderRecord } from "./order";
import { product } from "./product";

export async function sendOrderEmails(order: OrderRecord) {
  const businessEmail = process.env.BUSINESS_EMAIL || product.businessEmail;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || product.replyToEmail;
  const brandName = process.env.BRAND_NAME || product.brandName;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `${brandName} <${from}>`,
    to: businessEmail,
    replyTo: order.email,
    subject: `New Product Order Received - ${order.orderId}`,
    html: businessOrderEmail(order),
  });

  await transporter.sendMail({
    from: `${brandName} <${from}>`,
    to: order.email,
    replyTo: from,
    subject: `Your Order Has Been Received - ${brandName}`,
    html: customerOrderEmail(order),
  });
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP credentials are missing. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}
