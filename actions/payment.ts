"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function payment(totalPrice: number) {
  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: "turno",
          title: "pago",
          quantity: 1,
          unit_price: totalPrice,
        },
      ],
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/notification`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/turno`,
      },
      auto_return: "approved",
    },
  });
  console.log("esto FIAMMA:", preference.notification_url);
  return preference.sandbox_init_point!;
}
