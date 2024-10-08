import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { IoEllipsisVertical } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProjectType } from "../../../types";

const ProjectCard = ({ project }: { project: ProjectType }) => {
  const completedTasks = project.tasks.filter(
    (task) => task.status === "Completed"
  );
  return (
    <div className="border border-gray-300 w-[420px] rounded-lg py-3 px-6 flex flex-col gap-y-5">
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
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href={`/dashboard/projects/${project.id}`}>Open</Link>
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
              project.status === "Live" ? "text-green-600" : "text-rose-600"
            } capitalize text-sm font-semibold`}
          >
            {project.status}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between items-center">
          <p className="font-semibold">
            {Math.floor(completedTasks.length / project.tasks.length) || 0}%
            completed
          </p>
          <p className="font-semibold">
            {completedTasks.length}/{project.tasks.length}
          </p>
        </div>

        <div className="flex w-full">
          <div
            className={`h-1.5 bg-indigo-600`}
            style={{
              width: `${(completedTasks.length * 100) / project.tasks.length}%`,
            }}
          />
          <div
            className={`h-1.5 bg-gray-300`}
            style={{
              width: `${
                100 -
                ((completedTasks.length * 100) / project.tasks.length || 0)
              }%`,
            }}
          />
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
};

export default ProjectCard;
