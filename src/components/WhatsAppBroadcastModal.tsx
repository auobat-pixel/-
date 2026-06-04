import React from 'react';
import { User, RealEstateListing } from '../types';
import { X, MessageCircle, Send } from 'lucide-react';
import { convertArabicToEnglishNumbers } from '../lib/utils';
import { motion } from 'motion/react';

interface WhatsAppBroadcastModalProps {
  listing: RealEstateListing;
  users: User[];
  onClose: () => void;
}

export const WhatsAppBroadcastModal: React.FC<WhatsAppBroadcastModalProps> = ({ listing, users, onClose }) => {
  const usersWithPhone = users.filter(u => u.phone && u.phone.trim().length >= 9);

  const getWhatsAppMessage = (user: User) => {
    let msg = `مرحباً ${user.name}،\n\n`;
    msg += `تمت إضافة عرض عقاري جديد يهمك:\n\n`;
    msg += `*النوع:* ${listing.type}\n`;
    msg += `*الموقع:* ${listing.location}\n`;
    if (listing.salePrice) msg += `*السعر حد:* ${listing.salePrice.toLocaleString()} ريال\n`;
    if (listing.bidPrice) msg += `*السعر سوم:* ${listing.bidPrice.toLocaleString()} ريال\n`;
    if (listing.pricePerMeterLimit) msg += `*سعر المتر حد:* ${listing.pricePerMeterLimit.toLocaleString()} ريال\n`;
    if (listing.pricePerMeterSaowm) msg += `*سعر المتر سوم:* ${listing.pricePerMeterSaowm.toLocaleString()} ريال\n`;
    if (listing.area) msg += `*المساحة:* ${listing.area} م²\n`;
    if (listing.direction) msg += `*الاتجاه:* ${listing.direction}\n`;
    if (listing.notes) msg += `\n*تفاصيل إضافية:*\n${listing.notes}\n`;
    msg += `\nلطفاً افتح النظام لمزيد من التفاصيل.`;
    
    return encodeURIComponent(msg);
  };

  const formatPhoneNumber = (phone: string) => {
    let clean = convertArabicToEnglishNumbers(phone).replace(/\D/g, '');
    if (clean.startsWith('05')) {
      clean = '966' + clean.substring(1);
    }
    return clean;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] shadow-2xl p-6 max-w-lg w-full flex flex-col max-h-[80vh] relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex flex-col items-center text-center mt-2">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <MessageCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">تنبيه الأعضاء عبر الواتساب</h2>
          <p className="text-slate-500 font-medium">تم إضافة العرض بنجاح. يمكنك الآن تنبيه الأعضاء المسجلة أرقامهم على الواتساب.</p>
        </div>

        {usersWithPhone.length === 0 ? (
          <div className="bg-yellow-50 text-yellow-700 p-6 rounded-2xl text-center border border-yellow-100 mb-6">
            <p className="font-bold mb-2">لا يوجد أعضاء بأرقام واتساب</p>
            <p className="text-sm">قم بإضافة أرقام الجوال للأعضاء من خلال شاشة "إدارة الأعضاء".</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-3">
            {usersWithPhone.map(user => {
              const phone = formatPhoneNumber(user.phone!);
              const whatsappLink = `https://wa.me/${phone}?text=${getWhatsAppMessage(user)}`;
              
              return (
                <div key={user.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 font-sans" dir="ltr">{user.phone}</p>
                  </div>
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                  >
                    إرسال <Send size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          إنهاء وإغلاق
        </button>
      </motion.div>
    </div>
  );
};
