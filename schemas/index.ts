import * as z from "zod";
import { UserRole } from "@prisma/client";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

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
