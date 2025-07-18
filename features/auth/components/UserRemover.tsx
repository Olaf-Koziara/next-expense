"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useStatus from "@/hooks/useStatus";
import { signOut } from "@/auth";
import { userService } from "@/components/services/user";

const UserRemover = () => {
  const { message, status, setStatus } = useStatus();
  const handleUserAccountRemove = async () => {
    setStatus("pending");
    await userService.remove().then(() => {
      setStatus("success");
      signOut({ redirectTo: "/auth/signIn" });
    });
  };
  return (
    <div>
      <Dialog open={status === "success" ? false : undefined}>
        <DialogTrigger className="button px-4 py-2 bg-red-700 rounded-md text-sm flex items-center gap-2">
          <Trash size={16} /> Remove account
        </DialogTrigger>
        <DialogContent className="text-center">
          Are you sure you want to remove your account?
          <div className="flex justify-between">
            <DialogClose className="button px-4 py-2 bg-red-700 rounded-md text-sm flex items-center gap-2">
              Cancel
            </DialogClose>
            <DialogClose
              onClick={handleUserAccountRemove}
              className="button px-4 py-2 bg-green-700 rounded-md text-sm flex items-center gap-2"
            >
              Confirm
            </DialogClose>
          </div>
          {status === "error" && (
            <Alert variant={"destructive"}>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRemover;
