"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import TaskFilters from "@/components/TaskFilters";
import Toast from "@/components/Toast";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
};

type ToastMessage = {
  message: string;
  type: "success" | "error" | "info";
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [markingAllDone, setMarkingAllDone] = useState(false);

  const router = useRouter();

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchTasks = useCallback(async () => {
    let query = supabase.from("tasks").select("*").order("created_at", {
      ascending: false,
    });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (debouncedSearch) {
      query = query.ilike("title", `%${debouncedSearch}%`);
    }

    const { data, error } = await query;

    if (error) {
      showToast("Failed to load tasks", "error");
    } else {
      setTasks(data || []);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    if (!loading) {
      fetchTasks();
    }
  }, [fetchTasks, loading]);

  const handleCreateTask = async (
    title: string,
    description: string,
    status: "todo" | "in-progress" | "done"
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showToast("User not authenticated", "error");
      return;
    }

    const { data, error } = await supabase.from("tasks").insert({
      title,
      description,
      status,
      user_id: user.id,
    }).select().single();

    if (error) {
      showToast("Failed to create task", "error");
    } else {
      setTasks(prev => [data, ...prev]);
      showToast("Task created successfully", "success");
    }
  };

  const handleDeleteTask = async (id: string) => {
    setDeletingTaskId(id);

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      showToast("Failed to delete task", "error");
      setDeletingTaskId(null);
    } else {
      setTasks(prev => prev.filter(task => task.id !== id));
      showToast("Task deleted", "success");
      setDeletingTaskId(null);
    }
  };

  const handleStatusChange = async (id: string, status: Task["status"]) => {
    setUpdatingTaskId(id);

    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", id);

    if (error) {
      showToast("Failed to update task", "error");
      setUpdatingTaskId(null);
    } else {
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, status } : task
      ));
      showToast("Task status updated", "success");
      setUpdatingTaskId(null);
    }
  };

  const handleMarkAllDone = async () => {
    setMarkingAllDone(true);

    const tasksToUpdate = tasks.filter(t => t.status !== "done").map(t => t.id);

    if (tasksToUpdate.length === 0) {
      showToast("All tasks are already done", "info");
      setMarkingAllDone(false);
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({ status: "done" })
      .in("id", tasksToUpdate);

    if (error) {
      showToast("Failed to mark all done", "error");
    } else {
      setTasks(prev => prev.map(task =>
        tasksToUpdate.includes(task.id) ? { ...task, status: "done" as const } : task
      ));
      showToast(`Marked ${tasksToUpdate.length} tasks as done`, "success");
    }

    setMarkingAllDone(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Tasks</h1>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">To Do</p>
            <p className="text-2xl font-bold text-gray-700">{taskStats.todo}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-300 shadow-sm">
            <p className="text-sm text-blue-700 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-300 shadow-sm">
            <p className="text-sm text-green-700 mb-1">Done</p>
            <p className="text-2xl font-bold text-green-600">{taskStats.done}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <TaskForm onSubmit={handleCreateTask} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <TaskFilters
                searchValue={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
              <button
                onClick={handleMarkAllDone}
                disabled={markingAllDone || taskStats.todo + taskStats.inProgress === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2"
              >
                {markingAllDone ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Mark All Done"
                )}
              </button>
            </div>

            {tasks.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg">No tasks found</p>
                <p className="text-gray-400 text-sm mt-1">Create your first task to get started</p>
              </div>
            )}

            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                  isDeleting={deletingTaskId === task.id}
                  isUpdating={updatingTaskId === task.id}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}