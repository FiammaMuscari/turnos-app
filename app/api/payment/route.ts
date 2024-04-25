import { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const body = req.body as { data: { id: string } };

    const payment = await new Payment(mercadopago).get({ id: body.data.id });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ error: "Error processing payment" });
  }
}
