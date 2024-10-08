"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  createTaskValidatorClient,
  type createTaskValidatorClientType,
} from "@/validators/create-task-validator";
import toast from "react-hot-toast";

const CreateNewTaskDialog = ({
  isVisible,
  setIsVisible,
  type,
  projectId,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  type: "Pending" | "Review" | "Completed" | "";
  projectId: string;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<createTaskValidatorClientType>({
    defaultValues: {
      description: "",
      endDate: "",
      startDate: "",
      title: "",
    },
    resolver: zodResolver(createTaskValidatorClient),
  });

  const { mutate: handleCreateTask, isPending } = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async (values: createTaskValidatorClientType) => {
      const { data } = await axios.post("/api/create-task", {
        ...values,
        status: type,
        projectId,
      });

      return data as { message: string };
    },
    onSuccess: (data) => {
      reset();
      toast.success(data.message);
      setIsVisible(false);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create {type} Task</DialogTitle>
          <DialogDescription>
            Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit((data) => handleCreateTask(data))}
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter task's title"
                required
                {...register("title", { required: true })}
              />
              {errors.title && (
                <p className="text-rose-600 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="description">
                Description
                <span className="text-rose-500 text-xs">(Optional)</span>
              </Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter task's description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-rose-600 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                required
                {...register("startDate", { required: true })}
              />
              {errors.startDate && (
                <p className="text-rose-600 text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                required
                {...register("endDate", { required: true })}
              />
              {errors.endDate && (
                <p className="text-rose-600 text-sm">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Please wait..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewTaskDialog;
