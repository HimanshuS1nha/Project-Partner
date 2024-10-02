export type TaskType = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Review" | "Completed";
};
