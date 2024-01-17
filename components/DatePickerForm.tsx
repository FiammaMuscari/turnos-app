import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

// Declaration of FormSchema
const FormSchema = z.object({
  dob: z.date({
    required_error: "Fecha requerida",
  }),
});

interface FormData {
  dob: Date;
  // Agrega otros campos que puedas tener en tu formulario aquí
}

interface Turno {
  date: string;
  time: string;
}

export function DatePickerForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  // Turnos lógica
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);

  const generateTurnos = (): Turno[] => {
    const turnos: Turno[] = [];
    const currentDate = new Date(); // Puedes ajustar la fecha de inicio según tus necesidades

    for (let i = 0; i < 8; i++) {
      const turnoDate = new Date(currentDate);
      turnoDate.setHours(9 + i); // Ajusta según tus necesidades

      turnos.push({
        date: turnoDate.toISOString(),
        time: `${i + 9}:00 - ${i + 10}:00`, // Ajusta según tus necesidades
      });
    }

    return turnos;
  };

  const handleTurnoClick = (turno: Turno) => {
    setSelectedTurno(turno);
  };

  const handleGuardarTurno = () => {
    // Aquí debes implementar la lógica para guardar el turno en la base de datos
    // Puedes enviar una solicitud al backend para crear un nuevo Appointment
    // Usando fetch, axios, o la biblioteca que prefieras
    // Asegúrate de incluir el ID del usuario en la solicitud
    const userId: string = "despues lo pongo";
    // Ejemplo usando fetch (asegúrate de ajustar la URL y el formato de la solicitud según tu backend):
    fetch("/api/agendar-turno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        date: selectedTurno?.date,
        time: selectedTurno?.time,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Turno guardado:", data);
        // Puedes realizar acciones adicionales después de guardar el turno si es necesario
      })
      .catch((error) => {
        console.error("Error al guardar el turno:", error);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de turno</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Elige el día</span>
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                        />
                      </svg>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Elige el día para sacar el turno
                <div className="grid grid-cols-2 gap-4">
                  {generateTurnos().map((turno, index) => (
                    <div
                      key={index}
                      className={`border p-2 ${
                        selectedTurno === turno ? "bg-orange-200" : ""
                      } cursor-pointer`}
                      onClick={() => handleTurnoClick(turno)}
                    >
                      <div>{turno.time}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  {selectedTurno && (
                    <Button onClick={handleGuardarTurno}>Guardar Turno</Button>
                  )}
                </div>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
