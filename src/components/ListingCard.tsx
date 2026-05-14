import React from 'react';
import { RealEstateListing } from '../types';
import { formatCurrency } from '../lib/utils.ts';
import { MapPin, Building2, Share2, Trash2, Map, Navigation, Phone, MessageCircle, FileText, Copy, Edit2, Calendar, MessageSquare, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

interface ListingCardProps {
  listing: RealEstateListing;
  onShare: (listing: RealEstateListing) => void;
  onDelete: (id: string) => void;
  onEdit: (listing: RealEstateListing) => void;
  onScheduleViewing?: (listing: RealEstateListing) => void;
  onViewComments: (listing: RealEstateListing) => void;
  onToggleFavorite: (listing: RealEstateListing) => void;
  currentUserId: string;
  isAdmin: boolean;
  canEdit: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onShare, onDelete, onEdit, onScheduleViewing, onViewComments, onToggleFavorite, currentUserId, isAdmin, canEdit }) => {
  const isFavorite = listing.favoritedBy?.includes(currentUserId) || false;

  const whatsappUrl = listing.contactPhone 
    ? `https://wa.me/${listing.contactPhone.replace(/^0/, '966')}` 
    : null;

  const copyTextSummary = () => {
    const text = `
*عرض عقاري*
📍 الموقع: ${listing.location}
🏘 النوع: ${listing.type}
🧭 الموقع في المدينة: ${listing.direction || 'غير محدد'}
📏 المساحة: ${listing.area ? listing.area + ' م²' : 'غير محدد'}
---
📐 أطوال الأضلاع:
• شمال: ${listing.dimNorth || '-'}
• جنوب: ${listing.dimSouth || '-'}
• شرق: ${listing.dimEast || '-'}
• غرب: ${listing.dimWest || '-'}
---
💰 سعر البيع: ${listing.salePrice ? formatCurrency(listing.salePrice) : 'غير محدد'}
📉 السوم: ${listing.bidPrice ? formatCurrency(listing.bidPrice) : 'لا يوجد'}
---
📞 للتواصل: ${listing.contactPhone || 'غير محدد'}
📝 ملاحظات: ${listing.notes || 'لا يوجد'}
🌍 موقع العقار: ${listing.googleMapsUrl || 'لا يوجد رابط'}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success('تم نسخ نص العرض مع رابط الموقع');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative group flex flex-col h-full ring-1 ring-slate-100"
    >
      {/* Property Image with Gradient Overlay */}
      <div className="relative h-56 w-full overflow-hidden shrink-0">
        {listing.imageUrl ? (
          <img 
            src={listing.imageUrl} 
            alt={listing.location} 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
            <Building2 size={48} strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
        
        {/* Floating Badges on Image */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-white/90 backdrop-blur-sm text-blue-600 shadow-sm flex items-center gap-1.5">
            <Building2 size={12} />
            {listing.type}
          </span>
          {listing.direction && (
            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-slate-900/40 backdrop-blur-sm text-white flex items-center gap-1.5 border border-white/20">
              <Navigation size={12} />
              {listing.direction}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(listing)}
          className={`absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-xl shadow-sm transition-all active:scale-90 z-10 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500'
          }`}
          title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Edit/Delete Floating Controls */}
        <div className="absolute top-16 left-4 flex flex-col gap-2 translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          {canEdit && (
            <>
              <button 
                onClick={() => onEdit(listing)}
                className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm text-slate-600 hover:text-blue-600 rounded-xl shadow-sm transition-all active:scale-90"
                title="تعديل"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(listing.id)}
                className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-500 rounded-xl shadow-sm transition-all active:scale-90"
                title="حذف"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Location Header */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-blue-500 text-[10px] uppercase font-black tracking-widest mb-2">
            <MapPin size={12} />
            <span>الموقع العقاري</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
            {listing.location}
          </h3>
          
          {listing.googleMapsUrl && (
            <a 
              href={listing.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Map size={14} className="text-slate-400" />
              <span>فتح على الخريطة الرئيسية</span>
            </a>
          )}
        </div>

        {/* Source info (Admin Only) */}
        {listing.source && isAdmin && (
          <div className="mb-4 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
             <p className="text-[10px] text-blue-400 font-black uppercase mb-1">المصدر الخاص</p>
             <p className="text-xs text-blue-700 font-bold leading-relaxed">
               {listing.source}
             </p>
          </div>
        )}

        {/* Pricing Dashboard */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50/30 group-hover:border-blue-100 transition-all duration-300">
            <span className="text-[10px] text-slate-400 block mb-1 font-black">السعر / الحد</span>
            <span className="text-sm font-black text-blue-600">
              {listing.salePrice ? formatCurrency(listing.salePrice) : 'غير محدد'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-slate-100 transition-all duration-300">
            <span className="text-[10px] text-slate-400 block mb-1 font-black">آخر سوم</span>
            <span className="text-sm font-black text-slate-700">
              {listing.bidPrice ? formatCurrency(listing.bidPrice) : 'لا يوجد'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          {/* Main Actions Row */}
          <div className="grid grid-cols-2 gap-3">
            {listing.contactPhone && (
              <a 
                href={`tel:${listing.contactPhone}`}
                className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                <Phone size={14} />
                إتصال
              </a>
            )}
            {whatsappUrl && (
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl text-xs font-black hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-green-100"
              >
                <MessageCircle size={14} />
                واتساب
              </a>
            )}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={copyTextSummary}
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black hover:bg-slate-100 transition-all border border-slate-100"
              title="نسخ نص العرض"
            >
              <Copy size={12} />
              نسخ النص
            </button>
            <button
              onClick={() => onScheduleViewing?.(listing)}
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all border border-slate-100"
            >
              <Calendar size={12} />
              المعاينة
            </button>
            <button
              onClick={() => onViewComments(listing)}
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all border border-slate-100"
            >
              <MessageSquare size={12} />
              التعليقات
            </button>
          </div>

          {/* Primary Share Button */}
          <button
            onClick={() => onShare(listing)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-[1.25rem] text-sm font-black transition-all hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95"
          >
            <Share2 size={16} />
            تصدير التصميم الإعلاني
          </button>
        </div>
      </div>
    </motion.div>
  );
};
