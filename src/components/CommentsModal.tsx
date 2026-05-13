import React, { useState, useEffect } from 'react';
import { Comment, User, RealEstateListing } from '../types';
import { MessageSquare, Send, Trash2, X, User as UserIcon, Clock } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, cleanData } from '../lib/firebase';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

interface CommentsModalProps {
  listing: RealEstateListing;
  currentUser: User;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ listing, currentUser, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('listingId', '==', listing.id),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Comment));
      setComments(docs);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'comments'));

    return () => unsub();
  }, [listing.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const commentData: Omit<Comment, 'id'> = {
        listingId: listing.id,
        userId: currentUser.id,
        username: currentUser.username,
        userName: currentUser.name,
        text: newComment.trim(),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'comments'), cleanData(commentData));
      
      // Create notification alert for others
      const alertData = {
        title: 'تعليق جديد',
        message: `قام ${currentUser.name} بالتعليق على عرض في: ${listing.location}`,
        type: 'normal',
        isRead: false,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'alerts'), cleanData(alertData));

      setNewComment('');
      toast.success('تم إضافة التعليق');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      toast.success('تم حذف التعليق');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `comments/${commentId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-2xl w-full max-h-[85vh] flex flex-col relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">تعليقات العرض</h2>
          </div>
          <p className="text-slate-500 mr-16">العقار في: {listing.location}</p>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
              <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-50 border border-slate-100 p-4 rounded-2xl relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{comment.userName}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <Clock size={10} />
                          <span>{format(parseISO(comment.createdAt), 'yyyy/MM/dd hh:mm a', { locale: ar })}</span>
                        </div>
                      </div>
                    </div>
                    
                    {(currentUser.role === 'admin' || currentUser.id === comment.userId) && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف التعليق"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mr-10 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              className="w-full pr-4 pl-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none min-h-[100px]"
              maxLength={1000}
            />
            <button 
              type="submit"
              disabled={!newComment.trim() || loading}
              className="absolute left-3 bottom-3 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-95"
            >
              <Send size={20} className="rotate-180" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 mr-2">يمنع كتابة تعليقات مسيئة أو خارج موضوع العرض.</p>
        </form>
      </motion.div>
    </div>
  );
};
