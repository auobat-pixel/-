import React from 'react';
import { Pencil, Trash2, CalendarDays, Share2 } from 'lucide-react';
import { RealEstateRequest } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

interface RequestCardProps {
  request: RealEstateRequest;
  onEdit: (request: RealEstateRequest) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onEdit,
  onDelete,
  canEdit
}) => {
  const handleShare = async () => {
    const text = `طلب عقاري: ${request.type}\n` +
      (request.source ? `المصدر: ${request.source}\n` : '') +
      (request.notes ? `التفاصيل: ${request.notes}\n` : '') +
      `التاريخ: ${new Date(request.date).toLocaleDateString('ar-SA')}`;
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success('تم نسخ تفاصيل الطلب بنجاح');
    } catch (err) {
      toast.error('حدث خطأ أثناء نسخ الطلب');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold border border-slate-100">
              {request.type}
            </span>
          </div>

          <div className="flex gap-2 transition-opacity">
            <button
              onClick={handleShare}
              className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-600 hover:text-white transition-colors"
              title="مشاركة (نسخ النص)"
            >
              <Share2 size={18} />
            </button>
            {canEdit && (
              <>
                <button
                  onClick={() => onEdit(request)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                  title="تعديل"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(request.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
                  title="حذف"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {request.source && (
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-400 mb-1">المصدر</h4>
            <p className="text-slate-700 font-medium">{request.source}</p>
          </div>
        )}

        {request.notes && (
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-400 mb-1">التفاصيل والملاحظات</h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              {request.notes}
            </p>
          </div>
        )}

        <div className="flex items-center text-slate-400 text-xs mt-auto">
          <CalendarDays size={14} className="ml-1" />
          <span>{new Date(request.date).toLocaleDateString('ar-SA')}</span>
        </div>
      </div>
    </motion.div>
  );
};
