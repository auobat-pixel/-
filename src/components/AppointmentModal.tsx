import React, { useState } from 'react';
import { RealEstateListing, Appointment, User } from '../types';
import { Calendar, Clock, User as UserIcon, Phone, FileText, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

interface AppointmentModalProps {
  listing: RealEstateListing;
  currentUser: User;
  onSchedule: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ listing, currentUser, onSchedule, onClose }) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !clientPhone || !date || !time) {
      toast.error('يرجى ملء جميع الحقول الأساسية');
      return;
    }

    const appointmentDate = new Date(`${date}T${time}`).toISOString();

    onSchedule({
      listingId: listing.id,
      listingLocation: listing.location,
      clientName,
      clientPhone,
      appointmentDate,
      notes,
      status: 'pending',
      createdBy: currentUser.id
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-lg w-full relative"
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
              <Calendar size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">جدولة موعد معاينة</h2>
          </div>
          <p className="text-slate-500 mr-16">للعقار في: {listing.location}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
              <UserIcon size={14} />
              اسم العميل
            </label>
            <input 
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="اسم العميل الرباعي"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
              <Phone size={14} />
              رقم التواصل
            </label>
            <input 
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="05XXXXXXXX"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ltr-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
                <Calendar size={14} />
                التاريخ
              </label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
                <Clock size={14} />
                الوقت
              </label>
              <input 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 mr-2 flex items-center gap-2">
              <FileText size={14} />
              ملاحظات إضافية
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل خاصة بالموعد..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-4"
          >
            تأكيد جدولة الموعد
          </button>
        </form>
      </motion.div>
    </div>
  );
};
