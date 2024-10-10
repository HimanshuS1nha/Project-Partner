"use client";

import React from "react";
import { GoPlus } from "react-icons/go";
import { MdDelete, MdEdit } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ZodError } from "zod";

import type { TaskType } from "../../../types";
import { changeTaskStatusValidator } from "@/validators/change-task-status-validator";

const TasksBoard = ({
  tasks,
  setTasks,
  title,
  color,
  setType,
  setIsCreateNewTaskDialogVisible,
  setIsEditTaskDialogVisible,
  setSelectedTask,
  setDeleteType,
  setIsDeleteConfirmarionDialogVisible,
  projectId,
}: {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  title: "Pending" | "Review" | "Completed";
  color: "rose" | "indigo" | "green";
  setType: React.Dispatch<
    React.SetStateAction<"" | "Pending" | "Review" | "Completed">
  >;
  setIsCreateNewTaskDialogVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setIsEditTaskDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskType | undefined>>;
  setIsDeleteConfirmarionDialogVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setDeleteType: React.Dispatch<React.SetStateAction<"project" | "task" | "">>;
  projectId: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: handleChangeTaskStatus } = useMutation({
    mutationKey: ["change-task-status"],
    mutationFn: async ({
      id,
      status,
    }: {
      status: "Pending" | "Review" | "Completed";
      id: string;
    }) => {
      const parsedData = await changeTaskStatusValidator.parseAsync({ status });

      const { data } = await axios.post(`/api/change-task-status/${id}`, {
        ...parsedData,
      });

      return data as { message: string };
    },
    onError: async (error) => {
      await queryClient.invalidateQueries({
        queryKey: [`get-project-${projectId}`],
      });

      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });
  return (
    <div
      className="flex flex-col gap-y-5 border border-gray-300 p-5 w-[400px] rounded-lg items-center"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();

        const newTasks = tasks.map((task) => {
          if (task.id === e.dataTransfer.getData("id")) {
            task.status = title;
          }
          return task;
        });

        setTasks(newTasks);
        handleChangeTaskStatus({
          status: title,
          id: e.dataTransfer.getData("id"),
        });
      }}
    >
      <div className="flex justify-between items-center w-full">
        <p className={`text-2xl font-semibold text-${color}-600`}>{title}</p>
        <GoPlus
          size={23}
          color={color === "rose" ? "red" : color === "indigo" ? "blue" : color}
          className="cursor-pointer"
          onClick={() => {
            setType(title);
            setIsCreateNewTaskDialogVisible(true);
          }}
        />
      </div>

      {tasks
        .filter((task) => task.status === title)
        .map((task) => {
          return (
            <div
              className="flex justify-between bg-gray-300 p-3 items-center rounded-lg w-[320px]"
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("id", task.id);
              }}
            >
              <div className="flex flex-col">
                <p className="font-semibold text-lg">{task.title}</p>
                <p className="text-xs text-gray-700">
                  {task.startDate} - {task.endDate}
                </p>
              </div>

              <div className="flex gap-x-2 items-center">
                <MdDelete
                  size={22}
                  color="black"
                  className="cursor-pointer"
                  onClick={() => {
                    setDeleteType("task");
                    setSelectedTask(task);
                    setIsDeleteConfirmarionDialogVisible(true);
                  }}
                />
                <MdEdit
                  size={22}
                  color="black"
                  className="cursor-pointer"
                  onClick={() => {
                    setDeleteType("project");
                    setSelectedTask(task);
                    setIsEditTaskDialogVisible(true);
                  }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default TasksBoard;
