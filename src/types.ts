/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface RealEstateListing {
  id: string;
  location: string;
  type: string;
  direction?: string | null;
  googleMapsUrl?: string | null;
  imageUrl?: string | null;
  imageUrl2?: string | null;
  contactPhone?: string | null;
  marketerName?: string | null;
  notes?: string | null;
  area?: number | null;               // المساحة بالمتر المربع
  salePrice?: number | null; // سعر البيع أو الحد
  bidPrice?: number | null; // سعر السوم الإجمالي
  pricePerMeterLimit?: number | null; // سعر المتر الحد
  pricePerMeterSaowm?: number | null; // سعر المتر السوم
  dimNorth?: string | null;
  dimSouth?: string | null;
  dimEast?: string | null;
  dimWest?: string | null;
  source?: string | null;
  date: string;
  createdBy?: string; // ID of the user who created it
  favoritedBy?: string[]; // Array of user IDs who favorited this listing
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

export interface Appointment {
  id: string;
  listingId: string;
  listingLocation: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'offer' | 'reminder' | 'normal';
  targetDate?: string;
  isRead: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  listingId: string;
  userId: string;
  username: string;
  userName: string;
  text: string;
  createdAt: string;
}
