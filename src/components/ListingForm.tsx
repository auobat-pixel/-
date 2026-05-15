import React, { useState, useRef } from 'react';
import { RealEstateListing } from '../types';
import { MapPin, Tag, Gavel, Plus, Link as LinkIcon, Phone, FileText, Image as ImageIcon, X, Navigation, Building2 } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { compressImage } from '../lib/imageOptimization.ts';

interface ListingFormProps {
  onAdd: (listing: Omit<RealEstateListing, 'id' | 'date'>) => void;
  editingListing?: RealEstateListing | null;
  onUpdate?: (id: string, data: Omit<RealEstateListing, 'id' | 'date'>) => void;
  onCancelEdit?: () => void;
}

export const ListingForm: React.FC<ListingFormProps> = ({ onAdd, editingListing, onUpdate, onCancelEdit }) => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [direction, setDirection] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [marketerName, setMarketerName] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageUrl2, setImageUrl2] = useState<string | undefined>(undefined);
  const [salePrice, setSalePrice] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [area, setArea] = useState('');
  const [dimNorth, setDimNorth] = useState('');
  const [dimSouth, setDimSouth] = useState('');
  const [dimEast, setDimEast] = useState('');
  const [dimWest, setDimWest] = useState('');
  
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, imageNum: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً (الحد الأقصى 8 ميجابايت قبل الضغط)");
        return;
      }
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImage(file, 1280, 1280, 0.7);
        if (imageNum === 1) {
          setImageUrl(compressedBase64);
        } else {
          setImageUrl2(compressedBase64);
        }
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("حدث خطأ أثناء معالجة الصورة. يرجى المحاولة بصورة أخرى.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Load editing data
  React.useEffect(() => {
    if (editingListing) {
      setLocation(editingListing.location);
      setType(editingListing.type);
      setDirection(editingListing.direction || '');
      setGoogleMapsUrl(editingListing.googleMapsUrl || '');
      setContactPhone(editingListing.contactPhone || '');
      setMarketerName(editingListing.marketerName || '');
      setSource(editingListing.source || '');
      setNotes(editingListing.notes || '');
      setImageUrl(editingListing.imageUrl);
      setImageUrl2(editingListing.imageUrl2);
      setSalePrice(editingListing.salePrice?.toString() || '');
      setBidPrice(editingListing.bidPrice?.toString() || '');
      setArea(editingListing.area?.toString() || '');
      setDimNorth(editingListing.dimNorth || '');
      setDimSouth(editingListing.dimSouth || '');
      setDimEast(editingListing.dimEast || '');
      setDimWest(editingListing.dimWest || '');
    } else {
      resetFields();
    }
  }, [editingListing]);

  const resetFields = () => {
    setLocation('');
    setType('');
    setGoogleMapsUrl('');
    setContactPhone('');
    setSource('');
    setNotes('');
    setImageUrl(undefined);
    setImageUrl2(undefined);
    setArea('');
    setSalePrice('');
    setBidPrice('');
    setDirection('');
    setDimNorth('');
    setDimSouth('');
    setDimEast('');
    setDimWest('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (fileInputRef2.current) fileInputRef2.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !type) return;

    const data = {
      location,
      type,
      direction: direction || undefined,
      googleMapsUrl: googleMapsUrl || undefined,
      contactPhone: contactPhone || undefined,
      marketerName: marketerName || undefined,
      source: source || undefined,
      notes: notes || undefined,
      imageUrl,
      imageUrl2,
      area: area ? Number(area) : undefined,
      salePrice: salePrice ? Number(salePrice) : undefined,
      bidPrice: bidPrice ? Number(bidPrice) : undefined,
      dimNorth: dimNorth || undefined,
      dimSouth: dimSouth || undefined,
      dimEast: dimEast || undefined,
      dimWest: dimWest || undefined,
    };

    if (editingListing && onUpdate) {
      onUpdate(editingListing.id, data);
    } else {
      onAdd(data);
    }

    resetFields();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Plus size={24} className={cn(editingListing ? "text-indigo-600" : "text-blue-600")} />
          {editingListing ? 'تعديل بيانات العرض' : 'إضافة عرض جديد'}
        </h2>
        {editingListing && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            className="text-xs font-bold text-slate-400 hover:text-red-500"
          >
            إلغاء التعديل
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">نوع العقار</label>
          <div className="relative">
            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              required
              placeholder="مثال: أرض سكنية، فيلا، استراحة..."
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">موقع العقار في المدينة</label>
          <div className="relative">
            <Navigation className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="مثال: شمال بريدة، جنوب بريدة..."
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">صورة العقار 1</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-slate-50",
                imageUrl ? "border-blue-300" : "border-slate-200 hover:border-blue-400 hover:bg-slate-100"
              )}
            >
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImageUrl(undefined); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute top-2 left-2 p-1 bg-white/80 hover:bg-white text-red-500 rounded-full shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon size={24} className="text-slate-300 mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium font-sans">الصورة الأولى</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => handleImageChange(e, 1)} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">صورة العقار 2</label>
            <div 
              onClick={() => fileInputRef2.current?.click()}
              className={cn(
                "relative h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-slate-50",
                imageUrl2 ? "border-blue-300" : "border-slate-200 hover:border-blue-400 hover:bg-slate-100"
              )}
            >
              {imageUrl2 ? (
                <>
                  <img src={imageUrl2} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImageUrl2(undefined); if (fileInputRef2.current) fileInputRef2.current.value = ''; }}
                    className="absolute top-2 left-2 p-1 bg-white/80 hover:bg-white text-red-500 rounded-full shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon size={24} className="text-slate-300 mb-1" />
                  <span className="text-[10px] text-slate-500 font-medium font-sans">الصورة الثانية</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef2} 
                onChange={(e) => handleImageChange(e, 2)} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">رقم تواصل المالك</label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="tel"
              placeholder="مثال: 050XXXXXXX"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">اسم المسوق</label>
          <div className="relative">
            <input
              type="text"
              placeholder="مثال: أحمد عبد الله"
              value={marketerName}
              onChange={(e) => setMarketerName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">مصدر العرض (للمسوق فقط - لا يظهر عند المشاركة)</label>
          <div className="relative">
            <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="مثال: المالك مباشرة، من طرف مكتب..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ملاحظات إضافية على العرض</label>
          <div className="relative">
            <FileText className="absolute right-3 top-4 text-slate-400" size={18} />
            <textarea
              placeholder="مثال: العقار يفتح على مرافق، قريب من الخدمات..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-700 mb-3">أطوال الأرض</label>
          <div className="grid grid-cols-2 gap-3 pb-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">الشمال</label>
              <input
                type="text"
                placeholder="مثال: 20 م"
                value={dimNorth}
                onChange={(e) => setDimNorth(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">الجنوب</label>
              <input
                type="text"
                placeholder="مثال: 20 م"
                value={dimSouth}
                onChange={(e) => setDimSouth(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">الشرق</label>
              <input
                type="text"
                placeholder="مثال: 30 م"
                value={dimEast}
                onChange={(e) => setDimEast(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">الغرب</label>
              <input
                type="text"
                placeholder="مثال: 30 م"
                value={dimWest}
                onChange={(e) => setDimWest(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-1">موقع العقار (الحي/المدينة)</label>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              required
              placeholder="مثال: الرياض، حي النرجس"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 font-bold">رابط خريطة جوجل (سيتم تحويله لباركود عند المشاركة)</label>
          <div className="relative">
            <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="url"
              placeholder="انسخ رابط الموقع من الخرائط هنا"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">المساحة (م²)</label>
            <input
              type="number"
              placeholder="مثال: 400"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">سعر البيع / الحد</label>
            <div className="relative">
              <Tag className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="number"
                placeholder="اختياري"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">سعر السوم</label>
            <div className="relative">
              <Gavel className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="number"
                placeholder="اختياري"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={cn(
            "w-full py-4 px-6 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4",
            editingListing 
              ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" 
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
          )}
        >
          {editingListing ? <FileText size={20} /> : <Plus size={20} />}
          {editingListing ? 'تحديث وحفظ البيانات' : 'تأكيد الإضافة'}
        </button>
      </div>
    </form>
  );
};
