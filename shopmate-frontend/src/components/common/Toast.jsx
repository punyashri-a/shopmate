import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const Toast = () => {
  const { toast } = useShopping();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-warm-lg bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 text-charcoal-800 dark:text-charcoal-100 max-w-md"
      >
        <div className="shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-sage-600 dark:text-sage-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-sage-600 dark:text-sage-400" />}
        </div>
        <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
