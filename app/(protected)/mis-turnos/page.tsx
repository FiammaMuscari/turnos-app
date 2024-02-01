"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getAllAppointmentsByEmail } from "@/actions/appointments";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuClock } from "react-icons/lu";

type Appointment = {
  id: string;
  userName: string;
  userEmail: string;
  date: string;
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
          setAppointments(result.data);
        } else {
          console.error("Error fetching appointments:", result.error);
        }
      }
      setIsLoading(false);
    };

    loadAppointments();
  }, [session]);

  if (isLoading) {
    return <h1 className="text-white">Cargando...</h1>;
  }

  return (
    <Card className="max-w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Mis turnos</p>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <h1>¡Sin turnos pendientes!</h1>
        ) : (
          appointments.map((appointment) => (
            <ul key={appointment.id} className="border-b py-2 flex gap-4">
              <li className="flex items-center gap-2">
                <FaRegCalendarCheck />
                <p> {appointment.date}</p>
              </li>
              <li className="flex items-center gap-2">
                <LuClock />
                <p> {appointment.time}</p>
              </li>
            </ul>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsPage;
