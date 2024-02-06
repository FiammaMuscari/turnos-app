"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getAllAppointmentsByEmail } from "@/actions/appointments";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuClock } from "react-icons/lu";
import { format, parse, isToday } from "date-fns";
import { es } from "date-fns/locale";

type Appointment = {
  id: string;
  userName: string;
  userEmail: string;
  date: Date;
  time: string;
  isAvailable: boolean;
  services: string[];
};

const AppointmentsPage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      if (session && session.user && session.user.email) {
        const result = await getAllAppointmentsByEmail(session.user.email);
        if (result.success) {
          const formattedAppointments = result.data.map((appointment) => ({
            ...appointment,
            date: parse(
              appointment.date,
              "d 'de' MMMM 'del' yyyy",
              new Date(),
              { locale: es }
            ),
          }));
          const sortedAppointments =
            formattedAppointments.sort(sortAppointments);
          setAppointments(sortedAppointments);
        } else {
          console.error("Error fetching appointments:", result.error);
        }
      }
      setIsLoading(false);
    };

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

    loadAppointments();
  }, [session]);

  if (isLoading) {
    return <h1 className="text-white mt-6">Cargando...</h1>;
  }

  const today = new Date();
  const pastAppointments = appointments.filter(
    (appointment) => appointment.date < today && !isToday(appointment.date)
  );
  const upcomingAppointments = appointments.filter(
    (appointment) => isToday(appointment.date) || appointment.date > today
  );

  const renderAppointments = (appointments: Appointment[], title: string) => (
    <div>
      <h1 className="text-xl font-semibold my-4">{title}</h1>
      {appointments.length === 0 ? (
        <h2>No hay turnos {title.toLowerCase()}</h2>
      ) : (
        appointments.map((appointment) => (
          <ul
            key={appointment.id}
            className="border-b py-2 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <li className="flex items-center md:col-span-2">
              <FaRegCalendarCheck className="mr-2" />
              <p className="whitespace-nowrap">
                {format(appointment.date, "d 'de' MMMM 'del' yyyy", {
                  locale: es,
                })}
              </p>
            </li>
            <li className="flex items-center justify-start md:justify-end">
              <LuClock className="mr-2" />
              <p className="whitespace-nowrap">{appointment.time}</p>
            </li>
            <li className="md:col-span-3">
              <p className="whitespace-nowrap px-4 border border-solid border-blue-400 rounded-xl justify-center flex bg-blue-200">
                {appointment.services.length > 1
                  ? `${appointment.services
                      .slice(0, -1)
                      .join(", ")} y ${appointment.services.slice(-1)}`
                  : appointment.services.join(", ")}
              </p>
            </li>
          </ul>
        ))
      )}
    </div>
  );

  return (
    <Card className="max-w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Mis turnos</p>
      </CardHeader>
      <CardContent>
        {renderAppointments(upcomingAppointments, "Turnos Pendientes")}
        {renderAppointments(pastAppointments, "Turnos Pasados")}
      </CardContent>
    </Card>
  );
};

export default AppointmentsPage;
