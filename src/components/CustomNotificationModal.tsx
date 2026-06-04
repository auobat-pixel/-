import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send } from 'lucide-react';
import { db, cleanData } from '../lib/firebase.ts';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface CustomNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

export const CustomNotificationModal: React.FC<CustomNotificationModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('الرجاء إدخال عنوان ومحتوى الإشعار');
      return;
    }

    setIsSubmitting(true);
    try {
      if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        await Notification.requestPermission();
      }

      await addDoc(collection(db, 'notifications'), cleanData({
        title: title.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id || 'system'
      }));
      
      toast.success('تم إرسال الإشعار لجميع المستخدمين');
      setTitle('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء إرسال الإشعار');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="custom-notification-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-[#F6F6F0] rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col"
            dir="rtl"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
              <h2 className="text-xl font-black text-slate-900">إرسال إشعار للمستخدمين</h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الإشعار</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: تنبيه هام، عرض جديد..."
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">محتوى الإشعار</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب التنبيه أو الرسالة التي تريد إرسالها لجميع الأعضاء..."
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 h-32 resize-none outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold p-3 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الإشعار'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
