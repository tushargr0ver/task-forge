
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'personal' | 'shopping' | 'health';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: Date;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const getStatusBadgeClass = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'status-badge status-todo';
      case 'in-progress':
        return 'status-badge status-in-progress';
      case 'done':
        return 'status-badge status-done';
      default:
        return 'status-badge status-todo';
    }
  };

  const getCategoryBadgeClass = (category: Task['category']) => {
    switch (category) {
      case 'work':
        return 'status-badge category-work';
      case 'personal':
        return 'status-badge category-personal';
      case 'shopping':
        return 'status-badge category-shopping';
      case 'health':
        return 'status-badge category-health';
      default:
        return 'status-badge category-personal';
    }
  };

  const isOverdue = task.dueDate < new Date() && task.status !== 'done';

  return (
    <div className="task-card group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-base lg:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {task.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {task.description}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity h-8 w-8 p-0 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={getCategoryBadgeClass(task.category)}>
          {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`${getStatusBadgeClass(task.status)} cursor-pointer hover:opacity-80 transition-opacity`}>
              {task.status === 'in-progress' ? 'In Progress' : 
               task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>
              To-Do
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'done')}>
              Done
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs lg:text-sm">
        <span className={`text-muted-foreground ${isOverdue ? 'text-destructive font-medium' : ''}`}>
          Due: {format(task.dueDate, 'MMM dd, yyyy')}
          {isOverdue && ' (Overdue)'}
        </span>
        <span className="text-xs text-muted-foreground">
          Created {format(task.createdAt, 'MMM dd')}
        </span>
      </div>
    </div>
  );
};
