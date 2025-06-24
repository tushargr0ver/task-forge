
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskSidebarProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  taskCounts: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

const statusOptions = [
  { value: 'all', label: 'All Tasks', key: 'total' },
  { value: 'todo', label: 'To-Do', key: 'todo' },
  { value: 'in-progress', label: 'In Progress', key: 'inProgress' },
  { value: 'done', label: 'Done', key: 'done' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
];

export const TaskSidebar = ({
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  taskCounts
}: TaskSidebarProps) => {
  return (
    <div className="w-full lg:w-64 bg-muted/30 border-r border-border p-4 space-y-6 h-full overflow-y-auto">
      {/* Status Filter */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          Filter by Status
        </h3>
        <div className="space-y-1">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedStatus === option.value ? "default" : "ghost"}
              className="w-full justify-between h-9 text-left"
              onClick={() => onStatusChange(option.value)}
            >
              <span>{option.label}</span>
              <Badge variant="secondary" className="ml-2 shrink-0">
                {taskCounts[option.key as keyof typeof taskCounts]}
              </Badge>
            </Button>
          ))}
        </div>
      </Card>

      {/* Category Filter */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          Filter by Category
        </h3>
        <div className="space-y-1">
          {categoryOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedCategory === option.value ? "default" : "ghost"}
              className="w-full justify-start h-9 text-left"
              onClick={() => onCategoryChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
