import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isDestructive = true
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-[#F6F6F0] rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative overflow-hidden"
          >
            {/* Visual Header */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              isDestructive ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">{message}</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${
                  isDestructive 
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {confirmLabel}
              </button>
              <button
                onClick={onCancel}
                className="w-full py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                {cancelLabel}
              </button>
            </div>

            <button 
              onClick={onCancel}
              className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
