// pages/api/services.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return handlePost(req, res);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

// Función para manejar la solicitud POST
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  console.log("Request body:", req.body);

  const { name, price } = req.body;

  try {
    const newService = await prisma.service.create({
      data: {
        name,
        price,
      },
    });

    console.log("New service created:", newService);

    res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
