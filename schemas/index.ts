import * as z from "zod";

export const ServiceSchema = z.object({
  name: z.string().min(4, {
    message: "Minimum 4 characters required",
  }),
  price: z.string().min(1, {
    message: "Minimum 4 characters required",
  }),
});

export const AppointmentSchema = z.object({
  userId: z.string(),
  date: z.date(),
  time: z.string(),
  isAvailable: z.boolean().default(true),
  services: z.array(
    z.object({
      name: z.string(),
      price: z.string(),
    })
  ),
});

export const AppointmentServiceSchema = z.object({
  appointmentId: z.number(),
  serviceName: z.string(),
});
