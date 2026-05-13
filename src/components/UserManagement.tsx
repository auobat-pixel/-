import React, { useState } from 'react';
import { convertArabicToEnglishNumbers } from '../lib/utils';
import { User, UserRole } from '../types';
import { UserPlus, Trash2, Shield, User as UserIcon, X, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { ConfirmationModal } from './ConfirmationModal';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateUserPassword: (userId: string, newPassword: string) => void;
  onClose: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onDeleteUser, onUpdateUserPassword, onClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('viewer');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
  const [editPasswordValue, setEditPasswordValue] = useState('');

  const handleUpdatePassword = (userId: string) => {
    if (editPasswordValue.length < 4) {
      toast.error('الرمز السري يجب أن يكون 4 خانات على الأقل');
      return;
    }
    onUpdateUserPassword(userId, convertArabicToEnglishNumbers(editPasswordValue).trim());
    setEditingPasswordId(null);
    setEditPasswordValue('');
    toast.success('تم تحديث الرمز السري للعضو');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = convertArabicToEnglishNumbers(newUsername).trim().toLowerCase().replace(/\s/g, '');
    const cleanPassword = convertArabicToEnglishNumbers(newPassword).trim();
    const cleanName = newName.trim();
    const cleanPhone = convertArabicToEnglishNumbers(newPhone).trim();

    if (!cleanUsername || !cleanPassword || !cleanName) {
      toast.error('يرجى ملء جميع الحقول الإلزامية');
      return;
    }

    if (users.some(u => convertArabicToEnglishNumbers(u.username || '').trim().toLowerCase() === cleanUsername)) {
      toast.error('اسم المستخدم موجود مسبقاً');
      return;
    }

    onAddUser({
      username: cleanUsername,
      password: cleanPassword,
      name: cleanName,
      phone: cleanPhone,
      role: newRole
    });

    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewPhone('');
    setShowAddForm(false);
    toast.success('تمت إضافة المستخدم بنجاح');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-4xl w-full flex flex-col max-h-[80vh] relative">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">إدارة الأعضاء والصلاحيات</h2>
          </div>
          <p className="text-slate-500 mr-16">إضافة، حذف، والتحكم في صلاحيات المستخدمين</p>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 pr-2">
          {showAddForm ? (
            <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 space-y-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-4">
                <UserPlus size={18} />
                إضافة عضو جديد (الرمز السري)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  id="user-full-name-input"
                  type="text" 
                  placeholder="الاسم الكامل"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
                <input 
                  id="user-username-input"
                  type="text" 
                  placeholder="اسم المستخدم (إنجليزي)"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ltr-input"
                />
                <input 
                  id="user-phone-input"
                  type="text" 
                  placeholder="رقم الواتساب (مثال: 966500000000)"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold ltr-input"
                />
                <input 
                  id="user-password-input"
                  type="password" 
                  placeholder="الرمز السري (كلمة المرور)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="px-4 py-3 block bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold md:col-span-2"
                >
                  <option value="viewer">مشاهد (عرض فقط)</option>
                  <option value="editor">محرّر (إضافة وتعديل)</option>
                  <option value="admin">مدير (تحكم كامل)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  حفظ العضو
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-600 rounded-3xl font-black mb-8 hover:bg-blue-50 transition-colors flex items-center justify-center gap-3"
            >
              <UserPlus size={20} />
              إضافة عضو جديد للنظام
            </button>
          )}

          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    user.role === 'admin' ? "bg-purple-100 text-purple-600" : 
                    user.role === 'editor' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                  )}>
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="font-black text-slate-800">{user.name}</p>
                       <span className={cn(
                         "px-2 py-0.5 rounded-md text-[10px] font-black uppercase",
                         user.role === 'admin' ? "bg-purple-50 text-purple-600" : 
                         user.role === 'editor' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                       )}>
                         {user.role === 'admin' ? 'مدير' : user.role === 'editor' ? 'محرر' : 'مشاهد'}
                       </span>
                    </div>
                    <p className="text-xs text-slate-400 font-bold">@{user.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {editingPasswordId === user.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                      <input 
                        type="text"
                        value={editPasswordValue}
                        onChange={(e) => setEditPasswordValue(e.target.value)}
                        placeholder="الرمز الجديد"
                        className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleUpdatePassword(user.id)}
                        className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        title="حفظ"
                      >
                        <Lock size={14} />
                      </button>
                      <button 
                        onClick={() => setEditingPasswordId(null)}
                        className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setEditingPasswordId(user.id);
                        setEditPasswordValue('');
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="تغيير الرمز السري"
                    >
                      <Lock size={18} />
                    </button>
                  )}

                  <button 
                    onClick={() => setConfirmDeleteId(user.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="حذف العضو"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {user.username === 'admin' && (
                  <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-bold">
                    حساب أساسي
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-colors"
        >
          إغلاق اللوحة
        </button>
      </div>

      <ConfirmationModal 
        key="modal-confirmation-user"
        isOpen={!!confirmDeleteId}
        title="تأكيد حذف العضو"
        message="هل أنت متأكد من رغبتك في حذف هذا العضو؟ لن يتمكن من الوصول للنظام بعد الآن."
        confirmLabel="حذف العضو"
        cancelLabel="إلغاء الأمر"
        onConfirm={() => {
          if (confirmDeleteId) {
            onDeleteUser(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
