import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export default async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = new URLSearchParams(req.url?.split("?")[1] || "");
  const topic = searchParams.get("topic") || searchParams.get("type");

  console.log({ topic });

  try {
    if (topic === "payment") {
      const body = req.body as unknown as { data: { id: string } };
      const payment = await new Payment(mercadopago).get({ id: body.data.id });
      return new NextResponse(null, { status: 200 });
    } else {
      return new NextResponse(null, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return new NextResponse(null, { status: 500 });
  }
}
