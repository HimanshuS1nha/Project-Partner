"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const DeleteProjectDialog = ({
  isVisible,
  projectId,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationKey: ["delete-project"],
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/delete-project/${projectId}`);

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get-projects"] });
      toast.success(data.message);
      setIsVisible(false);
      router.replace("/dashboard/projects");
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });
  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Do you want to delete this project?{" "}
            <span className="text-rose-600">This action is irreversible.</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={"ghost"}
            onClick={() => setIsVisible(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => handleDelete()}
            disabled={isPending}
          >
            {isPending ? "Please wait..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectDialog;
