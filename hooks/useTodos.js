/* EXPORTS: useTodos */

import { useState, useEffect, useCallback } from 'react';
import { saveTodos, loadTodos } from '../lib/todoStorage';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    const loadStoredTodos = async () => {
      try {
        const storedTodos = loadTodos();
        setTodos(storedTodos);
      } catch (error) {
        console.error('Failed to load todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredTodos();
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

  // Add new todo
  const addTodo = useCallback((text) => {
    if (!text.trim()) return;

    const newTodo = {
      id: Date.now() + Math.random(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
  }, []);

  // Toggle todo completion status
  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  }, []);

  // Edit todo text
  const editTodo = useCallback((id, newText) => {
    if (!newText.trim()) return;

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              text: newText.trim(),
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  }, []);

  // Delete todo
  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  // Delete all completed todos
  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  // Mark all todos as completed or active
  const toggleAllTodos = useCallback(() => {
    const hasIncomplete = todos.some(todo => !todo.completed);
    
    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: hasIncomplete,
        updatedAt: new Date().toISOString()
      }))
    );
  }, [todos]);

  // Get filtered todos based on current filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // Get todo counts
  const todoStats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  };

  // Check if all todos are completed
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    isLoading,
    todoStats,
    allCompleted,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    toggleAllTodos
  };
};

export { useTodos };