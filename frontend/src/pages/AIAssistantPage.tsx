import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AIService, AIChatMessage } from '../services/aiService';
import {
  Bot, Send, Sparkles, RefreshCw, Trash2, Globe,
  Copy, Check, ShieldAlert, BookOpen, FileSpreadsheet, Calendar
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const AIAssistantPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [language, setLanguage] = useState<'english' | 'hindi' | 'hinglish'>('english');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialWelcome = AIService.getWelcomeMessage(
    currentUser?.name.split(' ')[0] || 'Student',
    currentUser?.branchCode || 'CSE',
    currentUser?.semester || 3
  );

  const [messages, setMessages] = useState<AIChatMessage[]>([initialWelcome]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query) return;

    const userMsg: AIChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: 'Just now',
      language
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      const aiResponse = await AIService.generateResponse(
        query,
        language,
        currentUser?.branchCode || 'CSE',
        currentUser?.semester || 3
      );
      setMessages(prev => [...prev, aiResponse]);
    } catch {
      showToast('Error connecting to AI service', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([initialWelcome]);
    showToast('Conversation cleared', 'info');
  };

  const quickPillActions = [
    { label: 'Explain AVL Rotations', query: 'Explain AVL Tree Rotations with numerical example', icon: BookOpen },
    { label: 'DBMS Normalization', query: 'Explain 1NF, 2NF, 3NF and BCNF Normalization', icon: BookOpen },
    { label: 'Analyze PYQs', query: 'What are the most frequent question patterns in BEU exams?', icon: FileSpreadsheet },
    { label: '7-Day Study Plan', query: 'Create a 7-day revision study plan for my exams', icon: Calendar },
    { label: 'Practice Questions', query: 'Generate Section A and Section B practice questions with solutions', icon: Sparkles }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-navy-900 text-white border border-navy-800 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">BEU AI Assistant</h1>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                Academic AI
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Personalized for {currentUser?.branchCode || 'CSE'} Semester {currentUser?.semester || 3} Curriculum
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Language Switcher */}
          <div className="flex p-1 bg-navy-950 rounded-xl border border-navy-800 text-xs">
            <button
              onClick={() => setLanguage('english')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'english' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'hindi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'hinglish' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hinglish
            </button>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-400 hover:text-red-400 border border-navy-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1">
          Quick Prompts:
        </span>
        {quickPillActions.map((pill, idx) => {
          const Icon = pill.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-emerald-800 whitespace-nowrap shadow-2xs transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle p-4 sm:p-6 min-h-[480px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-navy-900 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-navy-900 text-white rounded-tr-none'
                : 'bg-slate-50 border border-slate-200/90 text-beu-dark rounded-tl-none space-y-3'
            }`}>
              <div className="whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {msg.sender === 'assistant' && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" /> BEU Academic Intelligence
                  </span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 hover:text-navy-900 transition-colors"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Suggested Follow-ups:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowups.map((f, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSendMessage(f)}
                        className="px-2.5 py-1 text-xs bg-white text-navy-900 hover:bg-navy-100/70 border border-slate-200 rounded-lg text-left transition-colors"
                      >
                        {f} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && currentUser && (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200 flex-shrink-0 mt-1"
              />
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-navy-900 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask any topic in ${language === 'hindi' ? 'हिन्दी' : language === 'hinglish' ? 'Hinglish' : 'English'}...`}
          className="w-full pl-4 pr-12 py-3.5 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy-900 shadow-subtle bg-white"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="absolute right-2.5 top-2.5 p-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white rounded-xl transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Safety Notice Footer */}
      <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
        <span>BEU AI provides academic problem explanations based on prescribed engineering syllabus. Always verify official notifications.</span>
      </div>
    </div>
  );
};
