
export type Todo = {
  id: string;
  title: string;
  content: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED",
  authorId: "string";
  deadline: string;
  createdAt: string;
  updatedAt: string;
}
