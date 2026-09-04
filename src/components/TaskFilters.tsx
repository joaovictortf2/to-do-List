"use client";

import type { TaskFilter } from "@/lib/types";

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
];

export default function TaskFilters({
  active,
  onChange,
  date,
  onDateChange,
}: {
  active: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  date: string;
  onDateChange: (date: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              active === filter.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <label className="ml-auto text-sm text-gray-600">
        Filtrar por data
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="ml-2 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900"
        />
      </label>
      {date && (
        <button
          onClick={() => onDateChange("")}
          className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Limpar data
        </button>
      )}
    </div>
  );
}
