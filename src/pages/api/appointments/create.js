// api/appointments/create.js
import { PrismaClient } from "@prisma/client";

export default async function createAppointment(req, res) {
  const prisma = new PrismaClient();

  try {
    const { userId, date, time, serviceId } = req.body;

    // Verificar la disponibilidad del horario
    const isTimeAvailable = await prisma.appointment.findFirst({
      where: {
        date,
        time,
        is_available: true,
      },
    });

    if (!isTimeAvailable) {
      return res.status(400).json({ error: "El horario no está disponible" });
    }

    // Crear la cita
    const appointment = await prisma.appointment.create({
      data: {
        user: { connect: { id: userId } },
        date,
        time,
        is_available: false,
        service: { connect: { id: serviceId } },
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await prisma.$disconnect();
  }
}
