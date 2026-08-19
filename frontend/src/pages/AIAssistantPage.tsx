import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AIService, AIChatMessage, BEU_BRANCH_OPTIONS } from '../services/aiService';
import {
  Bot, Send, Sparkles, Trash2,
  Copy, Check, ShieldAlert, BookOpen, FileSpreadsheet, Calendar,
  GraduationCap, Layers, Award, Microscope, Zap,
  Paperclip, Image as ImageIcon, FileText, X, Eye, ZoomIn, ZoomOut, RotateCw,
  UploadCloud, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface AttachedDoc {
  type: 'image' | 'pdf';
  dataUrl: string;
  name: string;
  size: string;
}

export const AIAssistantPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [selectedBranch, setSelectedBranch] = useState(currentUser?.branchCode || 'CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(currentUser?.semester || 3);
  const [language, setLanguage] = useState<'english' | 'hindi' | 'hinglish'>('hinglish');
  const [activeMode, setActiveMode] = useState<'all' | 'scan' | 'exam14' | 'pyq' | 'viva' | 'plan'>('all');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // File Upload State
  const [attachedFile, setAttachedFile] = useState<AttachedDoc | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const initialWelcome = AIService.getWelcomeMessage(
    currentUser?.name?.split(' ')[0] || 'Engineer',
    selectedBranch,
    selectedSemester
  );

  const [messages, setMessages] = useState<AIChatMessage[]>([initialWelcome]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update welcome when branch or semester changes
  const handleContextChange = (newBranch: string, newSem: number) => {
    setSelectedBranch(newBranch);
    setSelectedSemester(newSem);
    const newWelcome = AIService.getWelcomeMessage(
      currentUser?.name?.split(' ')[0] || 'Engineer',
      newBranch,
      newSem
    );
    setMessages([newWelcome]);
    showToast(`Context updated to ${newBranch} Semester ${newSem}`, 'info');
  };

  const handleFileUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

    if (!isImage && !isPdf) {
      showToast('Please upload an image (PNG, JPG, WEBP) or PDF document.', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('File size must be under 15MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setAttachedFile({
        type: isPdf ? 'pdf' : 'image',
        dataUrl,
        name: file.name,
        size: formattedSize
      });
      setActiveMode('scan');
      showToast(`Attached ${file.name} for AI analysis!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSendMessage = async (textToSend?: string) => {
    let query = textToSend || inputQuery.trim();
    if (!query && !attachedFile) return;

    if (!query && attachedFile) {
      query = `Please analyze this attached ${attachedFile.type === 'pdf' ? 'PDF document' : 'image'} and provide a step-by-step 14-mark solution with BEU syllabus context.`;
    }

    // Prepend active mode modifier if selected
    if (activeMode === 'exam14' && !query.toLowerCase().includes('14 mark')) {
      query = `[BEU 14-Mark Exam Format] ${query}`;
    } else if (activeMode === 'pyq' && !query.toLowerCase().includes('pyq')) {
      query = `[BEU PYQ Trend & Frequency Analysis] ${query}`;
    } else if (activeMode === 'viva' && !query.toLowerCase().includes('viva')) {
      query = `[BEU Practical & Viva Prep] ${query}`;
    } else if (activeMode === 'plan' && !query.toLowerCase().includes('plan')) {
      query = `[BEU Revision Plan] ${query}`;
    }

    const currentAttachment = attachedFile;

    const userMsg: AIChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      content: textToSend || inputQuery.trim() || (currentAttachment ? `[Attached ${currentAttachment.name}] Analyze and solve step-by-step.` : ''),
      timestamp: 'Just now',
      language,
      attachment: currentAttachment ? {
        type: currentAttachment.type,
        dataUrl: currentAttachment.dataUrl,
        name: currentAttachment.name,
        size: currentAttachment.size
      } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setAttachedFile(null);
    setIsTyping(true);

    try {
      const aiResponse = await AIService.generateResponse(
        query,
        language,
        selectedBranch,
        selectedSemester,
        currentAttachment ? {
          type: currentAttachment.type,
          dataUrl: currentAttachment.dataUrl,
          name: currentAttachment.name,
          size: currentAttachment.size
        } : undefined
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
    setMessages([
      AIService.getWelcomeMessage(
        currentUser?.name?.split(' ')[0] || 'Engineer',
        selectedBranch,
        selectedSemester
      )
    ]);
    setAttachedFile(null);
    showToast('Conversation refreshed', 'info');
  };

  const quickPillActions = [
    { label: 'Hall Effect 14-Marks', query: 'Hall Effect derivation, formula aur applications detail me samjhao', icon: Award },
    { label: 'AVL 4 Rotations', query: 'Explain AVL Tree 4 Rotations with step-by-step example', icon: BookOpen },
    { label: 'DBMS Normalization', query: 'Explain 1NF, 2NF, 3NF and BCNF with anomalies table', icon: BookOpen },
    { label: 'Prim vs Kruskal MST', query: 'Compare Prim and Kruskal Algorithm for Minimum Spanning Tree', icon: Layers },
    { label: '7-Day Study Plan', query: 'Create a 7-day high-yield exam revision plan for my semester', icon: Calendar },
    { label: 'Analyze PYQ Trends', query: 'What are the most frequent question patterns in BEU exams?', icon: FileSpreadsheet }
  ];

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
      }}
      className="max-w-5xl mx-auto space-y-4 pb-20 px-2 sm:px-4 relative"
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-navy-950/80 backdrop-blur-sm rounded-3xl border-4 border-dashed border-emerald-400 flex flex-col items-center justify-center text-white space-y-3 pointer-events-none animate-in fade-in">
          <UploadCloud className="w-16 h-16 text-emerald-400 animate-bounce" />
          <h3 className="text-xl font-black">Drop Image or PDF Document Here</h3>
          <p className="text-xs text-slate-300">BEU AI Assistant will instantly extract and analyze your question/derivation.</p>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg font-bold">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">BEU AI Assistant</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Multimodal Image & PDF Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span>Academic Research & Syllabus Grounded</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{selectedBranch} Sem {selectedSemester}</span>
            </p>
          </div>
        </div>

        {/* Branch & Semester Selectors + Language Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Branch Picker */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedBranch}
              onChange={(e) => handleContextChange(e.target.value, selectedSemester)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {BEU_BRANCH_OPTIONS.map(b => (
                <option key={b.code} value={b.code} className="bg-slate-900 text-white">
                  {b.code} - {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Picker */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedSemester}
              onChange={(e) => handleContextChange(selectedBranch, parseInt(e.target.value, 10))}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  Sem {s}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <div className="flex p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            {(['hinglish', 'english', 'hindi'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize transition-all ${
                  language === l
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l === 'hinglish' ? 'Hinglish' : l === 'hindi' ? 'हिन्दी' : 'English'}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
            title="Reset Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1">
          Exam Mode:
        </span>
        {[
          { id: 'all', label: 'All Modes', icon: Zap },
          { id: 'scan', label: '📸 Image & PDF Solver', icon: ImageIcon },
          { id: 'exam14', label: '🎯 14-Mark Answer', icon: Award },
          { id: 'pyq', label: '📊 PYQ Trends', icon: FileSpreadsheet },
          { id: 'viva', label: '🔬 Lab & Viva Prep', icon: Microscope },
          { id: 'plan', label: '📅 7-Day Blueprint', icon: Calendar }
        ].map(mode => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id as any);
                if (mode.id === 'scan' && !attachedFile) {
                  fileInputRef.current?.click();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-navy-900 text-white shadow-sm ring-1 ring-emerald-400'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1">
          High-Yield:
        </span>
        {quickPillActions.map((pill, idx) => {
          const Icon = pill.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill.query)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-800 whitespace-nowrap shadow-2xs transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 min-h-[480px] max-h-[640px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 to-navy-900 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-md mt-1 border border-slate-800">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div className={`max-w-3xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-navy-900 to-indigo-950 text-white rounded-tr-none shadow-md font-medium'
                : 'bg-slate-50/90 border border-slate-200/90 text-slate-900 rounded-tl-none space-y-3 shadow-xs'
            }`}>
              {/* Attached Media in User Message */}
              {msg.attachment && (
                <div className="mb-3 p-2 bg-white/10 rounded-xl border border-white/20 flex items-center gap-3">
                  {msg.attachment.type === 'image' ? (
                    <div
                      onClick={() => setPreviewImageModal(msg.attachment!.dataUrl)}
                      className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/40 cursor-pointer group flex-shrink-0"
                    >
                      <img
                        src={msg.attachment.dataUrl}
                        alt={msg.attachment.name || 'Scan'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center flex-shrink-0 border border-red-500/30 font-bold">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-xs truncate">
                      {msg.attachment.name || 'Uploaded Document'}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      {msg.attachment.type.toUpperCase()} • {msg.attachment.size || 'Processed'}
                    </p>
                  </div>
                </div>
              )}

              <div className="whitespace-pre-wrap font-sans space-y-2">
                {msg.content}
              </div>

              {msg.sender === 'assistant' && (
                <div className="pt-3 flex items-center justify-between border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Bihar Engineering University Grounded
                  </span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Answer</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Recommended Follow-ups:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowups.map((f, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSendMessage(f)}
                        className="px-3 py-1.5 text-xs bg-white text-navy-900 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 rounded-xl text-left font-medium transition-all shadow-2xs"
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
                className="w-9 h-9 rounded-2xl object-cover border border-slate-200 flex-shrink-0 mt-1 shadow-sm"
              />
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 to-navy-900 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-800">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-2xs">
              <span className="text-xs font-semibold text-slate-600">
                BEU AI is analyzing visual/text document & formulating 14-mark academic response...
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Floating Active File Attachment Chip */}
      {attachedFile && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            {attachedFile.type === 'image' ? (
              <div
                onClick={() => setPreviewImageModal(attachedFile.dataUrl)}
                className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-emerald-400 flex-shrink-0 cursor-pointer"
              >
                <img src={attachedFile.dataUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0 font-bold">
                <FileText className="w-6 h-6" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-emerald-950 text-xs truncate max-w-xs">{attachedFile.name}</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold uppercase">
                  {attachedFile.type}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700">
                {attachedFile.size} • Ready for AI 14-mark & OCR breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSendMessage(`Analyze this ${attachedFile.name} and provide step-by-step 14-mark solution.`)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <span>Instant Solve</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setAttachedFile(null)}
              className="p-1.5 rounded-xl bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors"
              title="Remove attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,application/pdf"
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute left-3 p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-all flex items-center justify-center cursor-pointer group"
          title="Upload Question Paper, Handwritten Notes or Diagram (Image / PDF)"
        >
          <Paperclip className="w-4 h-4 group-hover:rotate-45 transition-transform text-slate-700" />
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            attachedFile
              ? `Ask specific doubt about ${attachedFile.name} (e.g. "Solve step 3 derivation", "Find 14-mark answer")...`
              : `Poochiye koi doubt ya photo/PDF attach karein (${selectedBranch} Sem ${selectedSemester})...`
          }
          className="w-full pl-13 pr-14 py-4 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy-900 shadow-sm bg-white font-medium"
        />

        <button
          type="submit"
          disabled={(!inputQuery.trim() && !attachedFile) || isTyping}
          className="absolute right-2.5 p-2.5 bg-navy-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4 text-emerald-400" />
        </button>
      </form>

      {/* Lightbox Preview Modal for Attached Images */}
      {previewImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-white max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4">
              <span className="font-bold text-sm">Image Attachment Viewer</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 25, 250))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 25, 50))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setPreviewImageModal(null);
                    setZoomLevel(100);
                    setRotation(0);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-red-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-auto">
              <img
                src={previewImageModal}
                alt="Enlarged Scan"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-in-out'
                }}
                className="max-h-[70vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice Footer */}
      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
        <span>BEU AI Assistant is strictly aligned with Bihar Engineering University syllabus & 70-Mark Theory exam standards.</span>
      </div>
    </div>
  );
};
