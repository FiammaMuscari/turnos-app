import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const paymentId = body.data.id;

  try {
    const payment = await new Payment(client).get({ id: paymentId });

    if (payment.status === "approved") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (error) {
    console.error("Error al verificar el estado del pago:", error);
    return NextResponse.json({
      success: false,
      error: "Payment status verification error",
    });
  }
}
