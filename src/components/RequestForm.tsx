import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { RealEstateRequest } from '../types';

interface RequestFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<RealEstateRequest, 'id' | 'date' | 'createdBy'>) => void;
  initialData?: RealEstateRequest | null;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [type, setType] = useState(initialData?.type || '');
  const [source, setSource] = useState(initialData?.source || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setSource(initialData.source || '');
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    onSubmit({
      type,
      source: source || null,
      notes: notes || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-[2rem] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center z-20">
          <h2 className="text-2xl font-black text-slate-800">
            {initialData ? 'تعديل أو تحديث هذا الطلب' : 'إضافة طلب عقاري جديد'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">نوع الطلب *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">اختر نوع الطلب</option>
                <option value="أرض">أرض</option>
                <option value="شقة">شقة</option>
                <option value="فيلا">فيلا</option>
                <option value="دور">دور</option>
                <option value="عمارة">عمارة</option>
                <option value="محل">محل</option>
                <option value="مزرعة">مزرعة</option>
                <option value="استراحة">استراحة</option>
                <option value="مستودع">مستودع</option>
                <option value="قصر">قصر</option>
                <option value="مكتب">م مكتب</option>
                <option value="شاليه">شاليه</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">مصدر الطلب</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="مثال: من العميل مباشرة، مسوق، الخ..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ملاحظات والتفاصيل</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="أدخل أي ملاحظات إضافية أو وتفاصيل الطلب..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={20} />
              {initialData ? 'حفظ التعديلات' : 'إضافة الطلب'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
