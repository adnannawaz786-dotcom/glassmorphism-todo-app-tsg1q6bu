/* EXPORTS: default (HomePage) */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Check, X, CheckCircle2, Circle } from 'lucide-react';

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Todo Glass
          </h1>
          <p className="text-white/80 text-lg">
            Beautiful glassmorphism todo app
          </p>
        </motion.div>

        {/* Add Todo Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 mb-6 border border-white/30 shadow-xl"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new todo..."
              className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTodo}
              className="bg-white/30 hover:bg-white/40 backdrop-blur-sm rounded-xl px-6 py-3 text-white border border-white/30 transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-2 mb-6 border border-white/30 shadow-xl"
        >
          <div className="flex gap-1">
            {[
              { key: 'all', label: `All (${todos.length})` },
              { key: 'active', label: `Active (${activeCount})` },
              { key: 'completed', label: `Completed (${completedCount})` }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? 'bg-white/30 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="backdrop-blur-lg bg-white/20 rounded-2xl p-4 border border-white/30 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  {/* Complete Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleComplete(todo.id)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={24} className="text-green-300" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </motion.button>

                  {/* Todo Text */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="w-full bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`text-white ${
                          todo.completed ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {editingId === todo.id ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={saveEdit}
                          className="text-green-300 hover:text-green-200 transition-colors"
                        >
                          <Check size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={cancelEdit}
                          className="text-red-300 hover:text-red-200 transition-colors"
                        >
                          <X size={20} />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(todo.id, todo.text)}
                          className="text-blue-300 hover:text-blue-200 transition-colors"
                        >
                          <Edit3 size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-300 hover:text-red-200 transition-colors"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTodos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20">
              <Circle size={48} className="text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg">
                {filter === 'active' && 'No active todos'}
                {filter === 'completed' && 'No completed todos'}
                {filter === 'all' && 'No todos yet. Add one above!'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;