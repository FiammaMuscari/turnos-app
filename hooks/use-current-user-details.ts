import { useSession } from "next-auth/react";

export const useCurrentUserDetails = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    const { name, email } = session.user; // Desestructurar el objeto user para obtener name y email
    return { name, email };
  }

  return null; // Si no hay sesión o usuario, devolver null
};
