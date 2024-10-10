"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import CreateNewProjectDialog from "@/components/dashboard/CreateNewProjectDialog";
import DeleteConfirmationDialog from "@/components/dashboard/DeleteConfirmationDialog";
import ProjectCard from "@/components/dashboard/ProjectCard";

import type { ProjectType } from "../../../../types";

const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isCreateNewProjectDialogVisible, setIsCreateNewProjectDialogVisible] =
    useState(false);
  const [
    isDeleteConfirmationDialogVisible,
    setIsDeleteConfirmationDialogVisible,
  ] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    if (data?.projects) {
      setProjects(data.projects);
    }
  }, [data]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!data?.projects) {
        return;
      }

      if (searchQuery === "") {
        setProjects(data.projects);
      }

      const filteredProjects = data.projects.filter((project) =>
        project.title.includes(searchQuery)
      );

      setProjects(filteredProjects);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery]);
  return (
    <div className="mt-10 px-20 flex flex-col gap-y-8 pb-10">
      <CreateNewProjectDialog
        isVisible={isCreateNewProjectDialogVisible}
        setIsVisible={setIsCreateNewProjectDialogVisible}
      />

      <DeleteConfirmationDialog
        isVisible={isDeleteConfirmationDialogVisible}
        setIsVisible={setIsDeleteConfirmationDialogVisible}
        projectId={selectedProjectId}
        type="project"
      />

      <div className="flex gap-x-4 items-center">
        <Input
          placeholder="Search projects"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => setIsCreateNewProjectDialogVisible(true)}>
          New Project
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-7 items-center gap-y-6">
        {isLoading && (
          <div className="w-full flex justify-center">
            <Loader size="lg" />
          </div>
        )}
        {!isLoading &&
          (projects.length > 0 ? (
            projects.map((project) => {
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  setSelectedProjectId={setSelectedProjectId}
                  setIsDeleteConfirmationDialogVisible={
                    setIsDeleteConfirmationDialogVisible
                  }
                />
              );
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
