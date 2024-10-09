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

const DeleteConfirmationDialog = ({
  isVisible,
  projectId,
  setIsVisible,
  type,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: string;
  type: "project" | "task" | "all-projects";
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: handleDeleteProject, isPending: deleteProjectPending } =
    useMutation({
      mutationKey: ["delete-project"],
      mutationFn: async () => {
        if (!projectId) {
          throw new Error("Project does not exist");
        }

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

  const {
    mutate: handleDeleteAllProjects,
    isPending: deleteAllProjectsPending,
  } = useMutation({
    mutationKey: ["delete-all-projects"],
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/delete-all-projects`);

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
            Do you want to delete{" "}
            {type === "project"
              ? "this project"
              : type === "all-projects"
              ? "all your projects"
              : "this task"}
            ?{" "}
            <span className="text-rose-600">This action is irreversible.</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={"ghost"}
            onClick={() => setIsVisible(false)}
            disabled={deleteAllProjectsPending || deleteProjectPending}
          >
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => {
              if (type === "project") {
                handleDeleteProject();
              } else if (type === "all-projects") {
                handleDeleteAllProjects();
              }
            }}
            disabled={deleteAllProjectsPending || deleteProjectPending}
          >
            {deleteAllProjectsPending || deleteProjectPending
              ? "Please wait..."
              : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
