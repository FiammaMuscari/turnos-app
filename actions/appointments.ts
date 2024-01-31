// appointments.ts
"use server";
import cuid from "cuid";
import * as z from "zod";
import { AppointmentSchema } from "@/schemas";
import { db } from "@/lib/db";

export const createAppointment = async (
  values: z.infer<typeof AppointmentSchema>
) => {
  try {
    const validatedFields = AppointmentSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const newAppointment = await db.appointment.create({
      data: {
        id: cuid(),
        userName: values.userName,
        userEmail: values.userEmail,
        date: values.date,
        time: values.time,
        isAvailable: false,
        services: values.services,
      },
    });

    return { success: "Appointment added successfully!", data: newAppointment };
  } catch (error) {
    console.error("Error adding appointment:", error);
    return { error: "Something went wrong!" };
  }
};

export const getAllAppointmentsByEmail = async (email: string) => {
  try {
    const appointments = await db.appointment.findMany({
      where: {
        userEmail: email,
      },
    });

    return { success: true, data: appointments };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { error: "Something went wrong!" };
  }
};
