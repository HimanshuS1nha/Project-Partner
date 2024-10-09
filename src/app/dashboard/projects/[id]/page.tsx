"use client";

import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import TasksBoard from "@/components/dashboard/TasksBoard";
import CreateNewTaskDialog from "@/components/dashboard/CreateNewTaskDialog";
import EditProjectDialog from "@/components/dashboard/EditProjectDialog";
import EditTaskDialog from "@/components/dashboard/EditTaskDialog";

import type { TaskType } from "../../../../../types";
import type { ProjectType } from "../../../../../types";
import DeleteProjectDialog from "@/components/dashboard/DeleteProjectDialog";

const Project = ({ params }: { params: { id: string } }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isCreateNewTaskDialogVisible, setIsCreateNewTaskDialogVisible] =
    useState(false);
  const [isEditProjectDialogVisible, setIsEditProjectDialogVisible] =
    useState(false);
  const [isEditTaskDialogVisible, setIsEditTaskDialogVisible] = useState(false);
  const [isDeleteProjectDialogVisible, setIsDeleteProjectDialogVisible] =
    useState(false);
  const [type, setType] = useState<"" | "Pending" | "Review" | "Completed">("");
  const [selectedTask, setSelectedTask] = useState<TaskType>();

  const { data, isLoading, error } = useQuery({
    queryKey: [`get-project-${params.id}`],
    queryFn: async () => {
      const { data } = await axios.get(`/api/get-project/${params.id}`);

      return data as { project: ProjectType };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Some error occured. Please try again later!");
    }
  }

  useEffect(() => {
    if (data?.project) {
      setTasks(data.project.tasks);
    }
  }, [data]);
  return (
    <div className="px-40 mt-10 flex flex-col gap-y-12">
      <CreateNewTaskDialog
        type={type}
        isVisible={isCreateNewTaskDialogVisible}
        setIsVisible={setIsCreateNewTaskDialogVisible}
        projectId={params.id}
      />

      <EditProjectDialog
        isVisible={isEditProjectDialogVisible}
        setIsVisible={setIsEditProjectDialogVisible}
        project={data?.project}
      />

      <EditTaskDialog
        isVisible={isEditTaskDialogVisible}
        setIsVisible={setIsEditTaskDialogVisible}
        projectId={params.id}
        task={selectedTask}
      />

      <DeleteProjectDialog
        isVisible={isDeleteProjectDialogVisible}
        setIsVisible={setIsDeleteProjectDialogVisible}
        projectId={params.id}
      />

      {isLoading && (
        <div className="w-full flex justify-center">
          <Loader size="lg" />
        </div>
      )}

      {data?.project && (
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-x-2 items-center">
              <p className="text-4xl font-semibold text-indigo-600">
                {data?.project.title}
              </p>
              <div
                className={`${
                  data?.project.status === "Live"
                    ? "bg-green-200"
                    : "bg-rose-200"
                } w-fit px-3 py-1 rounded-full flex gap-x-1 items-center`}
              >
                <GoDotFill
                  color={data?.project.status === "Live" ? "green" : "red"}
                  size={14}
                />
                <p
                  className={`${
                    data?.project.status === "Live"
                      ? "text-green-600"
                      : "text-rose-600"
                  } capitalize text-sm font-semibold`}
                >
                  {data?.project.status}
                </p>
              </div>
            </div>

            <div className="flex gap-x-4 items-center">
              <Button onClick={() => setIsEditProjectDialogVisible(true)}>
                Edit project
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => setIsDeleteProjectDialogVisible(true)}
              >
                Delete Project
              </Button>
            </div>
          </div>

          <div className="flex gap-x-12 justify-center">
            {[
              { title: "Pending", color: "rose" },
              { title: "Review", color: "indigo" },
              { title: "Completed", color: "green" },
            ].map((item) => {
              return (
                <TasksBoard
                  title={item.title as "Pending" | "Review" | "Completed"}
                  tasks={tasks}
                  setTasks={setTasks}
                  color={item.color as "rose" | "indigo" | "green"}
                  key={item.title}
                  setType={setType}
                  setIsCreateNewTaskDialogVisible={
                    setIsCreateNewTaskDialogVisible
                  }
                  setIsEditTaskDialogVisible={setIsEditTaskDialogVisible}
                  setSelectedTask={setSelectedTask}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Project;
