import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  if (req.method === "GET") {
    try {
      const services = await prisma.service.findMany();
      res.status(200).json(services);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      res.status(500).json({ error: "Error al obtener servicios" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
