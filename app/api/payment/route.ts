import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const topic = searchParams.get("topic") || searchParams.get("type");

  try {
    if (topic === "payment") {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch (error) {
    console.error("Error al verificar el estado del pago:", error);
    return NextResponse.json({
      success: false,
      error: "Payment status verification error",
    });
  }
}
