import { NextResponse } from "next/server";

async function handler(request: Request) {
  const payload = (await request.json()) as {
    action: string;
    type: string;
    data: { id: string };
  };
  const {
    type,
    data: { id },
    action,
  } = payload;
  console.log(id, type);
  console.log(payload);
  if (type === "payment" || type === "refund") {
    try {
      const responseCompra = await fetch(
        `https://api.mercadopago.com/v1/payments/${id}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN! as string}`,
          },
        }
      );
      console.log(responseCompra);
      if (!responseCompra.ok) {
        throw new Error(`HTTP error! status: ${responseCompra.status}`);
      }
      const data = (await responseCompra.json()) as {
        metadata: { budget_id: string; description: string };
        status: string;
        status_detail: string;
      };
      console.log(data);
      console.log(data.metadata);
      if (!data.metadata) {
        throw new Error(`HTTP error! status: ${responseCompra.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (type === "mp-connect" && action === "application.authorized") {
    console.log(payload);
  }

  return NextResponse.json({}, { status: 200 });
}
export const POST = handler;
