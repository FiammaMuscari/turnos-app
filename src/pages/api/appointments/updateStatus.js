// api/appointments/updateStatus.js
import { PrismaClient } from "@prisma/client";

export default async function updateAppointmentStatus(req, res) {
  const prisma = new PrismaClient();

  try {
    const { appointmentId, isAvailable } = req.body;

    // Actualizar el estado de la cita
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { is_available: isAvailable },
    });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await prisma.$disconnect();
  }
}
