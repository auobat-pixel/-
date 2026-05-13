import React, { useState } from 'react';
import { Alert, User } from '../types';
import { Bell, Tag, Clock, Trash2, X, Plus, AlertCircle, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface AlertsPanelProps {
  alerts: Alert[];
  currentUser: User;
  onAddAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'isRead'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onClose: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, currentUser, onAddAlert, onDeleteAlert, onToggleRead, onClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<Alert['type']>('normal');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    onAddAlert({
      title,
      message,
      type,
      targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
      createdBy: currentUser.id
    });

    setTitle('');
    setMessage('');
    setTargetDate('');
    setShowAddForm(false);
  };

  const sortedAlerts = [...alerts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-2xl w-full max-h-[85vh] flex flex-col relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Bell size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">التنبيهات والعروض</h2>
          </div>
          <p className="text-slate-500 mr-16">إدارة العروض الخاصة ومواعيد التذكير الهامة</p>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 pr-2">
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 space-y-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                <Plus size={18} />
                إضافة تنبيه جديد
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input 
                    type="text" 
                    placeholder="عنوان التنبيه أو العرض"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <textarea 
                    placeholder="تفاصيل التنبيه..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold resize-none"
                  />
                </div>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as Alert['type'])}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  <option value="normal">تنبيه عام</option>
                  <option value="offer">عرض خاص</option>
                  <option value="reminder">تذكير بموعد</option>
                </select>
                <input 
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  حفظ
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-600 rounded-3xl font-black mb-8 hover:bg-blue-50 transition-colors flex items-center justify-center gap-3"
            >
              <Plus size={20} />
              إضافة عرض أو تنبيه جديد
            </button>
          )}

          <div className="space-y-4">
            {sortedAlerts.length === 0 ? (
              <div className="text-center py-12 text-slate-300">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                <p>لا يوجد تنبيهات نشطة حالياً</p>
              </div>
            ) : (
              sortedAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={cn(
                    "p-5 rounded-[2rem] border transition-all relative overflow-hidden",
                    alert.type === 'offer' ? "bg-amber-50/50 border-amber-100" : 
                    alert.type === 'reminder' ? "bg-blue-50/50 border-blue-100" : 
                    "bg-white border-slate-100",
                    alert.isRead ? "opacity-60" : "opacity-100 shadow-sm"
                  )}
                >
                  {/* Icon Badge */}
                  <div className={cn(
                    "absolute -right-4 -top-4 w-16 h-16 rounded-full flex items-center justify-center opacity-5",
                    alert.type === 'offer' ? "bg-amber-600" : 
                    alert.type === 'reminder' ? "bg-blue-600" : 
                    "bg-slate-600"
                  )}>
                    {alert.type === 'offer' ? <Tag size={40} /> : <Bell size={40} />}
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center",
                        alert.type === 'offer' ? "bg-amber-100 text-amber-600" : 
                        alert.type === 'reminder' ? "bg-blue-100 text-blue-600" : 
                        "bg-slate-100 text-slate-600"
                      )}>
                        {alert.type === 'offer' ? <Tag size={16} /> : <Bell size={16} />}
                      </div>
                      <h4 className="font-black text-slate-800">{alert.title}</h4>
                    </div>
                    <div className="flex gap-1">
                      {(currentUser.role === 'admin' || currentUser.id === alert.createdBy) && (
                        <button 
                          onClick={() => onDeleteAlert(alert.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 font-medium mb-4 pr-10">{alert.message}</p>

                  <div className="flex items-center justify-between mt-auto pr-10">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {format(parseISO(alert.createdAt), 'dd MMMM', { locale: ar })}
                      </span>
                      {alert.targetDate && (
                        <span className="flex items-center gap-1 text-blue-500">
                          <Calendar size={12} />
                          ينتهي في: {format(parseISO(alert.targetDate), 'dd MMMM', { locale: ar })}
                        </span>
                      )}
                    </div>
                    {!alert.isRead && (
                      <button 
                        onClick={() => onToggleRead(alert.id, true)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        تعليم كمقروء
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
