"use client";

import { useState } from "react";
import { GoDotFill } from "react-icons/go";

import { Button } from "@/components/ui/button";
import TasksBoard from "@/components/dashboard/TasksBoard";

import type { TaskType } from "../../../../../types";

const Project = () => {
  const project = {
    title: "Todo App",
    status: "Live",
  };

  const [tasks, setTasks] = useState<TaskType[]>([
    {
      id: "1",
      title: "Create UI",
      startDate: "23-09-2024",
      endDate: "30-09-2024",
      status: "Review",
    },
  ]);
  return (
    <div className="px-40 mt-10 flex flex-col gap-y-12">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
          <p className="text-4xl font-semibold text-indigo-600">
            {project.title}
          </p>
          <div
            className={`${
              project.status === "Live" ? "bg-green-200" : "bg-rose-200"
            } w-fit px-3 py-1 rounded-full flex gap-x-1 items-center`}
          >
            <GoDotFill
              color={project.status === "Live" ? "green" : "red"}
              size={14}
            />
            <p
              className={`${
                project.status === "Live" ? "text-green-600" : "text-rose-600"
              } capitalize text-sm font-semibold`}
            >
              {project.status}
            </p>
          </div>
        </div>

        <div className="flex gap-x-4 items-center">
          <Button>Edit project</Button>
          <Button variant={"destructive"}>Delete project</Button>
        </div>
      </div>

      <div className="flex gap-x-12 justify-center">
        <TasksBoard
          title="Pending"
          tasks={tasks}
          setTasks={setTasks}
          color="rose"
        />
        <TasksBoard
          title="Review"
          tasks={tasks}
          setTasks={setTasks}
          color="indigo"
        />
        <TasksBoard
          title="Completed"
          tasks={tasks}
          setTasks={setTasks}
          color="green"
        />
      </div>
    </div>
  );
};

export default Project;
