"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";

import { useCurrentRole } from "@/hooks/use-current-role";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};

export const Navbar = () => {
  const pathname = usePathname();
  const role = useCurrentRole();
  const user = useCurrentUser();

  const userIsAdmin = role === UserRole.ADMIN;
  const userIsAuthenticated = !!user;
  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl shadow-sm mb-4 px-4">
      <div className="flex gap-x-2">
        <Button asChild variant={pathname === "/turno" ? "default" : "outline"}>
          <Link href="/turno">Sacar Turno</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/mis-turnos" ? "default" : "outline"}
        >
          <Link href="/mis-turnos">Mis turnos</Link>
        </Button>
        {userIsAuthenticated && userIsAdmin && (
          <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
          >
            <Link href="/admin">Admin</Link>
          </Button>
        )}
      </div>
      <UserButton />
    </nav>
  );
};
