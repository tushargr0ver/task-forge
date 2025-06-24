import { useState, useMemo } from 'react';
import { Layout } from './Layout';
import { TaskSidebar } from './TaskSidebar';
import { TaskCard, Task } from './TaskCard';
import { TaskModal } from './TaskModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

// Sample data
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project presentation',
    description: 'Prepare slides and demo for the quarterly review meeting',
    category: 'work',
    status: 'in-progress',
    dueDate: new Date('2024-12-25'),
    createdAt: new Date('2024-12-15'),
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and vegetables for the week',
    category: 'shopping',
    status: 'todo',
    dueDate: new Date('2024-12-22'),
    createdAt: new Date('2024-12-18'),
  },
  {
    id: '3',
    title: 'Exercise routine',
    description: '30-minute cardio and strength training',
    category: 'health',
    status: 'done',
    dueDate: new Date('2024-12-20'),
    createdAt: new Date('2024-12-19'),
  },
  {
    id: '4',
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodations',
    category: 'personal',
    status: 'todo',
    dueDate: new Date('2024-12-28'),
    createdAt: new Date('2024-12-16'),
  }
];

export const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter tasks based on status, category, and search query
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [tasks, selectedStatus, selectedCategory, searchQuery]);

  // Calculate task counts for sidebar
  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task created",
      description: "Your new task has been added successfully.",
    });
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    });
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus }
        : task
    ));
    toast({
      title: "Status updated",
      description: `Task status changed to ${newStatus.replace('-', ' ')}.`,
    });
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <TaskSidebar
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            taskCounts={taskCounts}
          />
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <TaskSidebar
              selectedStatus={selectedStatus}
              onStatusChange={(status) => {
                setSelectedStatus(status);
                setIsSidebarOpen(false);
              }}
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => {
                setSelectedCategory(category);
                setIsSidebarOpen(false);
              }}
              taskCounts={taskCounts}
            />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between p-4 lg:p-6">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Tasks</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {filteredTasks.length} of {tasks.length} tasks
                  </p>
                </div>
              </div>
              <Button onClick={openCreateModal} className="h-9 lg:h-10" size="sm">
                <Plus className="mr-1 lg:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="px-4 lg:px-6 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 lg:h-10 w-full lg:max-w-md"
                />
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 lg:h-10 lg:w-10 text-muted-foreground" />
                </div>
                <h3 className="text-base lg:text-lg font-medium text-foreground mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4 text-sm lg:text-base">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first task.'}
                </p>
                {!searchQuery && (
                  <Button onClick={openCreateModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-3 lg:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleEditTask : handleCreateTask}
        editingTask={editingTask}
      />
    </Layout>
  );
};
