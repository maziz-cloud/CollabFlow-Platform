import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, GripVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignee_id: string | null;
  due_date: string | null;
}

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: 'bg-muted',
  medium: 'bg-primary',
  high: 'bg-warning',
  urgent: 'bg-destructive',
};

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-move hover:shadow-md transition-shadow"
      {...attributes}
      {...listeners}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-tight flex-1">
            {task.title}
          </CardTitle>
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={`${priorityColors[task.priority as keyof typeof priorityColors]} text-white text-xs`}
          >
            {task.priority}
          </Badge>
          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(task.due_date).toLocaleDateString()}
            </div>
          )}
        </div>
        {task.assignee_id && (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              U
            </AvatarFallback>
          </Avatar>
        )}
      </CardContent>
    </Card>
  );
}
