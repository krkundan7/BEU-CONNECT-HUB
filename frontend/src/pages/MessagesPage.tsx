import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { useNotification } from '../context/NotificationContext';
import { useNavigation } from '../context/NavigationContext';
import {
  MessageSquare, Send, Search, CheckCheck, MoreVertical,
  ShieldAlert, User, Image, Paperclip, Smile
} from 'lucide-react';
import { Message } from '../types';

export const MessagesPage: React.FC = () => {
  const { currentUser, allUsers } = useAuth();
  const { openReportModal } = useNavigation();
  const { showToast } = useNotification();

  const [activeConvId, setActiveConvId] = useState('conv-priya');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [searchContact, setSearchContact] = useState('');

  const priyaUser = allUsers.find(u => u.id === 'usr-priya-102');

  useEffect(() => {
    setMessages(StorageService.getMessages(activeConvId));
  }, [activeConvId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !inputMsg.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversationId: activeConvId,
      senderId: currentUser.id,
      receiverId: 'usr-priya-102',
      content: inputMsg.trim(),
      timestamp: 'Just now',
      read: true
    };

    StorageService.sendMessage(activeConvId, newMsg);
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    // Simulate mentor instant reply after 1.5 seconds
    setTimeout(() => {
      const replyMsg: Message = {
        id: `m-${Date.now() + 1}`,
        conversationId: activeConvId,
        senderId: 'usr-priya-102',
        receiverId: currentUser.id,
        content: 'Thanks for reaching out! Happy to guide you through the BEU syllabus and your project preparation 👍',
        timestamp: 'Just now',
        read: true
      };
      StorageService.sendMessage(activeConvId, replyMsg);
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-beu-dark">Campus Direct Messages</h1>
          <p className="text-xs text-beu-muted">Secure 1-to-1 peer and mentorship conversations</p>
        </div>
      </div>

      {/* Main Messaging Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[560px]">
        {/* Left Col: Conversations List */}
        <div className="border-r border-slate-200 p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              placeholder="Search peers & mentors..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-slate-50"
            />
          </div>

          <div className="space-y-1">
            {/* Conversation 1: Priya */}
            <button
              onClick={() => setActiveConvId('conv-priya')}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                activeConvId === 'conv-priya' ? 'bg-navy-50 border border-navy-200 shadow-xs' : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative">
                <img
                  src={priyaUser?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
                  alt="Priya Sharma"
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-beu-dark truncate">Priya Sharma</p>
                  <span className="text-[10px] text-slate-400">11:15 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Keep it up! Let me know if you need help...
                </p>
              </div>
            </button>

            {/* Conversation 2: Rahul */}
            <button
              onClick={() => showToast('Switched conversation thread', 'info')}
              className="w-full flex items-center gap-3 p-3 rounded-2xl text-left hover:bg-slate-50 opacity-80"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                  alt="Rahul Singh"
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-beu-dark truncate">Rahul Kumar Singh</p>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Hey, do you want to collaborate on the LoRa project?
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Active Chat Thread */}
        <div className="md:col-span-2 flex flex-col justify-between h-full bg-slate-50/50">
          {/* Thread Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={priyaUser?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
                alt="Priya Sharma"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-beu-dark">Priya Sharma (Senior Mentor)</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Online • BCE Bhagalpur</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openReportModal('conversation', activeConvId, 'Priya Sharma Conversation')}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
              title="Report or block user"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>

          {/* Messages History */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 max-h-[400px]">
            {messages.map(m => {
              const isMine = m.senderId === currentUser?.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-md text-xs sm:text-sm leading-relaxed ${
                      isMine
                        ? 'bg-navy-900 text-white rounded-br-none shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type your message to Priya..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="p-2.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
