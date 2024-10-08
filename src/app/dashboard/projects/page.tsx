"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreateNewProjectDialog from "@/components/dashboard/CreateNewProjectDialog";
import ProjectCard from "@/components/dashboard/ProjectCard";

import type { ProjectType } from "../../../../types";

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-projects"],
    queryFn: async () => {
      const { data } = await axios.get("/api/get-projects");

      return data as { projects: ProjectType[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Some error occured. Please try again later!");
    }
  }
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
        {isLoading && (
          <div className="w-full flex justify-center">
            <Loader2 size={40} color="blue" className="animate-spin" />
          </div>
        )}
        {!isLoading &&
          (data?.projects && data?.projects.length > 0 ? (
            data.projects.map((project) => {
              return <ProjectCard key={project.id} project={project} />;
            })
          ) : (
            <div className="w-full flex justify-center">
              <p className="text-rose-600 font-semibold text-lg">
                No projects to show.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Projects;
