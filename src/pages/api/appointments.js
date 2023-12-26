// pages/api/appointments.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, name, date, time, serviceId } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          appointments: {
            create: {
              date,
              time,
              is_available: true,
              service: {
                connect: { id: serviceId },
              },
            },
          },
        },
      });

      res.status(201).json({ success: true, user });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Error al crear el usuario y la cita.",
        });
    }
  } else {
    res.status(405).json({ success: false, error: "Método no permitido." });
  }
}
