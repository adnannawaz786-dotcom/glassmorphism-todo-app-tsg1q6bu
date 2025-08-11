```javascript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const TodoForm = ({ onAddTodo, isOpen, onToggle }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    const newTodo = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await onAddTodo(newTodo);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      onToggle();
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    onToggle();
  };

  const priorityColors = {
    low: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
    high: 'bg-red-500/20 border-red-500/30 text-red-300'
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg backdrop-blur-sm border border-white/20"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="h-6 w-6" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Form Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onClick={handleCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ 
            scale: isOpen ? 1 : 0.9, 
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : 20
          }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Add New Todo</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white/90 font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter todo title..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                  required
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white/90 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description (optional)..."
                  rows={3}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20 resize-none"
                />
              </div>

              {/* Priority Selection */}
              <div className="space-y-2">
                <Label className="text-white/90 font-medium">Priority</Label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all duration-200 ${
                        priority === level
                          ? priorityColors[level]
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex-1 text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    'Add Todo'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export { TodoForm };
```