/* EXPORTS: TodoFilters as default */

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { All, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TodoFilters = ({ 
  currentFilter, 
  onFilterChange, 
  todoCounts = { all: 0, active: 0, completed: 0, urgent: 0 } 
}) => {
  const filters = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: All,
      count: todoCounts.all,
      color: 'bg-blue-500/20 text-blue-700 border-blue-200'
    },
    {
      id: 'active',
      label: 'Active',
      icon: Clock,
      count: todoCounts.active,
      color: 'bg-orange-500/20 text-orange-700 border-orange-200'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      count: todoCounts.completed,
      color: 'bg-green-500/20 text-green-700 border-green-200'
    },
    {
      id: 'urgent',
      label: 'Urgent',
      icon: AlertCircle,
      count: todoCounts.urgent,
      color: 'bg-red-500/20 text-red-700 border-red-200'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mb-6"
    >
      {/* Desktop Filter Tabs */}
      <div className="hidden md:flex space-x-2 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = currentFilter === filter.id;
          
          return (
            <motion.div
              key={filter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex-1"
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                onClick={() => onFilterChange(filter.id)}
                className={`
                  w-full h-12 relative overflow-hidden transition-all duration-300
                  ${isActive 
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-md border-white/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{filter.label}</span>
                  {filter.count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={`
                        ml-1 h-5 px-2 text-xs font-semibold
                        ${isActive ? filter.color : 'bg-white/20 text-white'}
                      `}
                    >
                      {filter.count}
                    </Badge>
                  )}
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="md:hidden">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3">
          <div className="grid grid-cols-2 gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = currentFilter === filter.id;
              
              return (
                <motion.div
                  key={filter.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => onFilterChange(filter.id)}
                    className={`
                      w-full h-16 flex flex-col items-center justify-center space-y-1
                      ${isActive 
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-md border-white/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-1">
                      <Icon className="w-4 h-4" />
                      {filter.count > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`
                            h-4 px-1.5 text-xs
                            ${isActive ? filter.color : 'bg-white/20 text-white'}
                          `}
                        >
                          {filter.count}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-medium">{filter.label}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <p className="text-white/60 text-sm">
          {currentFilter === 'all' && `Showing all ${todoCounts.all} tasks`}
          {currentFilter === 'active' && `${todoCounts.active} active tasks remaining`}
          {currentFilter === 'completed' && `${todoCounts.completed} tasks completed`}
          {currentFilter === 'urgent' && `${todoCounts.urgent} urgent tasks need attention`}
        </p>
      </motion.div>
    </motion.div>
  );
};

export { TodoFilters as default };