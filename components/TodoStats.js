/* EXPORTS: TodoStats as default */

import { motion } from 'framer-motion';
import { CheckCircle, Circle, ListTodo } from 'lucide-react';

const TodoStats = ({ todos = [] }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const stats = [
    {
      icon: ListTodo,
      label: 'Total',
      value: totalTodos,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: completedTodos,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: Circle,
      label: 'Pending',
      value: pendingTodos,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`
              relative overflow-hidden rounded-xl border backdrop-blur-md
              bg-white/10 ${stat.borderColor}
              p-6 shadow-lg hover:shadow-xl transition-all duration-300
            `}
          >
            <div className={`absolute inset-0 ${stat.bgColor}`} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <motion.p
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`text-3xl font-bold ${stat.color}`}
                >
                  {stat.value}
                </motion.p>
              </div>
              <div className={`
                p-3 rounded-full ${stat.bgColor} ${stat.borderColor} border
              `}>
                <IconComponent className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        );
      })}

      {totalTodos > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="md:col-span-3 mt-4"
        >
          <div className="
            relative overflow-hidden rounded-xl border backdrop-blur-md
            bg-white/10 border-white/20 p-6 shadow-lg
          ">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Progress</h3>
              <span className="text-white/70 text-sm font-medium">
                {completionRate}% Complete
              </span>
            </div>
            
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              />
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-white/60">
              <span>{completedTodos} completed</span>
              <span>{pendingTodos} remaining</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export { TodoStats as default };