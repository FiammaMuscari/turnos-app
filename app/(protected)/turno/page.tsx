"use client";
import React, { useEffect, useTransition, useState } from "react";
import ServicesList from "@/components/ServicesList";
import { DatePickerForm } from "@/components/DatePickerForm";
import { AppointmentSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCurrentUser } from "@/hooks/use-current-user";
import { createAppointment } from "@/actions/appointments";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import TimeList from "@/components/TimeList";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentUserDetails } from "@/hooks/use-current-user-details";
import { Toaster } from "@/components/ui/toaster";
import { getUnavailableTimes } from "@/actions/appointments";
import { payment } from "@/actions/payment";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect, useSearchParams } from "next/navigation";
interface Service {
  id: string;
  name: string;
  price: string;
}

const ClientPage: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const user = useCurrentUser();
  const { toast } = useToast();
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  useEffect(() => {
    const total = selectedServices.reduce(
      (accumulator, service) => accumulator + parseFloat(service.price),
      0
    );
    setTotalPrice(total);
  }, [selectedServices]);

  const handleDateSelection = (date: string | undefined) => {
    if (date) {
      setSelectedDate(date);
      getUnavailableTimes(date)
        .then((data) => {
          if (data.success) {
            setUnavailableTimes(data.data);
          } else {
            setError(data.error);
          }
        })
        .catch(() => setError("Something went wrong"));
    } else {
      setSelectedDate(null);
    }
  };
  const userDetails = useCurrentUserDetails();
  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      userName: userDetails?.name || "",
      userEmail: userDetails?.email || "",
      date: "",
      time: "",
      services: selectedServices.map((service) => service.name),
    },
  });

  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });

  const formattedTotalPrice = totalPrice.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const onSubmit = async (values: z.infer<typeof AppointmentSchema>) => {
    if (!selectedDate || !selectedTime || selectedServices.length === 0) {
      toast({
        title: "Error",
        description:
          "Por favor, complete todos los campos para agendar el turno",
        variant: "destructive",
      });
      return;
    }

    try {
      const preferenceUrl = await payment(totalPrice);
      window.location.href = preferenceUrl;

      const checkPaymentStatus = async () => {
        try {
        } catch (error) {
          console.error("Error al verificar el estado del pago:", error);
          setError("Something went wrong while verifying payment status");
        }
      };
      checkPaymentStatus();
    } catch (error) {
      console.error("Error durante el pago:", error);
      setError("Something went wrong during payment");
    }
  };

  const handleServiceSelection = (service: Service) => {
    const isServiceSelected = selectedServices.some(
      (s) => s.name === service.name
    );

    if (isServiceSelected) {
      const updatedServices = selectedServices.filter(
        (s) => s.name !== service.name
      );
      setSelectedServices(updatedServices);
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };
  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const collectionStatus = queryParams.get("collection_status");

    if (collectionStatus === "approved") {
      console.log("El estado de la colección es 'approved'");

      const scheduleAppointment = async (
        values: z.infer<typeof AppointmentSchema>,
        selectedDate: string | null,
        selectedTime: string | null,
        selectedServices: Service[]
      ) => {
        try {
          const updatedValues = {
            ...values,
            date: selectedDate || "",
            time: selectedTime || "",
            services: selectedServices.map((service) => service.name),
          };
          await createAppointment(updatedValues);
          update();
          setSuccess("Turno agendado exitosamente");
          toast({
            title: "Turno agendado",
            description: `El día ${selectedDate}`,
          });
        } catch (error) {
          console.error("Error al agendar el turno:", error);
          setError("Hubo un error al agendar el turno");
        }
      };

      scheduleAppointment(
        form.getValues(),
        selectedDate,
        selectedTime,
        selectedServices
      );
    }
  }, [form, selectedDate, selectedServices, selectedTime, toast, update]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="mb-3 text-white flex justify-center">
            Hola, ¿Qué deseas hacerte?
          </h1>
          <ServicesList
            handleServiceSelection={handleServiceSelection}
            selectedServices={selectedServices}
          />
          <div className="max-w-80 bg-white rounded-sm p-4 m-3">
            <h2>A pagar:</h2>
            {selectedServices.length > 0 ? (
              selectedServices.map((service) => (
                <ul key={service.id} className="flex justify-end">
                  <li>{service.name}</li>
                  <li>
                    ..........{" "}
                    {parseFloat(service.price).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </li>
                </ul>
              ))
            ) : (
              <div>No hay servicios seleccionados</div>
            )}
            <div className="text-blue-400">Total: {formattedTotalPrice} </div>
          </div>
          <DatePickerForm onSelectDate={handleDateSelection} />
          <TimeList
            onSelectTime={handleTimeSelection}
            unavailableTimes={unavailableTimes}
          />
          <Button
            disabled={isPending || success !== undefined}
            type="submit"
            className="mt-4 "
          >
            Guardar
          </Button>
        </form>
      </Form>
      <Toaster />
    </>
  );
};

export default ClientPage;
