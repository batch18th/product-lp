import { NextRequest, NextResponse } from "next/server";
import { createOrderRecord, validateOrderInput } from "@/lib/order";

export const runtime = "nodejs";

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

    await appendOrderToSheet(order);
    await sendOrderEmails(order);

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
        : "Something went wrong. Please try again or contact us.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
