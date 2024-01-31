"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";

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

const AdminPage = () => {
  const user = useCurrentUser();
  const { data: session } = useSession();
  const router = useRouter();

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
    return <h1>Cargando...</h1>;
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

  const capitalizeFirstLetter = (input: string): string => {
    return input.charAt(0).toUpperCase() + input.slice(1);
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
        {serviceList.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex w-full justify-between px-4 gap-2">
              <h1>{capitalizeFirstLetter(service.name)}</h1>
              <h1>${service.price}</h1>
            </div>
            <Button onClick={() => onDeleteServiceClick(service.name)}>
              Eliminar
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminPage;
