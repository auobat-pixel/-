import React from 'react';
import { RealEstateListing } from '../types';
import { formatCurrency } from '../lib/utils.ts';
import { MapPin, Building2, Tag, Navigation, Map, Phone, FileText } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { cn } from '../lib/utils.ts';

interface ShareCardProps {
  listing: RealEstateListing;
  cardRef: React.RefObject<HTMLDivElement>;
}

export const ShareCard: React.FC<ShareCardProps> = ({ listing, cardRef }) => {
  return (
    <div className="flex justify-center p-4 bg-slate-900 overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .custom-font {
          font-family: 'Tajawal', sans-serif !important;
        }
      `}</style>
      
      <div 
        ref={cardRef}
        className="w-[1080px] min-h-[1920px] bg-[#f8fafc] relative overflow-hidden flex flex-col shadow-2xl custom-font"
        style={{ direction: 'rtl' }}
      >
        {/* Modern Background Decorations */}
        <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-blue-600/[0.04] rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-indigo-600/[0.03] rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />

        {/* Top Spacer */}
        <div className="h-16 shrink-0" />

        {/* Hero Section */}
        <div className="relative z-10 px-16 mb-12 flex gap-8 h-[650px] shrink-0">
          {listing.imageUrl && (
             <div className={cn(
               "rounded-[4rem] overflow-hidden shadow-2xl relative border-[12px] border-white h-full",
               listing.imageUrl2 ? "w-1/2" : "w-full"
             )}>
               <img src={listing.imageUrl} alt="Main View" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
             </div>
          )}
          
          {listing.imageUrl2 && (
             <div className={cn(
               "rounded-[4rem] overflow-hidden shadow-2xl relative border-[12px] border-white h-full",
               listing.imageUrl ? "w-1/2" : "w-full"
             )}>
               <img src={listing.imageUrl2} alt="Second View" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
             </div>
          )}

          {!listing.imageUrl && !listing.imageUrl2 && (
             <div className="w-full h-full bg-white rounded-[4rem] border-[12px] border-white flex flex-col items-center justify-center shadow-sm relative overflow-hidden text-center">
               <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #1e293b 0%, transparent 50%)' }} />
               <MapPin size={100} className="mb-6 text-slate-200" />
               <p className="text-3xl font-bold text-slate-300 uppercase tracking-widest">لا تـوجد صور مـرفقة</p>
             </div>
          )}
        </div>

        {/* Content Body */}
        <div className="relative z-10 px-16 flex flex-col gap-10 pb-20 flex-1">
          
          {/* Main Attributes Header */}
          <div className="flex items-center justify-between mb-4">
             <div className="flex gap-6 border-b-2 border-transparent pb-0">
                 <div className="bg-slate-800 px-12 py-6 rounded-[2.5rem] text-white shadow-xl flex items-center gap-5">
                    <Building2 size={40} />
                    <span className="text-4xl font-bold">{listing.type}</span>
                 </div>
                 {listing.direction && (
                   <div className="bg-blue-600 px-12 py-6 rounded-[2.5rem] text-white shadow-xl flex items-center gap-5">
                      <Navigation size={40} className="text-white/90" />
                      <span className="text-4xl font-bold">{listing.direction}</span>
                   </div>
                 )}
             </div>
             
             {listing.area && (
                 <div className="bg-white border-2 border-slate-100 px-12 py-6 rounded-[2.5rem] text-slate-800 shadow-lg flex items-center justify-center gap-5">
                    <Map size={40} className="text-blue-600" />
                    <span className="text-[3.5rem] font-bold leading-none">{listing.area.toLocaleString('en-US')} <span className="text-2xl font-medium text-slate-500">م²</span></span>
                 </div>
             )}
          </div>

          <div className="flex items-start gap-6 pb-6 border-b-2 border-slate-200/60 mt-2">
             <MapPin className="text-blue-600 mt-2 shrink-0" size={56} />
             <h3 className="text-[3.5rem] font-bold text-slate-900 leading-snug">
               {listing.location}
             </h3>
          </div>

          {/* Pricing Section */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden mt-4">
            <div className="absolute top-0 right-0 w-3 h-full bg-blue-600" />
            
            <div className="flex justify-between items-start mb-10">
               <div>
                  <p className="text-3xl font-bold text-slate-500 mb-6">السـعر المطـلوب (حـد صافي)</p>
                  <p className="text-[6.5rem] leading-none font-black text-slate-900 tracking-tighter shadow-sm">
                    {listing.salePrice ? formatCurrency(listing.salePrice) : 'على السـوم'}
                  </p>
               </div>
               
               {listing.bidPrice && (
                 <div className="text-left bg-slate-50 px-10 py-8 rounded-[2.5rem] border border-slate-200 shadow-sm shrink-0">
                   <p className="text-2xl font-bold text-slate-500 mb-2 tracking-wide">آخـر سـوم</p>
                   <p className="text-5xl font-bold text-slate-800">{formatCurrency(listing.bidPrice)}</p>
                 </div>
               )}
            </div>

            {listing.salePrice && listing.area && (
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-6 w-full">
                   <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex flex-col justify-center shadow-sm">
                     <p className="text-2xl font-bold text-slate-500 mb-4 tracking-wide">سعر المتر (صافي بدون ضريبة وسعي)</p>
                     <p className="text-5xl font-bold text-slate-800">{formatCurrency(Math.round(listing.salePrice / listing.area))}</p>
                   </div>
                   <div className="bg-sky-50/50 p-8 rounded-3xl border border-sky-100 flex flex-col justify-center shadow-sm">
                     <p className="text-2xl font-bold text-sky-700 mb-4 tracking-wide">سعر المتر (شامل 7.5% ضريبة وسعي)</p>
                     <p className="text-5xl font-bold text-sky-900">{formatCurrency(Math.round((listing.salePrice / listing.area) * 1.075))}</p>
                   </div>
                </div>

                <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-10 rounded-3xl shadow-lg shadow-blue-600/20 relative overflow-hidden mt-6">
                   <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #fff 0%, transparent 50%)' }} />
                   <div className="relative z-10 flex flex-col">
                       <p className="text-[2rem] font-bold text-blue-100 mb-6 leading-relaxed">السعر الإجمالي (شامل 7.5% ضريبة القيمة المضافة وسعي المكتب)</p>
                       <p className="text-[5.5rem] leading-none font-black text-white tracking-tighter drop-shadow-md">{formatCurrency(Math.round(listing.salePrice * 1.075))}</p>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Details Row: Dimensions and Notes */}
          <div className="grid grid-cols-1 gap-8 mt-4">
            {(listing.dimNorth || listing.dimSouth || listing.dimEast || listing.dimWest) && (
                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl">
                   <div className="flex items-center gap-5 mb-10">
                     <div className="w-16 h-16 bg-slate-800/5 rounded-2xl flex items-center justify-center text-slate-800">
                       <Tag size={32} />
                     </div>
                     <p className="text-4xl font-bold text-slate-700">أطوال الأضلـاع</p>
                   </div>
                   <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                     <div className="flex justify-between border-b-2 pb-4 border-slate-100">
                        <span className="text-3xl font-bold text-slate-500">شمالاً:</span>
                        <span className="text-[2rem] font-bold text-slate-800">{listing.dimNorth || '-'}</span>
                     </div>
                     <div className="flex justify-between border-b-2 pb-4 border-slate-100">
                        <span className="text-3xl font-bold text-slate-500">جنوباً:</span>
                        <span className="text-[2rem] font-bold text-slate-800">{listing.dimSouth || '-'}</span>
                     </div>
                     <div className="flex justify-between border-b-2 pb-4 border-slate-100">
                        <span className="text-3xl font-bold text-slate-500">شرقاً:</span>
                        <span className="text-[2rem] font-bold text-slate-800">{listing.dimEast || '-'}</span>
                     </div>
                     <div className="flex justify-between border-b-2 pb-4 border-slate-100">
                        <span className="text-3xl font-bold text-slate-500">غرباً:</span>
                        <span className="text-[2rem] font-bold text-slate-800">{listing.dimWest || '-'}</span>
                     </div>
                   </div>
                </div>
            )}

            {listing.notes && (
              <div className="p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl flex gap-8 items-start mt-2">
                <div className="text-blue-600 shrink-0 mt-2 bg-blue-50 p-6 rounded-3xl"><FileText size={48} /></div>
                <p className="text-[2rem] font-bold text-slate-700 leading-normal pt-4">
                  {listing.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1" /> {/* flexible spacer to push footer down */}

          {/* Footer Interactive Area */}
          <div className="bg-white rounded-[4rem] p-10 border border-slate-100 flex items-center justify-between shadow-2xl relative overflow-hidden mt-10 mb-4 shrink-0">
             <div className="flex items-center gap-12 w-full">
                <div className="shrink-0 relative">
                   <div className="absolute -inset-2 bg-blue-600 rounded-[2.5rem] opacity-10 blur-xl" />
                   <div className="relative p-6 bg-white rounded-[2rem] shadow-xl border-2 border-slate-100" id="maps-qrcode">
                     {listing.googleMapsUrl ? (
                       <QRCodeCanvas 
                         value={listing.googleMapsUrl} 
                         size={260}
                         level="H"
                         includeMargin={false}
                         fgColor="#0f172a"
                       />
                     ) : (
                        <div className="w-[260px] h-[260px] bg-slate-50 flex items-center justify-center text-slate-200 rounded-2xl">
                          <MapPin size={80} />
                        </div>
                     )}
                   </div>
                </div>
                <div className="flex-1 px-4">
                   <p className="text-[2.6rem] font-bold text-slate-800 mb-6 leading-tight">امسـح الرمـز<br/><span className="text-blue-600">للوصول السريع</span><br/>لموقع العقار</p>
                   {listing.googleMapsUrl && (
                     <div className="inline-flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-full mt-2 shadow-lg">
                       <MapPin size={32} />
                       <span className="text-2xl font-bold">موقع جغـرافي دقيق</span>
                     </div>
                   )}
                </div>
                
                {/* Contact Phone */}
                <div className="text-left border-r-4 border-slate-100 pr-12">
                  <div className="flex justify-end items-center gap-4 mb-6 text-blue-600">
                    <span className="text-4xl font-bold text-slate-500">للتـواصل</span>
                    <Phone size={48} className="bg-blue-50 p-2 rounded-xl" />
                  </div>
                  <p className="text-[5rem] font-black text-slate-900 tracking-wider font-sans" style={{ direction: 'ltr' }}>
                    {listing.contactPhone || '-'}
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-6 bg-blue-600 w-full shrink-0" />
      </div>
    </div>
  );
};

