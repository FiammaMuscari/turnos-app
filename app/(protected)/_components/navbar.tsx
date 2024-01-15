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
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm m-auto">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">Client</Link>
        </Button>

        {userIsAuthenticated && userIsAdmin && (
          <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
          >
            <Link href="/admin">Admin</Link>
          </Button>
        )}

        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
