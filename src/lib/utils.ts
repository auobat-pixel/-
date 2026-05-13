import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertArabicToEnglishNumbers(str: string): string {
  if (!str) return str;
  return str.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
}

export function formatCurrency(amount: any) {
  const val = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(val)) return '0 ر.س';
  
  try {
    // Use toLocaleString which is generally safer than the constructor if it's causing issues
    return val.toLocaleString('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    });
  } catch (e) {
    return val.toLocaleString('ar-SA') + ' ر.س';
  }
}
