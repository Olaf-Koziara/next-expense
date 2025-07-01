"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignOutProps {
  children: React.ReactNode;
}

export function SignOut({ children }: SignOutProps) {
  return (
    <form
      action={async () => {
        await signOut({ redirect: true, redirectTo: "/auth/signIn" });
      }}
    >
      <Button type="submit">{children}</Button>
    </form>
  );
}
