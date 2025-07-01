import React from "react";
import { SignInButtonOAuth } from "@/app/(root)/(components)/SignInButtonOAuth"; // Assuming this path is correct
import SignInForm from "@/app/auth/signIn/(components)/SignInForm";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Welcome back! Sign in to your account.
          </p>
        </div>
        <SignInForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <SignInButtonOAuth className="w-full" providerType={"google"}>
          Sign in with Google
        </SignInButtonOAuth>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signUp" // Corrected href path
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
