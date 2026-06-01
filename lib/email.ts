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
    usableEnv(process.env.ADMIN_EMAIL) ||
    usableEnv(process.env.BUSINESS_EMAIL) ||
    "batch18th1990@gmail.com";
  const from =
    usableEnv(process.env.EMAIL_FROM) ||
    usableEnv(process.env.SENDER_EMAIL) ||
    usableEnv(process.env.GMAIL_USER) ||
    usableEnv(process.env.SMTP_USER) ||
    product.replyToEmail;
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
  const host = usableEnv(process.env.SMTP_HOST) || "smtp.gmail.com";
  const port = Number(usableEnv(process.env.SMTP_PORT) || 465);
  const user = usableEnv(process.env.GMAIL_USER) || usableEnv(process.env.SMTP_USER);
  const pass =
    usableEnv(process.env.GMAIL_APP_PASSWORD) || usableEnv(process.env.SMTP_PASS);

  console.info("[Email] SMTP_HOST:", host ? "loaded" : "missing");
  console.info("[Email] SMTP_PORT:", Number.isFinite(port) ? port : "missing");
  console.info("[Email] SMTP_USER:", user ? "loaded" : "missing");
  console.info("[Email] SMTP_PASS:", pass ? "loaded" : "missing");
  console.info("[Email] GMAIL_USER:", process.env.GMAIL_USER ? "loaded" : "missing");
  console.info(
    "[Email] GMAIL_APP_PASSWORD:",
    process.env.GMAIL_APP_PASSWORD ? "loaded" : "missing",
  );

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

function usableEnv(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("your-") ||
    lower.includes("your app password") ||
    lower.includes("your-gmail-app-password") ||
    lower.includes("your-google-private-key")
  ) {
    return "";
  }

  return trimmed;
}
