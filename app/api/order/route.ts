import { NextRequest, NextResponse } from "next/server";
import { createOrderRecord, validateOrderInput } from "@/lib/order";

export const runtime = "nodejs";

const PUBLIC_ORDER_ERROR =
  "We could not submit your order right now. Please contact us on WhatsApp.";

export async function POST(request: NextRequest) {
  try {
    console.info("ORDER API START");
    const body = await request.json();
    console.info("[Order] Received form data:", JSON.stringify(body));
    console.log("Received order data:", body);
    console.log("GOOGLE_SHEET_ID exists:", !!process.env.GOOGLE_SHEET_ID);
    console.log(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL exists:",
      !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    );
    console.log("GOOGLE_PRIVATE_KEY exists:", !!process.env.GOOGLE_PRIVATE_KEY);
    console.log("ADMIN_EMAIL exists:", !!process.env.ADMIN_EMAIL);
    console.log("EMAIL API KEY exists:", !!process.env.RESEND_API_KEY);
    console.log(
      "GMAIL APP PASSWORD exists:",
      !!(process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS),
    );
    console.log("Using sheet tab:", "T-shirt order");
    const validation = validateOrderInput(body);

    if (!validation.ok) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    const order = createOrderRecord(validation.data);
    console.info("[Order] Order ID generated:", order.orderId);
    const [{ appendOrderToSheet }, { sendOrderEmails }] = await Promise.all([
      import("@/lib/googleSheets"),
      import("@/lib/email"),
    ]);

    console.info("[Order] Saving order to Google Sheets:", order.orderId);
    const sheetSaved = await appendOrderToSheet(order);
    console.info("[Order] Google Sheets save completed:", order.orderId);

    const emailResult = await sendOrderEmails(order);
    console.info("[Order] Email notifications completed:", {
      orderId: order.orderId,
      ...emailResult,
    });

    console.info("[Order] API success response:", order.orderId);

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      sheetSaved,
      adminEmailSent: emailResult.adminEmailSent,
      customerEmailSent: emailResult.customerEmailSent,
      message: "Order submitted successfully.",
    });
  } catch (error) {
    console.error("[Order] Final failure response:", error);
    console.error("ORDER SUBMISSION FAILED:", error);
    console.error(
      "ERROR MESSAGE:",
      error instanceof Error ? error.message : "Unknown error",
    );
    console.error(
      "ERROR STACK:",
      error instanceof Error ? error.stack : "No stack available",
    );

    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : PUBLIC_ORDER_ERROR;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
