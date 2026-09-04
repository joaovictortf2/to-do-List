"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getTaskDate, type Task, type TaskFilter } from "@/lib/types";
import TaskForm from "@/components/TaskForm";
import TaskFilters from "@/components/TaskFilters";
import TaskItem from "@/components/TaskItem";

export default function TaskBoard({
  initialTasks,
  userEmail,
}: {
  initialTasks: Task[];
  userEmail: string;
}) {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("local-tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        setTasks(initialTasks);
      }
    }
  }, [initialTasks]);

  useEffect(() => {
    window.localStorage.setItem("local-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filter === "all" || (filter === "pending" ? !task.completed : task.completed);
      const matchesDate = !dateFilter || getTaskDate(task) === dateFilter;
      return matchesStatus && matchesDate;
    });
  }, [tasks, filter, dateFilter]);

  async function handleCreate(title: string, description: string, dueDate: string) {
    setError(null);

    const newTask: Task = {
      id: `local-${Date.now()}`,
      user_id: userEmail,
      title,
      description: description || null,
      due_date: dueDate || null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
  }

  async function handleToggle(id: string, completed: boolean) {
    setError(null);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed, updated_at: new Date().toISOString() } : t))
    );
  }

  async function handleUpdate(id: string, title: string, description: string) {
    setError(null);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title,
              description: description || null,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );
  }

  async function handleDelete(id: string) {
    setError(null);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-6 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Minhas tarefas</h1>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Sair
        </button>
      </header>

      <TaskForm onCreate={handleCreate} />

      <TaskFilters
        active={filter}
        onChange={setFilter}
        date={dateFilter}
        onDateChange={setDateFilter}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {filteredTasks.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma tarefa encontrada.</p>
      ) : (
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
