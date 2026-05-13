import React, { useState } from 'react';
import { User } from '../types';
import { Building, Lock, User as UserIcon, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { convertArabicToEnglishNumbers } from '../lib/utils.ts';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanUsername = convertArabicToEnglishNumbers(username).trim().toLowerCase().replace(/\s/g, '');
    const cleanPassword = convertArabicToEnglishNumbers(password).trim().toLowerCase();

    setTimeout(() => {
      const dbPassword = (u: User) => convertArabicToEnglishNumbers(u.password || '').trim().toLowerCase();
      const user = users.find(u => convertArabicToEnglishNumbers(u.username || '').trim().toLowerCase().replace(/\s/g, '') === cleanUsername && dbPassword(u) === cleanPassword);
      
      if (user) {
        onLogin(user);
        toast.success(`أهلاً بك، ${user.name}`);
      } else {
        const checkUser = users.find(u => convertArabicToEnglishNumbers(u.username || '').trim().toLowerCase().replace(/\s/g, '') === cleanUsername);
        if (checkUser) {
          toast.error('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى');
        } else {
          toast.error('اسم المستخدم غير صحيح أو غير موجود');
        }
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl mx-auto mb-6">
              <Building size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">تسجيل الدخول</h1>
            <p className="text-slate-500 font-medium italic">يرجى إدخال بياناتك للوصول لنظام العروض</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 px-2 block">اسم المستخدم</label>
              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserIcon size={20} />
                </div>
                <input 
                  id="login-username-input"
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 px-2 block">كلمة المرور</label>
              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={20} />
                </div>
                <input 
                  id="login-password-input"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>دخول</span>
                  <LogIn size={22} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-sm font-medium">في حال فقدان البيانات، يرجى التواصل مع المدير</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
