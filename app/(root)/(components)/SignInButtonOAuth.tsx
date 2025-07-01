"use client";
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

interface SignInButtonOAuthProps {
  children: ReactNode;
  providerType: BuiltInProviderType;
  className?: string;
  options?: FormData | ({ redirectTo?: string } & Record<string, string>);
}

export function SignInButtonOAuth({
  children,
  providerType,
  className,
}: SignInButtonOAuthProps) {
  async function handleSignIn(providerType: BuiltInProviderType) {
    await signIn(providerType, { redirectTo: "/" }).catch(console.error);
  }
  return (
    <Button
      className={className}
      variant="outline"
      size="sm"
      onClick={() => handleSignIn(providerType)}
    >
      {children}
    </Button>
  );
}
