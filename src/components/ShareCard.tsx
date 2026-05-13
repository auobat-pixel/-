import React from 'react';
import { RealEstateListing } from '../types';
import { formatCurrency } from '../lib/utils.ts';
import { MapPin, Building2, Tag, Gavel, Calendar, Navigation, Map, Phone, FileText } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { cn } from '../lib/utils.ts';

interface ShareCardProps {
  listing: RealEstateListing;
  cardRef: React.RefObject<HTMLDivElement>;
}

export const ShareCard: React.FC<ShareCardProps> = ({ listing, cardRef }) => {
  return (
    <div className="flex justify-center p-4 bg-slate-200 overflow-hidden font-naskh">
      <div 
        ref={cardRef}
        className="w-[1080px] bg-slate-50 relative overflow-hidden flex flex-col shadow-2xl"
        style={{ direction: 'rtl' }}
      >
        {/* Modern Background Decorations */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-slate-200/40 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />

        {/* Top Spacer instead of Header */}
        <div className="h-20" />

        {/* Hero Section - Balanced Images */}
        <div className="relative z-10 px-16 mb-12 flex gap-8 h-[600px] shrink-0">
          {listing.imageUrl && (
            <div className={cn(
              "rounded-[3rem] overflow-hidden shadow-lg relative border-8 border-white h-full",
              listing.imageUrl2 ? "w-1/2" : "w-full"
            )}>
              <img src={listing.imageUrl} alt="Main View" className="w-full h-full object-cover" />
            </div>
          )}
          
          {listing.imageUrl2 && (
            <div className={cn(
              "rounded-[3rem] overflow-hidden shadow-lg relative border-8 border-white h-full",
              listing.imageUrl ? "w-1/2" : "w-full"
            )}>
              <img src={listing.imageUrl2} alt="Second View" className="w-full h-full object-cover" />
            </div>
          )}

          {!listing.imageUrl && !listing.imageUrl2 && (
            <div className="w-full h-full bg-white rounded-[3rem] border-8 border-white flex flex-col items-center justify-center shadow-sm">
              <MapPin size={80} className="mb-4 text-slate-100" />
              <p className="text-xl font-bold text-slate-200 uppercase tracking-widest">لا تـوجد صور مـرفقة</p>
            </div>
          )}
        </div>

        {/* Content Body - One Page Spacing */}
        <div className="relative z-10 px-16 flex flex-col gap-8 pb-20">
          
          {/* Main Attributes Header */}
          <div className="flex items-center gap-8 mb-4">
             <div className="bg-slate-800 px-10 py-5 rounded-[2rem] text-white shadow-lg flex items-center gap-4">
                <Building2 size={28} />
                <span className="text-3xl font-bold">{listing.type}</span>
             </div>
             {listing.direction && (
               <div className="bg-blue-600 px-10 py-5 rounded-[2rem] text-white shadow-lg flex items-center gap-4">
                  <Navigation size={28} className="text-white/80" />
                  <span className="text-3xl font-bold">{listing.direction}</span>
               </div>
             )}
          </div>

          {/* Pricing Highlight Card */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
            <div>
              <p className="text-2xl font-bold text-slate-600 mb-2">السـعر المطـلوب (حـد)</p>
              <p className="text-7xl font-bold text-blue-600 tracking-tighter">
                {listing.salePrice ? formatCurrency(listing.salePrice) : 'على السـوم'}
              </p>
            </div>
            {listing.bidPrice && (
              <div className="text-left bg-slate-50 px-10 py-6 rounded-3xl border border-slate-100">
                <p className="text-2xl font-bold text-slate-600 mb-1 tracking-wide">آخـر سـوم</p>
                <p className="text-5xl font-bold text-slate-800">{formatCurrency(listing.bidPrice)}</p>
              </div>
            )}
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-lg">
              <div className="flex items-center gap-5 mb-10 pb-6 border-b border-slate-50">
                <MapPin className="text-blue-600" size={40} />
                <h3 className="text-5xl font-bold text-slate-800 leading-snug">
                  {listing.location}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-12">
                {/* Space & Metric */}
                <div className="bg-blue-50/40 p-10 rounded-[2.5rem] border border-blue-100/30">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <Map size={24} />
                    </div>
                    <p className="text-3xl font-bold text-slate-700">المساحة الإجمالية</p>
                  </div>
                  <p className="text-7xl font-bold text-slate-900 leading-none">
                    {listing.area || '-'} <span className="text-3xl font-medium text-slate-500">م²</span>
                  </p>
                </div>

                {/* Dimensions */}
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                      <Tag size={24} />
                    </div>
                    <p className="text-3xl font-bold text-slate-700">أطوال الأضلـاع</p>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-10">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                       <span className="text-2xl font-bold text-slate-600">شمالاً:</span>
                       <span className="text-2xl font-bold text-slate-800">{listing.dimNorth || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                       <span className="text-2xl font-bold text-slate-600">جنوباً:</span>
                       <span className="text-2xl font-bold text-slate-800">{listing.dimSouth || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                       <span className="text-2xl font-bold text-slate-600">شرقاً:</span>
                       <span className="text-2xl font-bold text-slate-800">{listing.dimEast || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                       <span className="text-2xl font-bold text-slate-600">غرباً:</span>
                       <span className="text-2xl font-bold text-slate-800">{listing.dimWest || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {listing.notes && (
                <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex gap-6 italic">
                  <div className="text-blue-400 shrink-0"><FileText size={36} /></div>
                  <p className="text-3xl font-medium text-slate-600 leading-relaxed">
                    {listing.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Interactive Area */}
          <div className="bg-white rounded-[4rem] p-12 border border-slate-100 flex items-center justify-between shadow-xl relative overflow-hidden shrink-0 mt-auto">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4 text-blue-600">
                <Phone size={32} />
                <span className="text-3xl font-bold tracking-widest text-slate-600">للتـواصل مع المعلـن</span>
              </div>
              <p className="text-6xl font-bold text-slate-900 tracking-wider">
                {listing.contactPhone || '-'}
              </p>
            </div>

            <div className="flex items-center gap-12">
               {/* Map QR */}
               <div className="text-center">
                  <div className="p-4 bg-white rounded-[2rem] shadow-sm border border-slate-100" id="maps-qrcode">
                    {listing.googleMapsUrl ? (
                      <QRCodeCanvas 
                        value={listing.googleMapsUrl} 
                        size={180}
                        level="H"
                        includeMargin={false}
                        fgColor="#1e293b"
                      />
                    ) : (
                       <div className="w-[180px] h-[180px] bg-slate-50 flex items-center justify-center text-slate-200">
                         <MapPin size={48} />
                       </div>
                    )}
                  </div>
                  <p className="mt-4 text-2xl font-bold text-slate-600">مـوقع العقـار</p>
               </div>

               {/* WhatsApp QR */}
               <div className="text-center">
                  <div className="p-4 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                    <QRCodeCanvas 
                      value={`https://wa.me/${(listing.contactPhone || '').replace(/[^0-9]/g, '')}`} 
                      size={180}
                      level="H"
                      includeMargin={false}
                      fgColor="#22c55e"
                    />
                  </div>
                  <p className="mt-4 text-2xl font-bold text-slate-600">واتسـاب مبـاشر</p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-4 bg-blue-600 w-full shrink-0" />
      </div>
    </div>
  );
};

