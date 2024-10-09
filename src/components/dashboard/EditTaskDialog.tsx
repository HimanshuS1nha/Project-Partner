"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

import {
  editTaskValidatorClient,
  type editTaskValidatorClientType,
} from "@/validators/edit-task-validator";
import type { TaskType } from "../../../types";

const EditTaskDialog = ({
  isVisible,
  setIsVisible,
  task,
  projectId,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  task?: TaskType;
  projectId: string;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<editTaskValidatorClientType>({
    defaultValues: {
      description: "",
      endDate: "",
      startDate: "",
      title: "",
    },
    resolver: zodResolver(editTaskValidatorClient),
  });

  const { mutate: handleEditTask, isPending } = useMutation({
    mutationKey: ["edit-task"],
    mutationFn: async (values: editTaskValidatorClientType) => {
      if (!task) {
        throw new Error("Task Id does not exist");
      }
      if (
        values.title === task?.title &&
        values.description === task.description &&
        values.startDate === task.startDate &&
        values.endDate === task.endDate
      ) {
        return {
          message: "Task details edited successfully",
          areValuesChanged: false,
        };
      }

      const { data } = await axios.post(`/api/edit-task/${task?.id}`, {
        ...values,
        projectId,
        status: task.status,
      });

      return { ...data, areValuesChanged: true } as {
        message: string;
        areValuesChanged: boolean;
      };
    },
    onSuccess: async (data) => {
      if (data.areValuesChanged) {
        await queryClient.invalidateQueries({
          queryKey: [`get-project-${projectId}`],
        });
      }
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

  useEffect(() => {
    if (task) {
      setValue("description", task.description);
      setValue("title", task.title);
      setValue("endDate", task.endDate);
      setValue("startDate", task.startDate);
    }
  }, [task, setValue]);
  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Click edit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit((data) => handleEditTask(data))}
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
              {isPending ? "Please wait..." : "Edit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
