import { NextRequest, NextResponse } from "next/server";
import { createOrderRecord, validateOrderInput } from "@/lib/order";

export const runtime = "nodejs";

const PUBLIC_ORDER_ERROR =
  "We could not submit your order right now. Please contact us on WhatsApp.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateOrderInput(body);

    if (!validation.ok) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    const order = createOrderRecord(validation.data);
    const [{ appendOrderToSheet }, { sendOrderEmails }] = await Promise.all([
      import("@/lib/googleSheets"),
      import("@/lib/email"),
    ]);

    console.info("[Order] Saving order to Google Sheets:", order.orderId);
    await appendOrderToSheet(order);
    console.info("[Order] Google Sheets save completed:", order.orderId);

    try {
      await sendOrderEmails(order);
      console.info("[Order] Email notifications completed:", order.orderId);
    } catch (emailError) {
      console.error(
        "[Order] Email notification failed after Google Sheets save:",
        emailError,
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      message: "Order submitted successfully.",
    });
  } catch (error) {
    console.error("Order submission failed:", error);

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
