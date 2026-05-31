import nodemailer from "nodemailer";
import { businessOrderEmail, customerOrderEmail } from "./emailTemplates";
import type { OrderRecord } from "./order";
import { product } from "./product";

export async function sendOrderEmails(order: OrderRecord) {
  const businessEmail = "batch18th1990@gmail.com";
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || product.replyToEmail;
  const brandName = process.env.BRAND_NAME || product.brandName;

  let transporter: ReturnType<typeof createTransporter>;
  try {
    transporter = createTransporter();
  } catch (error) {
    console.error("[Email] SMTP transporter setup failed:", error);
    return;
  }

  try {
    await transporter.sendMail({
      from: `${brandName} <${from}>`,
      to: businessEmail,
      replyTo: order.email,
      subject: `New Product Order Received - ${order.orderId}`,
      html: businessOrderEmail(order),
    });
    console.info("[Email] Admin order notification sent:", order.orderId);
  } catch (error) {
    console.error("[Email] Admin order notification failed:", error);
  }

  if (!order.email) {
    console.warn("[Email] Customer email missing, confirmation skipped:", order.orderId);
    return;
  }

  try {
    await transporter.sendMail({
      from: `${brandName} <${from}>`,
      to: order.email,
      replyTo: from,
      subject: `Your Order Has Been Received - ${brandName}`,
      html: customerOrderEmail(order),
    });
    console.info("[Email] Customer order confirmation sent:", order.orderId);
  } catch (error) {
    console.error("[Email] Customer order confirmation failed:", error);
  }
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
