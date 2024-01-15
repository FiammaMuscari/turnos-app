"use client";

import { Card, CardFooter, CardHeader } from "../ui/card";
import { Header } from "./header";
import { Social } from "./social";

export const LoginForm = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Inicia sesión con un clic" />
      </CardHeader>
      <CardFooter>
        <Social />
      </CardFooter>
    </Card>
  );
};
