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
      {/* FIXED MOBILE WALLPAPER DIMENSION: 1080 x 1920 */}
      <div 
        ref={cardRef}
        className="w-[1080px] h-[1920px] bg-slate-100/50 relative overflow-hidden flex flex-col shadow-2xl font-sans text-slate-800"
        style={{ direction: 'rtl' }}
      >
        
        {/* Subtle unified background texture/gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-200/30 pointer-events-none" />
        
        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0">
          <img src="/logo.png" alt="عروضي" className="w-[800px] h-[800px] object-contain grayscale sepia brightness-50 contrast-125 opacity-20" />
        </div>

        {/* HERO IMAGE SECTION (Edge to Edge) */}
        <div className="relative w-full h-[600px] shrink-0 flex bg-slate-100">
          {listing.imageUrl ? (
            <img src={listing.imageUrl} className="w-full h-full object-cover" alt="Main View" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
               <MapPin size={100} className="mb-4" />
               <p className="text-4xl font-bold uppercase">لا تـوجد صور مـرفقة</p>
            </div>
          )}
          {/* Top Right Logo over Image */}
          <div className="absolute top-8 right-8 z-20 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl shadow-black/10 border-4 border-white">
            <img src="/logo.png" alt="عروضي" className="w-24 h-24 object-contain" />
          </div>

          {listing.imageUrl2 && (
            <div className="absolute top-8 left-8 z-20 w-[240px] h-[240px] rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl">
              <img src={listing.imageUrl2} className="w-full h-full object-cover" alt="Second View" />
            </div>
          )}
          {/* Gradient Overlay to blend image nicely into background */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#fdfdfd] to-transparent z-10" />
        </div>

        {/* CONTENT SECTION */}
        <div className="relative z-10 px-14 flex flex-col flex-1 min-h-0 pb-[230px] pt-4">
          
          {/* Headline - Type, Area, Direction */}
          <div className="flex flex-col items-center text-center gap-3 mb-6">
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
            
            <h1 className="text-[4.2rem] font-bold text-slate-900 leading-tight">
              {listing.location}
            </h1>
          </div>

          {/* Divider */}
          <div className="w-[40%] mx-auto border-t-[4px] border-slate-200/60 rounded-full mb-6" />

          {/* Pricing List (No Boxes, Clean text) */}
          <div className="flex flex-col gap-5 px-6">
             
             {/* Net Price */}
             <div className="flex justify-between items-end border-b-[3px] border-slate-100 pb-3">
                <span className="text-[2.6rem] font-bold text-slate-600">السعر المطلوب (صافي)</span>
                <span className="text-[4.4rem] font-bold text-slate-800 digits-sans leading-none tracking-tight">
                  {salePrice ? formatCurrency(salePrice) : 'على السـوم'}
                </span>
             </div>

             {/* Total Price (Highlighted) */}
             {salePrice > 0 && (
               <div className="flex justify-between items-end border-b-[3px] border-slate-100 pb-3 border-b-transparent">
                  <div>
                    <span className="text-[2.6rem] font-bold text-blue-900 block border-b-2 border-transparent">السعر الإجمالي</span>
                    <span className="text-[1.8rem] text-slate-500 font-medium block mt-1">شامل 7.5% ضريبة القيمة المضافة والسعي</span>
                  </div>
                  <span className="text-[4.8rem] font-bold text-blue-700 digits-sans leading-none tracking-tight">
                    {formatCurrency(Math.round(totalWithTaxAndFee))}
                  </span>
               </div>
             )}
          </div>

          {/* Spacer to distribute empty space evenly */}
          <div className="flex-1 min-h-[10px]" />

          {/* Wrapper for bottom elements to constrain their spacing */}
          <div className="flex flex-col gap-5 mt-auto">
            {/* Dimensions */}
            {(listing.dimNorth || listing.dimSouth || listing.dimEast || listing.dimWest) && (
              <div className="mx-auto w-full px-2">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-[2px] bg-slate-100 flex-1" />
                    <span className="text-[2rem] text-slate-400 font-bold">أطوال الأضلاع</span>
                    <div className="h-[2px] bg-slate-100 flex-1" />
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                     <div className="bg-white border-[2px] border-slate-200/60 py-2 px-2 rounded-3xl shadow-sm">
                       <span className="text-slate-400 text-[1.6rem] font-bold mb-1 block">شمالاً</span>
                       <span className="text-slate-800 text-[2.4rem] font-bold digits-sans block">{listing.dimNorth || '-'}</span>
                     </div>
                     <div className="bg-white border-[2px] border-slate-200/60 py-2 px-2 rounded-3xl shadow-sm">
                       <span className="text-slate-400 text-[1.6rem] font-bold mb-1 block">جنوباً</span>
                       <span className="text-slate-800 text-[2.4rem] font-bold digits-sans block">{listing.dimSouth || '-'}</span>
                     </div>
                     <div className="bg-white border-[2px] border-slate-200/60 py-2 px-2 rounded-3xl shadow-sm">
                       <span className="text-slate-400 text-[1.6rem] font-bold mb-1 block">شرقاً</span>
                       <span className="text-slate-800 text-[2.4rem] font-bold digits-sans block">{listing.dimEast || '-'}</span>
                     </div>
                     <div className="bg-white border-[2px] border-slate-200/60 py-2 px-2 rounded-3xl shadow-sm">
                       <span className="text-slate-400 text-[1.6rem] font-bold mb-1 block">غرباً</span>
                       <span className="text-slate-800 text-[2.4rem] font-bold digits-sans block">{listing.dimWest || '-'}</span>
                     </div>
                  </div>
              </div>
            )}

            {/* Notes */}
            {listing.notes && (
              <div className="px-8 py-4 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex items-start gap-4">
                 <div className="text-blue-400 opacity-50 text-[3rem] font-serif leading-none mt-2">"</div>
                 <p className="text-[2.2rem] font-medium text-slate-700 leading-relaxed flex-1 mt-2">
                   {listing.notes}
                 </p>
                 <div className="text-blue-400 opacity-50 text-[3rem] font-serif leading-none mt-auto mb-1">"</div>
              </div>
            )}
          </div>
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


