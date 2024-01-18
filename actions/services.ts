// services.ts
"use server";
import cuid from "cuid";

import * as z from "zod";

import { ServiceSchema } from "@/schemas";
import { db } from "@/lib/db";

export const services = async (values: z.infer<typeof ServiceSchema>) => {
  try {
    const validatedFields = ServiceSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const newService = await db.service.create({
      data: {
        id: cuid(),
        name: values.name,
        price: values.price,
      },
    });

    return { success: "Service added successfully!", data: newService };
  } catch (error) {
    console.error("Error adding service:", error);
    return { error: "Something went wrong!" };
  }
};

export const deleteService = async (serviceName: string) => {
  try {
    // Eliminar servicio
    const deletedService = await db.service.deleteMany({
      where: {
        name: serviceName,
      },
    });

    if (deletedService) {
      return { success: "Service deleted successfully!" };
    } else {
      return { error: "Service not found" };
    }
  } catch (error) {
    console.error("Error deleting service:", error);
    return { error: "Something went wrong!" };
  }
};

export const getAllServices = async () => {
  try {
    const services = await db.service.findMany();
    const validatedServices = services.map((service, index) => ({
      ...service,
    }));

    return { success: true, data: validatedServices };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { error: "Something went wrong!" };
  }
};
