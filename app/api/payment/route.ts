import { NextRequest } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  const body = await request
    .json()
    .then((data) => data as { data: { id: string } });

  const payment = await new Payment(client).get({ id: body.data.id });

  const order = {
    payment_id: payment.id,
    amount: payment.transaction_amount,
    status: payment.status,
    message: payment.description,
  };

  return Response.json({ success: true });
}
