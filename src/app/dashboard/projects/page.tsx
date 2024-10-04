"use client";

import { useState } from "react";
import Link from "next/link";
import { IoEllipsisVertical } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { formatDistanceToNowStrict } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateNewProjectDialog from "@/components/dashboard/CreateNewProjectDialog";

const Projects = () => {
  const dummyProjects = [
    {
      id: "1",
      title: "Todo App",
      status: "Live",
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Music App",
      status: "Building",
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Random App",
      status: "Live",
      updatedAt: new Date(),
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="mt-10 px-20 flex flex-col gap-y-8 pb-10">
      <CreateNewProjectDialog
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />

      <div className="flex gap-x-4 items-center">
        <Input placeholder="Search projects" />
        <Button onClick={() => setIsVisible(true)}>New Project</Button>
      </div>

      <div className="flex flex-wrap gap-x-7 items-center gap-y-6">
        {dummyProjects.map((project) => {
          return (
            <div
              className="border border-gray-300 w-[420px] rounded-lg py-3 px-6 flex flex-col gap-y-5"
              key={project.id}
            >
              <div className="flex flex-col gap-y-1.5">
                <div className="flex justify-between items-center">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="hover:text-indigo-600 delay-100 transition-all"
                  >
                    <p className="text-lg font-semibold">{project.title}</p>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <IoEllipsisVertical size={20} color="black" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{project.title}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-rose-600 focus:text-white cursor-pointer">
                        Delete project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

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
                      project.status === "Live"
                        ? "text-green-600"
                        : "text-rose-600"
                    } capitalize text-sm font-semibold`}
                  >
                    {project.status}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">50% completed</p>
                  <p className="font-semibold">20/40</p>
                </div>

                <div className="flex w-full">
                  <div className={`h-1.5 bg-indigo-600 w-[50%]`} />
                  <div className={`h-1.5 bg-gray-300 w-[50%]`} />
                </div>

                <div className="flex gap-x-1.5">
                  <p className="text-gray-700 text-sm">Last updated</p>
                  <p className="font-semibold text-sm">
                    {formatDistanceToNowStrict(project.updatedAt)} ago
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
