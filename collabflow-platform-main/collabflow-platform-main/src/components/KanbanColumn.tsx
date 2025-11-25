import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee_id: string | null;
  due_date: string | null;
  position: number;
}

interface Column {
  id: string;
  title: string;
  color: string;
}

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  projectId: string;
}

export function KanbanColumn({ column, tasks, projectId }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      <div
        ref={setNodeRef}
        className="flex flex-col bg-muted/30 rounded-lg p-4 min-h-[500px]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold">{column.title}</h3>
            <span className="text-sm text-muted-foreground">({tasks.length})</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 flex-1">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>

      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        projectId={projectId}
        defaultStatus={column.id as any}
      />
    </>
  );
}
