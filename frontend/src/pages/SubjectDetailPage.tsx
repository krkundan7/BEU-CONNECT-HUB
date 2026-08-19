import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import {
  ArrowLeft, BookOpen, FileText, FileSpreadsheet, Video,
  Sparkles, Download, Bookmark, ThumbsUp, Plus, CheckCircle2,
  ExternalLink, Bot, HelpCircle, Layers, Clock, Eye,
  Image as ImageIcon, X, ZoomIn, ZoomOut, RotateCw, UploadCloud,
  Play, Film
} from 'lucide-react';
import { Note, StudyVideo } from '../types';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const SubjectDetailPage: React.FC = () => {
  const { selectedSubjectId, navigateTo, openReportModal } = useNavigation();
  const { currentUser, toggleBookmarkResource } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'pyqs' | 'videos' | 'ai'>('syllabus');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Note Upload & Preview State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteUnit, setNoteUnit] = useState(1);
  const [noteFileType, setNoteFileType] = useState<'pdf' | 'image'>('pdf');
  const [noteFileDataUrl, setNoteFileDataUrl] = useState('');
  const [noteFileName, setNoteFileName] = useState('');
  const [noteFileSize, setNoteFileSize] = useState('2.8 MB');
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [activeVideo, setActiveVideo] = useState<StudyVideo | null>(null);

  const subject = StorageService.getSubjectById(selectedSubjectId || 'cse-301');

  if (!subject) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-beu-dark">Subject not found</p>
        <button
          onClick={() => navigateTo('study-hub')}
          className="mt-3 px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-xl"
        >
          Back to Study Hub
        </button>
      </div>
    );
  }

  const syllabusTopics = StorageService.getSyllabusTopics(subject.id).filter(t =>
    selectedUnit === 'all' || t.unit === selectedUnit
  );

  const notes = StorageService.getNotes(subject.id).filter(n =>
    selectedUnit === 'all' || n.unit === selectedUnit
  );

  const pyqs = StorageService.getPYQs(subject.branchCode, subject.semester, subject.id);
  const videos = StorageService.getVideos(subject.id).filter(v =>
    selectedUnit === 'all' || v.unit === selectedUnit
  );

  const handleUploadNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !noteTitle.trim()) return;

    const finalUrl = noteFileDataUrl || (
      noteFileType === 'image'
        ? 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80'
    );

    const newNote: Note = {
      id: `note-${Date.now()}`,
      subjectId: subject.id,
      subjectName: subject.name,
      branchCode: subject.branchCode,
      semester: subject.semester,
      unit: Number(noteUnit),
      title: noteTitle.trim(),
      description: noteDesc.trim() || 'Handwritten study note and derivation summary.',
      fileUrl: finalUrl,
      thumbnailUrl: finalUrl,
      fileType: noteFileType,
      fileSize: noteFileSize,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorCollege: currentUser.college,
      likes: 1,
      bookmarks: 0,
      createdAt: 'Just now',
      verified: true
    };

    StorageService.addNote(newNote);
    setShowUploadModal(false);
    setNoteTitle('');
    setNoteDesc('');
    setNoteFileDataUrl('');
    setNoteFileName('');
    showToast('Note uploaded successfully! +50 Karma Points awarded.', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back Button & Subject Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('study-hub')}
          className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-semibold text-beu-muted">{subject.branchCode} • Semester {subject.semester}</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-beu-dark">{subject.name}</h1>
        </div>
      </div>

      {/* Subject Info Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold bg-navy-900 text-white px-2.5 py-0.5 rounded-lg">
              {subject.code}
            </span>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-lg">
              {subject.credits} Credits
            </span>
            <span className="text-xs font-medium text-slate-500">
              5 Prescribed Units
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {subject.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('pyq-analyzer')}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>PYQ Analyzer</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Notes</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 scrollbar-none">
        {[
          { id: 'syllabus', label: 'Detailed Syllabus', icon: BookOpen, count: syllabusTopics.length },
          { id: 'notes', label: 'Handwritten Notes', icon: FileText, count: notes.length },
          { id: 'pyqs', label: 'PYQ Papers', icon: FileSpreadsheet, count: pyqs.length },
          { id: 'videos', label: 'Study Videos', icon: Video, count: videos.length },
          { id: 'ai', label: 'AI High-Yield Guide', icon: Bot, count: null }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-navy-900 text-navy-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-navy-100 text-navy-900' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Unit Filter Bar (for syllabus, notes, videos) */}
      {activeTab !== 'ai' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Filter Unit:</span>
          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              selectedUnit === 'all' ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Units
          </button>
          {[1, 2, 3, 4, 5].map(u => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                selectedUnit === u ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Unit {u}
            </button>
          ))}
        </div>
      )}

      {/* TAB 1: SYLLABUS */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          {syllabusTopics.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-navy-100 text-navy-900 px-2 py-0.5 rounded">
                    Unit {item.unit}: {item.unitTitle}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {item.hours} Lecture Hours
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.pyqFrequency === 'High'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : item.pyqFrequency === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {item.pyqFrequency === 'High' ? '🔴 High Exam Frequency' : `${item.pyqFrequency} Frequency`}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-beu-dark">{item.topic}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => navigateTo('ai-assistant')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Explain this concept with BEU AI →</span>
                </button>

                <button
                  onClick={() => openReportModal('syllabus_topic', item.id, item.topic)}
                  className="text-[11px] text-slate-400 hover:text-red-500"
                >
                  Report correction
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-beu-muted">Verified handwritten peer study notes, image scans, and PDF formula sheets</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Upload Image / PDF Notes (+50 Pts)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map(note => {
              const isBookmarked = currentUser?.bookmarkedResourceIds.includes(note.id);
              const isImage = note.fileType === 'image';
              return (
                <div
                  key={note.id}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {note.thumbnailUrl && (
                    <div
                      onClick={() => setPreviewNote(note)}
                      className="relative h-36 bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={note.thumbnailUrl}
                        alt={note.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                      <div className="absolute top-2.5 left-2.5">
                        {isImage ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                            <ImageIcon className="w-3 h-3" /> Image Scan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase">
                            <FileText className="w-3 h-3" /> PDF Document
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                        <span className="bg-black/60 px-2 py-0.5 rounded font-medium">Unit {note.unit} Notes</span>
                        <span className="bg-black/60 px-2 py-0.5 rounded font-bold text-emerald-400">{note.fileSize}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    {!note.thumbnailUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                          Unit {note.unit} Notes
                        </span>
                        <span className="text-[11px] text-slate-400">{note.fileSize}</span>
                      </div>
                    )}

                    <h3
                      onClick={() => setPreviewNote(note)}
                      className="text-sm font-bold text-beu-dark leading-snug cursor-pointer hover:text-emerald-700 transition-colors"
                    >
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{note.description}</p>
                  </div>

                  <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <img src={note.authorAvatar} alt={note.authorName} className="w-6 h-6 rounded-full object-cover" />
                      <div className="text-[11px]">
                        <p className="font-semibold text-beu-dark leading-none">{note.authorName}</p>
                        <p className="text-slate-400 text-[10px]">{note.authorCollege}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmarkResource(note.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked ? 'bg-amber-50 border-amber-300 text-amber-600' : 'hover:bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setPreviewNote(note)}
                        className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PYQS */}
      {activeTab === 'pyqs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">🔴 High-Yield Exam Notice:</span>
              <span>BEU End-Sem questions from 2021-2024 have an 80%+ pattern repeat rate for Units 3 & 4.</span>
            </div>
            <button
              onClick={() => navigateTo('pyq-analyzer')}
              className="text-xs font-bold text-red-700 underline whitespace-nowrap ml-2"
            >
              Open AI Pattern Breakdown →
            </button>
          </div>

          <div className="space-y-3">
            {pyqs.map(p => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {p.year}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-beu-dark">{p.title}</h3>
                    <p className="text-[11px] text-beu-muted">{p.examType} • {p.fileSize} • {p.downloadCount} students downloaded</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => showToast('Opening solved PDF question paper...', 'info')}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => showToast(`Downloaded ${p.title}`, 'success')}
                    className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-beu-muted">Curated YouTube video lectures and student lab walkthroughs</p>
            <button
              onClick={() => navigateTo('videos')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Upload / Share Video (+50 Pts)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map(v => {
              const isUpload = v.videoType === 'upload';
              const thumb =
                v.thumbnailUrl ||
                (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : '');

              return (
                <div
                  key={v.id}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Video Thumbnail with Play Button */}
                  <div
                    onClick={() => setActiveVideo(v)}
                    className="relative h-40 bg-slate-950 overflow-hidden cursor-pointer"
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                        <Video className="w-8 h-8 mb-1" />
                        <span className="text-xs">Click to Watch</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                    
                    <div className="absolute top-2.5 left-2.5">
                      {isUpload ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                          <Film className="w-3 h-3" /> Direct Video
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase">
                          <YoutubeIcon className="w-3 h-3" /> YouTube
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono font-bold">
                        <Clock className="w-3 h-3 text-red-400" /> {v.duration}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white">
                      <span className="bg-black/60 px-2 py-0.5 rounded font-medium">Unit {v.unit} Lecture</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3
                      onClick={() => setActiveVideo(v)}
                      className="text-sm font-bold text-beu-dark leading-snug cursor-pointer hover:text-red-600 transition-colors"
                    >
                      {v.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{v.description}</p>
                  </div>

                  <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="text-[11px]">
                      <p className="font-semibold text-slate-800 line-clamp-1">{v.channelName}</p>
                      <p className="text-slate-400 text-[10px]">{v.views}</p>
                    </div>

                    <button
                      onClick={() => setActiveVideo(v)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: AI HIGH-YIELD GUIDE */}
      {activeTab === 'ai' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-beu-dark">AI High-Yield Exam Guide for {subject.name}</h3>
              <p className="text-xs text-beu-muted">Synthesized from past 5 years BEU examination patterns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-700">Must-Do 14-Mark Numericals</h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>AVL Tree 4 Rotations step-by-step key insertion (Unit 3)</li>
                <li>Minimum Spanning Tree: Prim's & Kruskal's tabular trace (Unit 4)</li>
                <li>QuickSort best & worst case recurrence relation derivations (Unit 5)</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Section A High Probability Short Answers</h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Big-O, Omega, and Theta mathematical definition</li>
                <li>Difference between Array vs Linked List memory allocations</li>
                <li>Sparse matrix 3-tuple array representation</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => navigateTo('ai-assistant')}
            className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Ask BEU AI to Solve & Explain These Topics Step-by-Step</span>
          </button>
        </div>
      )}

      {/* NOTE PREVIEW / READER MODAL */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  {previewNote.fileType === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {previewNote.fileType.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{previewNote.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewNote.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  onClick={() => setPreviewNote(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 overflow-auto p-4 flex items-center justify-center">
              {previewNote.fileType === 'image' ? (
                <img
                  src={previewNote.fileUrl}
                  alt={previewNote.title}
                  className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-lg bg-white border border-slate-200"
                />
              ) : (
                <div className="w-full h-full max-w-3xl bg-white rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>PDF Document: {previewNote.title} ({previewNote.fileSize})</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{previewNote.description}</p>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">BEU Verified Peer Cheatsheet</p>
                      <p>Author: {previewNote.authorName} • {previewNote.authorCollege}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t flex justify-end">
                    <a
                      href={previewNote.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Full Document
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* IN-APP THEATER VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden max-h-[92vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  {activeVideo.videoType === 'upload' ? <Film className="w-4 h-4" /> : <YoutubeIcon className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    {activeVideo.videoType === 'upload' ? 'DIRECT VIDEO DEMO' : 'YOUTUBE LECTURE'}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{activeVideo.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
              {activeVideo.videoType === 'upload' ? (
                <video src={activeVideo.videoUrl} controls autoPlay className="w-full h-full object-contain">
                  Your browser does not support HTML5 video.
                </video>
              ) : activeVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <iframe
                  src={activeVideo.videoUrl}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>

            <div className="p-4 bg-white space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">{activeVideo.title}</h4>
              <p className="text-xs text-slate-500">
                Educator: <strong className="text-slate-800">{activeVideo.channelName}</strong> • {activeVideo.subjectName} (Unit {activeVideo.unit})
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Note Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-beu-dark">Upload Study Resource</h3>
                <p className="text-xs text-beu-muted">Share handwritten image scans or PDF notes for {subject.name}</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadNote} className="space-y-3.5 text-xs">
              {/* Format selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Document Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNoteFileType('pdf')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      noteFileType === 'pdf'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>PDF Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoteFileType('image')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      noteFileType === 'image'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Handwritten Image</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Title of Notes *</label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  required
                  placeholder="e.g. Unit 3 Trees & AVL Rotations Handwritten Notes"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Unit Number</label>
                <select
                  value={noteUnit}
                  onChange={(e) => setNoteUnit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                >
                  {[1, 2, 3, 4, 5].map(u => (
                    <option key={u} value={u}>Unit {u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description & Key Topics</label>
                <textarea
                  rows={3}
                  value={noteDesc}
                  onChange={(e) => setNoteDesc(e.target.value)}
                  placeholder="Mention formulas, derivations, or solved BEU numericals included..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none font-medium"
                />
              </div>

              {/* Upload Drop area */}
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50/70 space-y-1">
                <UploadCloud className="w-7 h-7 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-800">
                  {noteFileType === 'image' ? 'Upload Image File (PNG, JPG, WEBP)' : 'Upload PDF Document (.pdf)'}
                </p>
                <p className="text-[11px] text-slate-400">Max file size: 25 MB</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Upload & Earn +50 Pts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
