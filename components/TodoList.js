/* EXPORTS: TodoList as default */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';

const TodoList = ({ 
  todos, 
  onToggleComplete, 
  onDeleteTodo, 
  onEditTodo, 
  filter = 'all' 
}) => {
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-white/60 text-lg mb-2">
          {filter === 'active' ? 'No active todos' : 
           filter === 'completed' ? 'No completed todos' : 
           'No todos yet'}
        </div>
        <div className="text-white/40 text-sm">
          {filter === 'all' && "Add your first todo above!"}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {filteredTodos.map((todo) => (
          <motion.div
            key={todo.id}
            variants={itemVariants}
            layout
            exit="exit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="p-4 flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggleComplete(todo.id)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-white/30"
                  />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <motion.div
                    animate={{
                      opacity: todo.completed ? 0.6 : 1,
                      scale: todo.completed ? 0.95 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className={`text-white font-medium break-words ${
                      todo.completed ? 'line-through' : ''
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`text-white/70 text-sm mt-1 break-words ${
                        todo.completed ? 'line-through' : ''
                      }`}>
                        {todo.description}
                      </p>
                    )}
                    {todo.priority && (
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          todo.priority === 'high' 
                            ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                            : todo.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30'
                            : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                        }`}>
                          {todo.priority} priority
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTodo(todo)}
                      className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTodo(todo.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export { TodoList as default };