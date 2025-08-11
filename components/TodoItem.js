/* EXPORTS: TodoItem */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit2, Trash2, X, Save } from 'lucide-react';

const TodoItem = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit,
  index 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className="group relative"
    >
      <div className={`
        relative p-4 rounded-2xl backdrop-blur-xl border border-white/20
        transition-all duration-300 hover:border-white/30
        ${todo.completed 
          ? 'bg-white/5 shadow-lg shadow-green-500/10' 
          : 'bg-white/10 shadow-xl shadow-black/10 hover:bg-white/15'
        }
      `}>
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative flex items-center gap-3">
          {/* Complete/Uncomplete Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(todo.id)}
            className={`
              flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
              transition-all duration-300 backdrop-blur-sm
              ${todo.completed
                ? 'bg-green-500/80 border-green-400/50 text-white shadow-lg shadow-green-500/25'
                : 'border-white/30 hover:border-green-400/50 hover:bg-green-500/10'
              }
            `}
          >
            <AnimatePresence>
              {todo.completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  <Check size={12} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Todo Text / Edit Input */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSave}
                className="
                  w-full bg-transparent text-white placeholder-white/50
                  border-none outline-none text-sm font-medium
                  focus:ring-2 focus:ring-blue-400/50 rounded-lg px-2 py-1
                  backdrop-blur-sm bg-white/10
                "
                autoFocus
                placeholder="Enter todo text..."
              />
            ) : (
              <motion.span
                layout
                className={`
                  block text-sm font-medium transition-all duration-300
                  ${todo.completed 
                    ? 'text-white/60 line-through' 
                    : 'text-white/90'
                  }
                `}
              >
                {todo.text}
              </motion.span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit-actions"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex gap-1"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSave}
                    className="
                      p-2 rounded-lg backdrop-blur-sm bg-green-500/20 
                      text-green-400 hover:bg-green-500/30 
                      border border-green-500/30 transition-all duration-200
                    "
                  >
                    <Save size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCancel}
                    className="
                      p-2 rounded-lg backdrop-blur-sm bg-red-500/20 
                      text-red-400 hover:bg-red-500/30 
                      border border-red-500/30 transition-all duration-200
                    "
                  >
                    <X size={14} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="default-actions"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditing(true)}
                    className="
                      p-2 rounded-lg backdrop-blur-sm bg-blue-500/20 
                      text-blue-400 hover:bg-blue-500/30 
                      border border-blue-500/30 transition-all duration-200
                    "
                  >
                    <Edit2 size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(todo.id)}
                    className="
                      p-2 rounded-lg backdrop-blur-sm bg-red-500/20 
                      text-red-400 hover:bg-red-500/30 
                      border border-red-500/30 transition-all duration-200
                    "
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Completion timestamp */}
        {todo.completed && todo.completedAt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 pt-2 border-t border-white/10"
          >
            <span className="text-xs text-white/40">
              Completed {new Date(todo.completedAt).toLocaleDateString()}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export { TodoItem };