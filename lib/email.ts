import nodemailer from "nodemailer";
import { businessOrderEmail, customerOrderEmail } from "./emailTemplates";
import type { OrderRecord } from "./order";
import { product } from "./product";

export type EmailSendResult = {
  adminEmailSent: true;
  customerEmailSent: boolean;
};

export async function sendOrderEmails(order: OrderRecord) {
  const businessEmail =
    process.env.ADMIN_EMAIL || process.env.BUSINESS_EMAIL || "batch18th1990@gmail.com";
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || product.replyToEmail;
  const brandName = process.env.BRAND_NAME || product.brandName;

  console.info("[Email] Admin email:", businessEmail ? "loaded" : "missing");
  console.info("[Email] Provider: SMTP");

  if (!businessEmail) {
    throw new Error("ADMIN_EMAIL is missing.");
  }

  const transporter = createTransporter();

  const adminResponse = await transporter.sendMail({
    from: `${brandName} <${from}>`,
    to: businessEmail,
    replyTo: order.email,
    subject: `New Product Order Received - ${order.orderId}`,
    html: businessOrderEmail(order),
  });
  console.info(
    "[Email] Admin email send response:",
    JSON.stringify({ messageId: adminResponse.messageId }),
  );

  if (!order.email) {
    console.warn("[Email] Customer email missing, confirmation skipped:", order.orderId);
    return { adminEmailSent: true, customerEmailSent: false };
  }

  const customerResponse = await transporter.sendMail({
    from: `${brandName} <${from}>`,
    to: order.email,
    replyTo: from,
    subject: `Your Order Has Been Received - ${brandName}`,
    html: customerOrderEmail(order),
  });
  console.info(
    "[Email] Customer email send response:",
    JSON.stringify({ messageId: customerResponse.messageId }),
  );

  return { adminEmailSent: true, customerEmailSent: true };
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.info("[Email] SMTP_HOST:", host ? "loaded" : "missing");
  console.info("[Email] SMTP_PORT:", Number.isFinite(port) ? port : "missing");
  console.info("[Email] SMTP_USER:", user ? "loaded" : "missing");
  console.info("[Email] SMTP_PASS:", pass ? "loaded" : "missing");

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
