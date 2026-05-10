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

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Order submission failed. Please try again.",
      },
      { status: 500 },
    );
  }
}
