"use client";

import { GoPlus } from "react-icons/go";
import { MdEdit } from "react-icons/md";

import type { TaskType } from "../../../types";
import React from "react";

const TasksBoard = ({
  tasks,
  setTasks,
  title,
  color,
  setType,
  setIsVisible,
}: {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  title: "Pending" | "Review" | "Completed";
  color: "rose" | "indigo" | "green";
  setType: React.Dispatch<
    React.SetStateAction<"" | "Pending" | "Review" | "Completed">
  >;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
            setIsVisible(true);
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

              <MdEdit size={22} color="black" />
            </div>
          );
        })}
    </div>
  );
};

export default TasksBoard;
