export type TaskType = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Review" | "Completed";
};

export type UserType = {
  email: string;
  name: string;
};

export type ProjectType = {
  status: "Live" | "Building";
  id: string;
  title: string;
  description?: string;
  tasks: TaskType[];
  updatedAt: Date;
};
