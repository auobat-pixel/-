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
  role: UserRole;
  createdAt: string;
}

export interface RealEstateListing {
  id: string;
  location: string;
  type: string;
  direction?: string;
  googleMapsUrl?: string;
  imageUrl?: string;
  imageUrl2?: string;
  contactPhone?: string;
  notes?: string;
  area?: number;               // المساحة بالمتر المربع
  salePrice?: number; // سعر البيع أو الحد
  bidPrice?: number;  // سعر السوم
  dimNorth?: string;
  dimSouth?: string;
  dimEast?: string;
  dimWest?: string;
  source?: string;
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
