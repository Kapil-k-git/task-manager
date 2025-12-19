"use client";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
};

type TaskCardProps = {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: Task["status"]) => Promise<void>;
  isDeleting?: boolean;
  isUpdating?: boolean;
};

export default function TaskCard({ task, onDelete, onStatusChange, isDeleting, isUpdating }: TaskCardProps) {
  const statusColors = {
    todo: "bg-gray-100 text-gray-700 border-gray-300",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-300",
    done: "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-all ${isDeleting ? 'opacity-50' : ''}`}>
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
            <div className="relative inline-block">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
                disabled={isUpdating || isDeleting}
                className={`text-xs font-medium pl-3 pr-8 py-1.5 rounded-full border cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none ${statusColors[task.status]}`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1rem"
                }}
              >
                <option value="todo" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>To Do</option>
                <option value="in-progress" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>In Progress</option>
                <option value="done" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Done</option>
              </select>
              {isUpdating && (
                <div className="absolute right-7 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="animate-spin h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          disabled={isDeleting || isUpdating}
          className="self-end sm:self-start flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
          aria-label="Delete task"
        >
          {isDeleting ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}