import { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchParams = new URLSearchParams(req.url?.split("?")[1] || "");
  const topic = searchParams.get("topic") || searchParams.get("type");

  console.log({ topic });

  try {
    if (topic === "payment") {
      const body = req.body as { data: { id: string } };
      const payment = await new Payment(mercadopago).get({ id: body.data.id });
      return res.status(200).json({ payment });
    } else {
      return res.status(400).json({ message: "Invalid topic" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ error: "Error processing payment" });
  }
}
