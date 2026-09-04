import TaskBoard from "@/components/TaskBoard";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const INITIAL_TASKS = [
  {
    id: "local-1",
    user_id: "local-user",
    title: "Configurar a lista local",
    description: "Exemplo de tarefa criada no arquivo local do app.",
    due_date: new Date().toISOString().slice(0, 10),
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "local-2",
    user_id: "local-user",
    title: "Testar filtro de tarefas",
    description: "Use os filtros para alternar entre pendentes e concluídas.",
    due_date: new Date().toISOString().slice(0, 10),
    completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function TasksPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const { data: { user } } = await createClient().auth.getUser();

  if (!user) redirect("/login");

  return <TaskBoard initialTasks={INITIAL_TASKS} userEmail={user.email ?? ""} />;
}
