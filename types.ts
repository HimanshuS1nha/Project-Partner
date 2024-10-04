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
