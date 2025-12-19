"use client";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
};

type TaskCardProps = {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
};

export default function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  const statusColors = {
    todo: "bg-gray-100 text-gray-700 border-gray-300",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-300",
    done: "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 break-words">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-3 break-words">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${statusColors[task.status]}`}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="self-end sm:self-start flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
          aria-label="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}