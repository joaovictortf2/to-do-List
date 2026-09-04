export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TaskFilter = "all" | "pending" | "completed";

export function getTaskDate(task: Pick<Task, "due_date" | "created_at">): string {
  return task.due_date ?? task.created_at.slice(0, 10);
}
