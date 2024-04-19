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
      back_urls: {
        success: "https://turnos-app-three.vercel.app/mis-turnos",
      },
      auto_return: "approved",
    },
  });

  return preference.sandbox_init_point!;
}
