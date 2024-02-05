import { useSession } from "next-auth/react";

export const useCurrentUserDetails = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    const { name, email } = session.user;
    return { name, email };
  }

  return null;
};
