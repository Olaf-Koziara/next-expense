"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserRemover from "@/app/(root)/user/(components)/UserRemover";
import { Separator } from "@/components/ui/separator";
import { User2, Mail } from "lucide-react";
import UserPasswordChanger from "./(components)/UserPasswordChanger";

export default function UserSettings() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/auth/signIn");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-lg py-8">
      <Card className="shadow-lg border border-muted bg-background/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User2 className="w-6 h-6 text-primary" />
            User Settings
          </CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-base">
              <User2 className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              <span>{session.user?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{session.user?.email}</span>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="space-y-6">
            <UserPasswordChanger />
            <UserRemover />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
