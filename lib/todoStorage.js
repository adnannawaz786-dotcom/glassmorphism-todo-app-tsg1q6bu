/* EXPORTS: saveTodos, loadTodos, generateId, clearTodos, getStorageStats, exportTodos, importTodos, migrateLegacyData */

const STORAGE_KEY = 'glassmorphism-todos';

const saveTodos = (todos) => {
  try {
    const todosWithTimestamp = {
      todos,
      lastModified: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todosWithTimestamp));
    return true;
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
    return false;
  }
};

const loadTodos = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // Handle legacy format (direct array)
    if (Array.isArray(parsed)) {
      return parsed;
    }
    
    // Handle new format with metadata
    if (parsed.todos && Array.isArray(parsed.todos)) {
      return parsed.todos;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const clearTodos = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear todos from localStorage:', error);
    return false;
  }
};

const getStorageStats = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        exists: false,
        size: 0,
        todoCount: 0,
        lastModified: null
      };
    }

    const parsed = JSON.parse(stored);
    const todos = Array.isArray(parsed) ? parsed : parsed.todos || [];
    
    return {
      exists: true,
      size: new Blob([stored]).size,
      todoCount: todos.length,
      lastModified: parsed.lastModified || null,
      version: parsed.version || 'legacy'
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      exists: false,
      size: 0,
      todoCount: 0,
      lastModified: null,
      error: error.message
    };
  }
};

const exportTodos = () => {
  try {
    const todos = loadTodos();
    const exportData = {
      todos,
      exportDate: new Date().toISOString(),
      version: '1.0',
      source: 'glassmorphism-todo-app'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Failed to export todos:', error);
    return false;
  }
};

const importTodos = (jsonString, mergeMode = false) => {
  try {
    const importData = JSON.parse(jsonString);
    let importedTodos = [];
    
    // Handle different import formats
    if (Array.isArray(importData)) {
      importedTodos = importData;
    } else if (importData.todos && Array.isArray(importData.todos)) {
      importedTodos = importData.todos;
    } else {
      throw new Error('Invalid import format');
    }
    
    // Validate todo structure
    const validTodos = importedTodos.filter(todo => 
      todo && 
      typeof todo.id === 'string' && 
      typeof todo.text === 'string' &&
      typeof todo.completed === 'boolean'
    );
    
    if (mergeMode) {
      const existingTodos = loadTodos();
      const existingIds = new Set(existingTodos.map(todo => todo.id));
      const newTodos = validTodos.filter(todo => !existingIds.has(todo.id));
      const mergedTodos = [...existingTodos, ...newTodos];
      return saveTodos(mergedTodos) ? mergedTodos : null;
    } else {
      return saveTodos(validTodos) ? validTodos : null;
    }
  } catch (error) {
    console.error('Failed to import todos:', error);
    return null;
  }
};

const migrateLegacyData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    const parsed = JSON.parse(stored);
    
    // Already in new format
    if (!Array.isArray(parsed)) return false;
    
    // Migrate to new format
    const migratedData = {
      todos: parsed,
      lastModified: new Date().toISOString(),
      version: '1.0',
      migrated: true
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));
    return true;
  } catch (error) {
    console.error('Failed to migrate legacy data:', error);
    return false;
  }
};

export { saveTodos, loadTodos, generateId, clearTodos, getStorageStats, exportTodos, importTodos, migrateLegacyData };