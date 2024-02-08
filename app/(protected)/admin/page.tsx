"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuClock } from "react-icons/lu";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { services, getAllServices, deleteService } from "@/actions/services";
import { ServiceSchema } from "@/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAvailableAppointments } from "@/actions/appointments";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { isToday } from "date-fns";
import { useCurrentUserDetails } from "@/hooks/use-current-user-details";

type Appointment = {
  id: string;
  date: Date;
  time: string;
  userName: string;
  userEmail: string;
  services: string[];
};

const AdminPage = () => {
  const user = useCurrentUser();
  const { data: session } = useSession();
  const router = useRouter();
  const [availableAppointments, setAvailableAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [serviceList, setServiceList] = useState<
    { id: string; name: string; price: string }[]
  >([]);
  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  });
  const currentUser = useCurrentUserDetails();

  useEffect(() => {
    const sortAppointments = (a: Appointment, b: Appointment) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeA - timeB;
    };

    const parseTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const fetchAvailableAppointments = async () => {
      const result = await getAvailableAppointments();
      if (result.success) {
        const formattedAppointments = result.data.map((appointment) => ({
          ...appointment,
          userName: currentUser?.name || "",
          userEmail: currentUser?.email || "",
          date: parse(appointment.date, "d 'de' MMMM 'del' yyyy", new Date(), {
            locale: es,
          }),
        }));
        const sortedAppointments = formattedAppointments.sort(sortAppointments);
        setAvailableAppointments(sortedAppointments);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };

    fetchAvailableAppointments();
  }, [currentUser?.email, currentUser?.name]);

  const loadServices = async () => {
    const result = await getAllServices();

    if (result.success) {
      setServiceList(result?.data);
    } else {
      console.error("Error al obtener servicios:", result.error);
    }
  };

  useEffect(() => {
    const checkAdminRoleAndRedirect = () => {
      if (user && session && session.user.role !== UserRole.ADMIN) {
        router.push("/");
      } else {
        setIsLoading(false);
        loadServices();
      }
    };

    checkAdminRoleAndRedirect();
  }, [user, session, router]);

  if (isLoading) {
    return <h1 className="text-white">Cargando...</h1>;
  }

  const onSubmit = (values: z.infer<typeof ServiceSchema>) => {
    startTransition(() => {
      services(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            loadServices();
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Algo salió mal"));
    });
  };

  const onDeleteServiceClick = async (serviceName: string) => {
    startTransition(() => {
      console.log("Deleting service with name:", serviceName);

      deleteService(serviceName)
        .then((data) => {
          console.log("Delete service response:", data);

          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            loadServices();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Algo salió mal"));
    });
  };

  return (
    <Card>
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servicio</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Agrega el servicio"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Agrega el precio"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isPending} type="submit">
              Guardar
            </Button>
          </form>
        </Form>
        <h1 className="text-xl  my-4">Servicios:</h1>
        {serviceList.length === 0 && (
          <div className="text-black">Cargando servicios...</div>
        )}
        {serviceList.map((service) => (
          <div key={service.id} className="flex w-full  border-b py-2 ">
            <div className="flex justify-around w-full items-center">
              <h1 className="w-3">
                {service.name.charAt(0).toUpperCase() + service.name.slice(1)}
              </h1>
              <h1>
                {parseFloat(service.price).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </h1>
              <Button onClick={() => onDeleteServiceClick(service.name)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl my-4">Turnos Pendientes:</h1>
          {availableAppointments.length === 0 && (
            <div className="text-black">Cargando turnos...</div>
          )}
          {availableAppointments
            .filter(
              (appointment) =>
                isToday(appointment.date) || appointment.date > new Date()
            )
            .map((appointment) => (
              <ul
                key={appointment.id}
                className="border border-gray-300 rounded-md grid justify-items-center gap py-2"
              >
                <li className="flex flex-col sm:flex-row items-center gap-2">
                  <FaRegCalendarCheck />
                  <p>
                    {format(appointment.date, "d 'de' MMMM 'del' yyyy", {
                      locale: es,
                    })}
                  </p>
                </li>
                <li className="flex flex-col sm:flex-row items-center gap-2">
                  <LuClock />
                  <p> {appointment.time}</p>
                </li>
                {isToday(appointment.date) && (
                  <div className="bg-green-300 text-black rounded-md px-2 text-sm p-1 my-2">
                    Hoy
                  </div>
                )}
                <li className="flex flex-col sm:flex-row items-center gap-2">
                  <p> {appointment.userName}</p>
                </li>
                <li className="flex flex-col sm:flex-row items-center gap-2">
                  <p>{appointment.userEmail}</p>
                </li>
                <li className="flex flex-col sm:flex-row items-center gap-2 border border-blue-300 rounded-xl px-4">
                  <p>
                    {appointment.services.length > 1
                      ? `${appointment.services
                          .slice(0, -1)
                          .join(", ")} y ${appointment.services.slice(-1)}`
                      : appointment.services.join(", ")}
                  </p>
                </li>
              </ul>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
