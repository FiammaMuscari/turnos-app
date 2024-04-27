import { NextResponse } from "next/server";

async function handler(request: Request) {
  const rawBody = await request.text();
  const response = JSON.parse(rawBody);
  const objId = response && response["data"]["id"];

  console.log("hola:", objId);
  console.log("response::", response);
  return NextResponse.json({}, { status: 200 });
}
export const POST = handler;
