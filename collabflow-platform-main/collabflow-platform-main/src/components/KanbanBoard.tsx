import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  due_date: string | null;
  position: number;
}

interface KanbanBoardProps {
  projectId: string;
}

const columns = [
  { id: 'todo', title: 'To Do', color: '#94a3b8' },
  { id: 'in_progress', title: 'In Progress', color: '#3b82f6' },
  { id: 'review', title: 'Review', color: '#f59e0b' },
  { id: 'done', title: 'Done', color: '#10b981' },
];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`
        },
        () => fetchTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true });

    if (data) setTasks(data);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Determine if we're dropping on a column or another task
    const overColumn = columns.find(col => col.id === over.id);
    const overTask = tasks.find(t => t.id === over.id);

    let newStatus = activeTask.status;
    if (overColumn) {
      newStatus = overColumn.id as Task['status'];
    } else if (overTask) {
      newStatus = overTask.status;
    }

    // Update task status and position
    if (activeTask.status !== newStatus || active.id !== over.id) {
      const updatedTasks = tasks.map(task => {
        if (task.id === activeTask.id) {
          return { ...task, status: newStatus };
        }
        return task;
      });

      // Reorder tasks within the same column
      const columnTasks = updatedTasks.filter(t => t.status === newStatus);
      const oldIndex = columnTasks.findIndex(t => t.id === active.id);
      const newIndex = overTask 
        ? columnTasks.findIndex(t => t.id === over.id)
        : columnTasks.length - 1;

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
        const finalTasks = updatedTasks.map(task => {
          if (task.status === newStatus) {
            const newPosition = reorderedColumnTasks.findIndex(t => t.id === task.id);
            return { ...task, position: newPosition };
          }
          return task;
        });

        setTasks(finalTasks);

        // Update in database
        await supabase
          .from('tasks')
          .update({ status: newStatus, position: newIndex })
          .eq('id', activeTask.id);
      }
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            projectId={projectId}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 opacity-80">
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
