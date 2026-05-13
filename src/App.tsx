/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { RealEstateListing, User, Appointment, Alert } from './types';
import { ListingForm } from './components/ListingForm.tsx';
import { ListingCard } from './components/ListingCard.tsx';
import { ShareCard } from './components/ShareCard.tsx';
import { Login } from './components/Login.tsx';
import { UserManagement } from './components/UserManagement.tsx';
import { AppointmentModal } from './components/AppointmentModal.tsx';
import { CalendarView } from './components/CalendarView.tsx';
import { AlertsPanel } from './components/AlertsPanel.tsx';
import { ChangePasswordModal } from './components/ChangePasswordModal.tsx';
import { CommentsModal } from './components/CommentsModal.tsx';
import { ConfirmationModal } from './components/ConfirmationModal.tsx';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { LayoutGrid, X, Building, Share2, Search, TrendingUp, Wallet, LogOut, Users, Calendar, Bell, Lock, Menu, ChevronDown, Heart } from 'lucide-react';
import { cn, formatCurrency } from './lib/utils.ts';
import { db, cleanData, handleFirestoreError, OperationType } from './lib/firebase.ts';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc,
  getDoc,
  getDocs,
  limit,
  where,
  Timestamp
} from 'firebase/firestore';


export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aqaratek_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [listings, setListings] = useState<RealEstateListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [schedulingListing, setSchedulingListing] = useState<RealEstateListing | null>(null);
  const [editingListing, setEditingListing] = useState<RealEstateListing | null>(null);
  const [sharingListing, setSharingListing] = useState<RealEstateListing | null>(null);
  const [commentsListing, setCommentsListing] = useState<RealEstateListing | null>(null);
  const [listingToDeleteId, setListingToDeleteId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const mountTimeRef = useRef(new Date().toISOString());
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Sync Users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
      
      // Migration: Update 'المدير العام' to 'أيوب'
      usersData.forEach(u => {
        if (u.name === 'المدير العام') {
          updateDoc(doc(db, 'users', u.id), { name: 'أيوب' })
            .catch(err => console.error('Migration error:', err));
        }
      });

      // Ensure default admin exists if collection is empty
      if (usersData.length === 0) {
        const defaultAdmin: User = {
          id: 'admin-id',
          username: 'admin',
          password: '123',
          name: 'أيوب',
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        setDoc(doc(db, 'users', 'admin-id'), defaultAdmin).catch(err => handleFirestoreError(err, OperationType.WRITE, 'users/admin-id'));
      }
      
      setUsers(usersData);

      // Sync current user state if data changed in Firestore
      if (currentUser) {
        const updatedSelf = usersData.find(u => u.id === currentUser.id);
        if (updatedSelf) {
          // Check for any changes to sync
          const hasChanged = 
            updatedSelf.name !== currentUser.name || 
            updatedSelf.role !== currentUser.role || 
            updatedSelf.password !== currentUser.password ||
            updatedSelf.username !== currentUser.username;
            
          if (hasChanged) {
            setCurrentUser(updatedSelf);
            localStorage.setItem('aqaratek_current_user', JSON.stringify(updatedSelf));
          }
        }
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));
    return () => unsub();
  }, []);

  // Sync Listings
  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const listingsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RealEstateListing));
      setListings(listingsData);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'listings'));
    return () => unsub();
  }, []);

  // Sync Appointments
  useEffect(() => {
    const q = query(collection(db, 'appointments'), orderBy('appointmentDate', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment));
      setAppointments(apps);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'appointments'));
    return () => unsub();
  }, []);

  // Sync Alerts
  useEffect(() => {
    const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Alert));
      setAlerts(data);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'alerts'));
    return () => unsub();
  }, []);

  // Sync Notifications
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'notifications'), 
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const notification = change.doc.data();
          // Only show if it's new (created after component mount) and not by current user
          if (notification.createdAt > mountTimeRef.current && notification.createdBy !== currentUser.id) {
            toast.custom((t) => (
              <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-r-4 border-blue-600`}>
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Building size={20} />
                      </div>
                    </div>
                    <div className="mr-3 flex-1">
                      <p className="text-sm font-black text-slate-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 font-medium">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-slate-100">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-l-[1.5rem] p-4 flex items-center justify-center text-sm font-black text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            ), { duration: 5000 });
          }
        }
      });
    }, (error) => handleFirestoreError(error, OperationType.GET, 'notifications'));

    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aqaratek_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Check for upcoming appointments (next 24 hours)
  useEffect(() => {
    if (!currentUser || appointments.length === 0) return;

    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcoming = appointments.filter(app => {
      const appDate = new Date(app.appointmentDate);
      return app.status === 'pending' && appDate > now && appDate <= twentyFourHoursLater;
    });

    if (upcoming.length > 0) {
      toast(`لديك ${upcoming.length} مواعيد معاينة خلال الـ 24 ساعة القادمة`, {
        icon: '📅',
        duration: 6000,
        position: 'bottom-right'
      });
    }
  }, [appointments.length, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('aqaratek_current_user', JSON.stringify(user));
  };

  const [showManagementDropdown, setShowManagementDropdown] = useState(false);

  const handleLogout = () => {
    setShowManagementDropdown(false);
    setCurrentUser(null);
    toast.success('تم تسجيل الخروج');
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showManagementDropdown && !(event.target as Element).closest('.management-dropdown-container')) {
        setShowManagementDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showManagementDropdown]);

  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('تم حذف العضو بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    try {
      const newUser: User = {
        ...userData,
        id,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', newUser.id), cleanData(newUser));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${id}`);
    }
  };

  const scheduleAppointment = async (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'appointments'), cleanData({
        ...data,
        createdAt: new Date().toISOString()
      }));
      
      await addDoc(collection(db, 'notifications'), cleanData({
        title: 'موعد معاينة جديد',
        message: `تم جدولة موعد لـ ${data.clientName} لعقار في حي ${data.listingLocation}`,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id || 'system'
      }));

      toast.success('تم جدولة الموعد بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      toast.success('تم حذف الموعد');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `appointments/${id}`);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      toast.success('تم تحديث حالة الموعد');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const addAlert = async (data: Omit<Alert, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      await addDoc(collection(db, 'alerts'), cleanData({
        ...data,
        isRead: false,
        createdAt: new Date().toISOString()
      }));

      await addDoc(collection(db, 'notifications'), cleanData({
        title: data.type === 'offer' ? 'عرض خاص جديد!' : 'تنبيه جديد',
        message: data.title,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id || 'system'
      }));

      toast.success('تم إضافة التنبيه بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'alerts');
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'alerts', id));
      toast.success('تم حذف التنبيه');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `alerts/${id}`);
    }
  };

  const toggleAlertRead = async (id: string, isRead: boolean) => {
    try {
      await updateDoc(doc(db, 'alerts', id), { isRead });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `alerts/${id}`);
    }
  };

  const toggleFavorite = async (listing: RealEstateListing) => {
    if (!currentUser) return;
    try {
      const isFavorite = listing.favoritedBy?.includes(currentUser.id);
      const newFavoritedBy = isFavorite 
        ? (listing.favoritedBy || []).filter(id => id !== currentUser.id)
        : [...(listing.favoritedBy || []), currentUser.id];
        
      await updateDoc(doc(db, 'listings', listing.id), {
        favoritedBy: newFavoritedBy
      });
      toast.success(isFavorite ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `listings/${listing.id}`);
    }
  };

  const updateMyPassword = async (newPassword: string) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.id), { password: newPassword });
      setCurrentUser({ ...currentUser, password: newPassword });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
    }
  };
  const updateOtherUserPassword = async (userId: string, newPassword: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { password: newPassword });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };
 
  const addListing = async (data: Omit<RealEstateListing, 'id' | 'date' | 'createdBy'>) => {
    try {
      const listingData = {
        ...data,
        date: new Date().toISOString(),
        createdBy: currentUser?.id
      };
      const docRef = await addDoc(collection(db, 'listings'), cleanData(listingData));
      
      // Create notification for all users
      await addDoc(collection(db, 'notifications'), cleanData({
        title: 'عرض عقاري جديد!',
        message: `تمت إضافة ${data.type} جديد في حّي ${data.location} من قبل ${currentUser?.name}`,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id || 'system'
      }));

      toast.success('تمت إضافة العرض بنجاح');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'listings');
    }
  };

  const updateListing = async (id: string, data: Omit<RealEstateListing, 'id' | 'date'>) => {
    try {
      const listing = listings.find(l => l.id === id);
      if (!listing) return;

      if (currentUser?.role !== 'admin' && listing.createdBy !== currentUser?.id) {
        toast.error('ليس لديك صلاحية لتعديل هذا العرض');
        return;
      }

      await updateDoc(doc(db, 'listings', id), cleanData({ ...data }));
      setEditingListing(null);
      toast.success('تم تحديث بيانات العرض');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `listings/${id}`);
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const listing = listings.find(l => l.id === id);
      if (!listing) return;

      if (currentUser?.role !== 'admin' && listing.createdBy !== currentUser?.id) {
        toast.error('ليس لديك صلاحية لحذف هذا العرض');
        return;
      }

      await deleteDoc(doc(db, 'listings', id));
      toast.success('تم حذف العرض');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `listings/${id}`);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (listing.notes?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (listing.type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || listing.type.toLowerCase() === filterType.toLowerCase();
    
    const matchesFavorites = filterFavorites ? listing.favoritedBy?.includes(currentUser?.id || '') : true;

    return matchesSearch && matchesFilter && matchesFavorites;
  });

  const stats = {
    total: listings.length,
    totalValue: listings.reduce((acc, curr) => acc + (curr.salePrice || 0), 0),
    avgPrice: listings.length > 0 ? listings.reduce((acc, curr) => acc + (curr.salePrice || 0), 0) / listings.length : 0
  };

  const handleDownload = async (listingToDownload: RealEstateListing) => {
    if (shareCardRef.current === null) return;
    
    const loadingToast = toast.loading('جاري تجهيز الصورة والتحميل...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const element = shareCardRef.current;
      const dataUrl = await toPng(element, {
        pixelRatio: 3,
        backgroundColor: '#f8fafc',
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `عرض-عقاري-${listingToDownload.location || 'جديد'}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.dismiss(loadingToast);
      toast.success('تم تحميل الصورة بنجاح!');
    } catch (err) {
      console.error('Error generating image:', err);
      toast.dismiss(loadingToast);
      toast.error('حدث خطأ أثناء تحميل الصورة');
    }
  };

  useEffect(() => {
    if (sharingListing) {
      handleDownload(sharingListing).finally(() => {
        setSharingListing(null);
      });
    }
  }, [sharingListing]);

  if (!currentUser) {
    return (
      <>
        <Toaster position="top-center" />
        <Login onLogin={handleLogin} users={users} />
      </>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-50 font-sans" dir="rtl">
      <Toaster position="top-center" />
      
      <div className="fixed -left-[2000px] top-0 pointer-events-none" aria-hidden="true">
        {sharingListing && (
          <ShareCard listing={sharingListing} cardRef={shareCardRef} />
        )}
      </div>
      
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-4 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100"
             >
               <Building size={24} />
             </motion.div>
             <div>
               <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">عروضي</h1>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{currentUser.name}</span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider",
                    currentUser.role === 'admin' ? "bg-indigo-50 text-indigo-600" : 
                    currentUser.role === 'editor' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {currentUser.role === 'admin' ? 'مدير النظام' : currentUser.role === 'editor' ? 'محرر محتوى' : 'مشاهد فقط'}
                  </span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative management-dropdown-container">
              <button 
                onClick={() => setShowManagementDropdown(!showManagementDropdown)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border",
                  showManagementDropdown 
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm"
                )}
              >
                <Menu size={16} />
                <span className="hidden md:inline">القائمة الإدارية</span>
                <ChevronDown size={12} className={cn("transition-transform duration-300", showManagementDropdown && "rotate-180")} />
                {alerts.some(a => !a.isRead) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {showManagementDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 origin-top-left overflow-hidden"
                  >
                    <button 
                      onClick={() => { setShowCalendar(true); setShowManagementDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-right font-bold"
                    >
                      <Calendar size={18} />
                      <span>التقويم</span>
                    </button>

                    <button 
                      onClick={() => { setShowAlerts(true); setShowManagementDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors text-right font-bold relative"
                    >
                      <Bell size={18} />
                      <span>التنبيهات</span>
                      {alerts.some(a => !a.isRead) && (
                        <span className="w-2 h-2 bg-red-50 rounded-full mr-auto"></span>
                      )}
                    </button>

                    <button 
                      onClick={() => { setFilterFavorites(!filterFavorites); setShowManagementDropdown(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-right font-bold ${filterFavorites ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:bg-red-50 hover:text-red-600'}`}
                    >
                      <Heart size={18} fill={filterFavorites ? 'currentColor' : 'none'} className={filterFavorites ? 'text-red-600' : ''} />
                      <span>المفضلة</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button 
                        onClick={() => { setShowUserManagement(true); setShowManagementDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-right font-bold"
                      >
                        <Users size={18} />
                        <span>الأعضاء</span>
                      </button>
                    )}

                    <div className="h-px bg-slate-100 my-2 mx-4" />

                    <button 
                      onClick={() => { setShowChangePassword(true); setShowManagementDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-right font-bold"
                    >
                      <Lock size={18} />
                      <span>تغيير الرمز السري</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <LayoutGrid size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">المخزون العقاري</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                <span className="text-xs text-slate-400 font-bold">عروض</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <Wallet size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">القيمة الإجمالية</p>
              <p className="text-xl font-black text-slate-900">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">متوسط سعر المتر / العرض</p>
              <p className="text-xl font-black text-slate-900">
                {formatCurrency(stats.avgPrice)}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-10 items-start lg:grid-cols-[400px_1fr]">
          <aside className="lg:sticky lg:top-24 space-y-6">
            {currentUser.role !== 'viewer' ? (
              <ListingForm 
                onAdd={addListing} 
                editingListing={editingListing} 
                onUpdate={updateListing}
                onCancelEdit={() => setEditingListing(null)}
              />
            ) : (
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <Users size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">وضع المشاهدة فقط</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  حسابك في وضع العرض فقط. يمكنك تصفح العروض ومشاركتها ولكن لا يمكنك إضافة أو تعديل البيانات.
                </p>
              </div>
            )}
            <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 transition-transform group-hover:scale-150 duration-700" />
               <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-3 flex items-center gap-3">
                   <Share2 size={24} />
                   نظام المشاركة الـذكي
                 </h3>
                 <p className="text-blue-100 font-medium leading-relaxed">
                   قم بإضافة العروض وسيقوم النظام تلقائياً بإنشاء بطاقة تسويقية فاخرة بصور واضحة ومعلومات مفصلة لمشاركتها مع عملائك.
                 </p>
               </div>
            </div>
          </aside>

          <section>
            <div className="flex flex-col gap-6 mb-8">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h2 className="text-2xl font-black text-slate-900">محرك البحث العقاري</h2>
                  </div>
                  <div className="flex flex-1 gap-3 max-w-xl">
                    <div className="relative flex-1 group">
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="ابحث بالحّي، الموقع، أو نوع العقار..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="all">كل الأنواع</option>
                      <option value="أرض">أرض</option>
                      <option value="عمارة">عمارة</option>
                      <option value="محل">محل</option>
                      <option value="شقة">شقة</option>
                      <option value="فيلا">فيلا</option>
                    </select>
                  </div>
               </div>
            </div>

            {filteredListings.length === 0 ? (
              <div className="bg-white border-4 border-dashed border-slate-100 rounded-[3rem] p-20 text-center shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                  <LayoutGrid size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-700 mb-2">لا تـوجد نـتائج بنـاءً على بحـثك</h3>
                <p className="text-slate-400 font-medium">ابدأ بإضافة عقارات جديدة أو جرب كلمات بحث أخرى</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredListings.map((listing) => (
                    <ListingCard 
                      key={listing.id} 
                      listing={listing} 
                      onShare={setSharingListing}
                      onDelete={setListingToDeleteId}
                      onEdit={setEditingListing}
                      onScheduleViewing={setSchedulingListing}
                      onViewComments={setCommentsListing}
                      onToggleFavorite={toggleFavorite}
                      currentUserId={currentUser.id}
                      isAdmin={currentUser.role === 'admin'}
                      canEdit={currentUser.role !== 'viewer' && (currentUser.role === 'admin' || listing.createdBy === currentUser.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </main>

      <AnimatePresence>
        {showUserManagement && (
          <UserManagement 
            key="modal-user-management"
            users={users}
            onAddUser={addUser}
            onDeleteUser={deleteUser}
            onUpdateUserPassword={updateOtherUserPassword}
            onClose={() => setShowUserManagement(false)}
          />
        )}
        
        {schedulingListing && (
          <AppointmentModal 
            key="modal-appointment"
            listing={schedulingListing}
            currentUser={currentUser}
            onSchedule={scheduleAppointment}
            onClose={() => setSchedulingListing(null)}
          />
        )}

        {showCalendar && (
          <CalendarView 
            key="modal-calendar"
            appointments={appointments}
            currentUser={currentUser}
            onDelete={deleteAppointment}
            onUpdateStatus={updateAppointmentStatus}
            onClose={() => setShowCalendar(false)}
          />
        )}

        {showAlerts && (
          <AlertsPanel 
            key="modal-alerts"
            alerts={alerts}
            currentUser={currentUser}
            onAddAlert={addAlert}
            onDeleteAlert={deleteAlert}
            onToggleRead={toggleAlertRead}
            onClose={() => setShowAlerts(false)}
          />
        )}

        {showChangePassword && (
          <ChangePasswordModal 
            key="modal-change-password"
            currentUser={currentUser}
            onUpdate={updateMyPassword}
            onClose={() => setShowChangePassword(false)}
          />
        )}

        {commentsListing && (
          <CommentsModal 
            key="modal-comments"
            listing={commentsListing}
            currentUser={currentUser}
            onClose={() => setCommentsListing(null)}
          />
        )}

        <ConfirmationModal 
          key="modal-confirmation-listing"
          isOpen={!!listingToDeleteId}
          title="تأكيد حذف العرض"
          message="هل أنت متأكد من رغبتك في حذف هذا العرض العقاري؟ لا يمكن التراجع عن هذا الإجراء."
          confirmLabel="حذف العرض"
          cancelLabel="إلغاء الأمر"
          onConfirm={() => {
            if (listingToDeleteId) {
              deleteListing(listingToDeleteId);
              setListingToDeleteId(null);
            }
          }}
          onCancel={() => setListingToDeleteId(null)}
        />
      </AnimatePresence>

      <footer className="text-center py-12 border-t border-slate-100 mt-20">
        <div className="flex items-center justify-center gap-3 mb-4">
           <Building size={20} className="text-slate-300" />
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">عروضي العقارية</p>
        </div>
        <p className="text-slate-300 text-xs font-medium">نظام محلي لإدارة عروضك وخدمة عملائك بأعلى جودة</p>
      </footer>
    </div>
  );
}
