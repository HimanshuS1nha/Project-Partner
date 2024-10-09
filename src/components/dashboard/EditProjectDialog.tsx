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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createProjectValidator,
  type createProjectValidatorType,
} from "@/validators/create-project-validator";
import type { ProjectType } from "../../../types";

const EditProjectDialog = ({
  isVisible,
  setIsVisible,
  project,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  project?: ProjectType;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setValue,
  } = useForm<createProjectValidatorType>({
    defaultValues: {
      description: "",
      status: "" as never,
      title: "",
    },
    resolver: zodResolver(createProjectValidator),
  });

  const { mutate: handleEditProject, isPending } = useMutation({
    mutationKey: ["edit-project"],
    mutationFn: async (values: createProjectValidatorType) => {
      if (!project) {
        throw new Error("Project Id does not exist");
      }
      if (
        values.title === project?.title &&
        values.description === project.description &&
        values.status === project.status
      ) {
        return {
          message: "Project details edited successfully",
          areValuesChanged: false,
        };
      }

      const { data } = await axios.post(`/api/edit-project/${project?.id}`, {
        ...values,
      });
      return { ...data, areValuesChanged: true } as {
        message: string;
        areValuesChanged: boolean;
      };
    },
    onSuccess: async (data) => {
      if (data.areValuesChanged) {
        await queryClient.invalidateQueries({ queryKey: ["get-project"] });
        await queryClient.invalidateQueries({ queryKey: ["get-projects"] });
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
    if (project) {
      setValue("title", project.title);
      setValue("description", project.description);
      setValue("status", project.status);
    }
  }, [project]);
  return (
    <Dialog open={isVisible} onOpenChange={() => setIsVisible(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Click edit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-y-8"
          onSubmit={handleSubmit((data) => handleEditProject(data))}
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter project's title"
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
                placeholder="Enter project's description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-rose-600 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                required
                defaultValue={getValues("status")}
                onValueChange={(value) =>
                  setValue("status", value as "Live" | "Building")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent id="status">
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Building">Building</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-rose-600 text-sm">{errors.status.message}</p>
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

export default EditProjectDialog;
