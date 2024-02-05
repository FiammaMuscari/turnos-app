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
    return <h1 className="text-white">Cargando...</h1>;
  }
  const pastAppointments = appointments.filter(
    (appointment) => !isToday(appointment.date)
  );
  const upcomingAppointments = appointments.filter(
    (appointment) => isToday(appointment.date) || appointment.date > new Date()
  );
  return (
    <Card className="max-w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Mis turnos</p>
      </CardHeader>
      <CardContent>
        <div>
          <h1 className="text-xl font-semibold mt-4 mb-2">Turnos Pendientes</h1>
          {upcomingAppointments.length === 0 ? (
            <h2>No hay turnos pendientes</h2>
          ) : (
            upcomingAppointments.map((appointment) => (
              <ul key={appointment.id} className="border-b py-2 flex gap-4">
                <li className="flex items-center gap-2">
                  <FaRegCalendarCheck />
                  <p>
                    {format(appointment.date, "d 'de' MMMM 'del' yyyy", {
                      locale: es,
                    })}
                  </p>
                </li>
                <li className="flex items-center gap-2">
                  <LuClock />
                  <p> {appointment.time}</p>
                </li>
              </ul>
            ))
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold my-4">Turnos Pasados</h1>
          {pastAppointments.length === 0 ? (
            <h2>No hay turnos pasados</h2>
          ) : (
            pastAppointments.map((appointment) => (
              <ul key={appointment.id} className="border-b py-2 flex gap-4">
                <li className="flex items-center gap-2">
                  <FaRegCalendarCheck />
                  <p>
                    {format(appointment.date, "d 'de' MMMM 'del' yyyy", {
                      locale: es,
                    })}
                  </p>
                </li>
                <li className="flex items-center gap-2">
                  <LuClock />
                  <p> {appointment.time}</p>
                </li>
              </ul>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsPage;
