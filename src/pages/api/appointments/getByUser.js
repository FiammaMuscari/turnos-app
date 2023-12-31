// api/appointments/getByUser.js
//Este archivo manejará la obtención de citas para un usuario específico.
import { PrismaClient } from "@prisma/client";

export default async function getAppointmentsByUser(req, res) {
  const prisma = new PrismaClient();

  try {
    const userId = req.query.userId;

    const appointments = await prisma.appointment.findMany({
      where: { user_id: userId },
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await prisma.$disconnect();
  }
}
