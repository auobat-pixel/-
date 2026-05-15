import React from 'react';
import { RealEstateListing } from '../types';
import { formatCurrency } from '../lib/utils.ts';
import { MapPin } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface ShareCardProps {
  listing: RealEstateListing;
  cardRef: React.RefObject<HTMLDivElement>;
}

export const ShareCard: React.FC<ShareCardProps> = ({ listing, cardRef }) => {
  const salePrice = listing.salePrice || 0;
  const area = listing.area || 0;
  const totalWithTaxAndFee = salePrice * 1.075;
  const pricePerMeterNet = area > 0 ? salePrice / area : 0;
  const pricePerMeterTotal = area > 0 ? totalWithTaxAndFee / area : 0;

  return (
    <div className="flex justify-center p-4 bg-slate-900 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap');
        .naskh-font {
          font-family: 'Noto Naskh Arabic', serif !important;
        }
        .digits-sans {
          font-family: system-ui, -apple-system, sans-serif !important;
          letter-spacing: -0.02em;
        }
      `}</style>

      {/* FIXED MOBILE WALLPAPER DIMENSION: 1080 x 1920 */}
      <div 
        ref={cardRef}
        className="w-[1080px] h-[1920px] bg-[#fdfdfd] relative overflow-hidden flex flex-col shadow-2xl naskh-font text-slate-800"
        style={{ direction: 'rtl' }}
      >
        
        {/* Subtle unified background texture/gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-[#fdfdfd] to-[#f4f7f9] pointer-events-none" />

        {/* HERO IMAGE SECTION (Edge to Edge) */}
        <div className="relative w-full h-[650px] shrink-0 flex bg-slate-100">
          {listing.imageUrl ? (
            <img src={listing.imageUrl} className="w-full h-full object-cover" alt="Main View" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
               <MapPin size={100} className="mb-4" />
               <p className="text-4xl font-bold uppercase">لا تـوجد صور مـرفقة</p>
            </div>
          )}
          {listing.imageUrl2 && (
            <div className="absolute top-8 left-8 w-[350px] h-[350px] rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl">
              <img src={listing.imageUrl2} className="w-full h-full object-cover" alt="Second View" />
            </div>
          )}
          {/* Gradient Overlay to blend image nicely into background */}
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#fdfdfd] to-transparent" />
        </div>

        {/* CONTENT SECTION */}
        <div className="relative z-10 px-16 flex flex-col flex-1 shrink-0 pb-[240px] pt-8">
          
          {/* Headline - Type, Area, Direction */}
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="flex items-center gap-4 text-[2.8rem] font-bold text-blue-900">
               <span>{listing.type}</span>
               {listing.area > 0 && (
                 <>
                   <span className="text-slate-300">•</span>
                   <span className="flex items-baseline gap-2">
                     <span className="digits-sans tracking-tight">{listing.area.toLocaleString('en-US')}</span> 
                     <span className="text-[2.2rem]">م²</span>
                   </span>
                 </>
               )}
               {listing.direction && (
                 <>
                   <span className="text-slate-300">•</span>
                   <span>{listing.direction}</span>
                 </>
               )}
            </div>
            
            <h1 className="text-[4rem] font-bold text-slate-900 leading-tight">
              {listing.location}
            </h1>
          </div>

          {/* Divider */}
          <div className="w-2/3 mx-auto border-t-[3px] border-slate-200/60 rounded-full mb-8" />

          {/* Pricing List (No Boxes, Clean text) */}
          <div className="flex flex-col gap-6 px-8">
             
             {/* Net Price */}
             <div className="flex justify-between items-end border-b-[3px] border-slate-100 pb-4">
                <span className="text-[2.6rem] font-bold text-slate-600">السعر المطلوب (صافي)</span>
                <span className="text-[4.5rem] font-bold text-slate-800 digits-sans leading-none">
                  {salePrice ? formatCurrency(salePrice) : 'على السـوم'}
                </span>
             </div>

             {/* Total Price (Highlighted) */}
             {salePrice > 0 && (
               <div className="flex justify-between items-end border-b-[3px] border-slate-100 pb-4">
                  <div>
                    <span className="text-[2.6rem] font-bold text-blue-900 block border-b-2 border-transparent">السعر الإجمالي</span>
                    <span className="text-[1.8rem] text-slate-500 font-medium block mt-1">شامل 7.5% ضريبة القيمة المضافة والسعي</span>
                  </div>
                  <span className="text-[5rem] font-bold text-blue-700 digits-sans leading-none tracking-tight">
                    {formatCurrency(Math.round(totalWithTaxAndFee))}
                  </span>
               </div>
             )}

             {/* Price Per Meter Details */}
             {salePrice > 0 && area > 0 && (
               <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                     <span className="text-[2rem] text-slate-500 font-bold mb-2">سعر المتر (صافي)</span>
                     <span className="text-[3rem] font-bold text-slate-700 digits-sans">{formatCurrency(Math.round(pricePerMeterNet))}</span>
                  </div>
                  <div className="h-16 w-[2px] bg-slate-200 mx-4" /> {/* Vertical divider */}
                  <div className="flex flex-col text-left">
                     <span className="text-[2rem] text-blue-800 font-bold mb-2">سعر المتر (شامل 7.5%)</span>
                     <span className="text-[3rem] font-bold text-blue-700 digits-sans">{formatCurrency(Math.round(pricePerMeterTotal))}</span>
                  </div>
               </div>
             )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Dimensions */}
          {(listing.dimNorth || listing.dimSouth || listing.dimEast || listing.dimWest) && (
            <div className="flex flex-col mb-6 mt-6 mx-auto w-[90%]">
                <span className="text-[2.4rem] text-slate-400 font-bold mb-3 text-center">أطوال الأضلاع</span>
                <div className="grid grid-cols-2 gap-3 text-center">
                   <div className="bg-white border-2 border-slate-100 py-3 px-6 rounded-3xl flex flex-col items-center shadow-sm">
                     <span className="text-slate-400 text-[2rem] font-bold mb-1">شمالاً</span>
                     <span className="text-slate-800 text-[2.4rem] font-bold digits-sans">{listing.dimNorth || '-'}</span>
                   </div>
                   <div className="bg-white border-2 border-slate-100 py-3 px-6 rounded-3xl flex flex-col items-center shadow-sm">
                     <span className="text-slate-400 text-[2rem] font-bold mb-1">جنوباً</span>
                     <span className="text-slate-800 text-[2.4rem] font-bold digits-sans">{listing.dimSouth || '-'}</span>
                   </div>
                   <div className="bg-white border-2 border-slate-100 py-3 px-6 rounded-3xl flex flex-col items-center shadow-sm">
                     <span className="text-slate-400 text-[2rem] font-bold mb-1">شرقاً</span>
                     <span className="text-slate-800 text-[2.4rem] font-bold digits-sans">{listing.dimEast || '-'}</span>
                   </div>
                   <div className="bg-white border-2 border-slate-100 py-3 px-6 rounded-3xl flex flex-col items-center shadow-sm">
                     <span className="text-slate-400 text-[2rem] font-bold mb-1">غرباً</span>
                     <span className="text-slate-800 text-[2.4rem] font-bold digits-sans">{listing.dimWest || '-'}</span>
                   </div>
                </div>
            </div>
          )}

          {/* Notes */}
          {listing.notes && (
            <div className="px-12 text-center mt-2">
               <p className="text-[2.2rem] font-medium text-slate-600 leading-relaxed italic">
                 "{listing.notes}"
               </p>
            </div>
          )}

        </div>

        {/* FOOTER SECTION (Map and Contact Edge to Edge) */}
        <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t-[6px] border-slate-800 text-white flex items-center justify-between px-16 h-[220px] z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          
          {/* QR Code */}
          <div className="flex items-center gap-6">
             <div className="p-3 bg-white rounded-[1.2rem] shadow-xl">
               {listing.googleMapsUrl ? (
                 <QRCodeCanvas 
                   value={listing.googleMapsUrl} 
                   size={130}
                   level="H"
                   includeMargin={false}
                   fgColor="#0f172a"
                 />
               ) : (
                  <div className="w-[130px] h-[130px] bg-slate-50 flex items-center justify-center text-slate-300 rounded-[1rem]">
                    <MapPin size={40} />
                  </div>
               )}
             </div>
             <div className="flex flex-col">
                <span className="text-[2.4rem] font-bold mb-1">للوصول للموقع</span>
                <span className="text-[1.8rem] text-slate-400 font-medium tracking-wide">امسح الرمز بكاميرا الجوال</span>
             </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-end">
             <span className="text-[2.2rem] text-slate-400 font-bold mb-1 tracking-wide">
               {listing.marketerName ? `للتواصل مع المسوق: ${listing.marketerName}` : 'للتواصل مع المسوق'}
             </span>
             <span className="text-[4.2rem] font-bold text-white tracking-widest digits-sans leading-none mt-2" dir="ltr">
               {listing.contactPhone || '-'}
             </span>
          </div>

        </div>
        
      </div>
    </div>
  );
};


