import React, { useState } from 'react';
import { Appointment, User } from '../types';
import { Calendar as CalendarIcon, Clock, User as UserIcon, Phone, MapPin, X, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface CalendarViewProps {
  appointments: Appointment[];
  currentUser: User;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onClose: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ appointments, currentUser, onDelete, onUpdateStatus, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const selectedDateAppointments = appointments.filter(app => 
    selectedDate && isSameDay(parseISO(app.appointmentDate), selectedDate)
  ).sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-5xl w-full max-h-[90vh] flex flex-col relative"
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
              <CalendarIcon size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">تقويم المعاينات</h2>
          </div>
          <p className="text-slate-500 mr-16">إدارة مواعيد معاينة العقارات وجدولتها</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
          {/* Calendar Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {format(currentMonth, 'MMMM yyyy', { locale: ar })}
              </h3>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} className="rotate-180" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(day => (
                <div key={day} className="text-center text-sm font-bold text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map(day => {
                const hasAppointments = appointments.some(app => isSameDay(parseISO(app.appointmentDate), day));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border",
                      isToday(day) ? "border-blue-200 bg-blue-50 text-blue-600" : "border-transparent",
                      isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50",
                      !isSelected && !isToday(day) && "text-slate-700"
                    )}
                  >
                    <span className="font-bold">{format(day, 'd')}</span>
                    {hasAppointments && (
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full absolute bottom-2",
                        isSelected ? "bg-white" : "bg-blue-500"
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appointments List for selected day */}
          <div className="w-full lg:w-96 flex flex-col min-h-0">
            <div className="mb-4">
              <h3 className="font-black text-slate-900 border-b pb-2">
                مواعيد {selectedDate ? format(selectedDate, 'eeee d MMMM', { locale: ar }) : ''}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                  <p>لا توجد مواعيد في هذا اليوم</p>
                </div>
              ) : (
                selectedDateAppointments.map(app => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={app.id} 
                    className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:border-blue-200 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold">
                        <Clock size={12} />
                        {format(parseISO(app.appointmentDate), 'hh:mm a', { locale: ar })}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'completed')}
                          className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          title="تمت المقابلة"
                        >
                          <CheckCircle size={14} />
                        </button>
                        {(currentUser.role === 'admin' || currentUser.id === app.createdBy) && (
                          <button 
                            onClick={() => onDelete(app.id)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            title="حذف الموعد"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <UserIcon size={16} className="text-slate-400 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{app.clientName}</p>
                          <p className="text-xs text-slate-500 font-medium ltr-input text-right">{app.clientPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-slate-400 mt-0.5" />
                        <p className="text-sm font-bold text-slate-600 leading-tight">{app.listingLocation}</p>
                      </div>
                      {app.notes && (
                        <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-500 italic">
                          "{app.notes}"
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
