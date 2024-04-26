"use server";

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function notification(request: NextRequest) {
  try {
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing notification:", error);
    return new NextResponse(null, { status: 403 });
  }
}
