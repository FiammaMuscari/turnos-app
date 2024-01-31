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
import { useCurrentUserDetails } from "@/hooks/use-current-user-details";
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

  const onSubmit = async (values: z.infer<typeof AppointmentSchema>) => {
    const updatedValues = {
      ...values,
      date: selectedDate || "",
      time: selectedTime || "",
      services: selectedServices.map((service) => service.name),
    };

    console.log("Valores a enviar al crear la cita:", updatedValues);

    startTransition(() => {
      createAppointment(updatedValues)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Algo salió mal"));
    });
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-3 text-white">Hola, ¿Qué deseas hacerte?</h1>
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
                <li>.......... ${service.price}</li>
              </ul>
            ))
          ) : (
            <div>No hay servicios seleccionados</div>
          )}
          <div className="text-blue-400">Total: $ {totalPrice}</div>
        </div>
        <DatePickerForm onSelectDate={handleDateSelection} />
        <TimeList onSelectTime={handleTimeSelection} />
        <Button disabled={isPending} type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  );
};

export default ClientPage;
