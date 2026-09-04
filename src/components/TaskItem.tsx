"use client";

import { useState } from "react";
import { getTaskDate, type Task } from "@/lib/types";

export default function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, title: string, description: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    await onUpdate(task.id, title.trim(), description.trim());
    setSaving(false);
    setEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Excluir esta tarefa?")) return;
    setDeleting(true);
    await onDelete(task.id);
  }

  if (editing) {
    return (
      <li className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task.id, e.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <div className="min-w-0 flex-1">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`block text-left text-sm font-medium ${
              task.completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </button>
          {expanded && (
            <div className="mt-1 space-y-1 text-sm text-gray-600">
              <p className="whitespace-pre-wrap">{task.description || "Sem descrição."}</p>
              <p>Data: {new Date(`${getTaskDate(task)}T00:00:00`).toLocaleDateString("pt-BR")}</p>
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Excluir
          </button>
        </div>
      </div>
    </li>
  );
}
