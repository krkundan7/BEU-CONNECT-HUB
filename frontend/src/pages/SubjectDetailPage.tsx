import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import { AcademicService } from '../services/academicService';
import {
  ArrowLeft, BookOpen, FileText, Video,
  Sparkles, Download, Bookmark, ThumbsUp, Plus, CheckCircle2,
  ExternalLink, Layers, Clock, AlertCircle, Eye,
  X, ZoomIn, ZoomOut, ShieldCheck, Check, ChevronDown
} from 'lucide-react';
import { Note, StudyVideo, Subject, Topic } from '../types';

export const SubjectDetailPage: React.FC = () => {
  const { selectedSubjectId, navigateTo, openReportModal } = useNavigation();
  const { currentUser, toggleBookmarkResource } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'pyqs' | 'videos' | 'ai'>('syllabus');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  // Subject state
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  // Note Upload & Preview State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteUnit, setNoteUnit] = useState(1);
  const [noteFileType, setNoteFileType] = useState<'pdf' | 'image'>('pdf');
  const [noteFileDataUrl, setNoteFileDataUrl] = useState('');
  const [noteFileSize, setNoteFileSize] = useState('2.8 MB');
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [activeVideo, setActiveVideo] = useState<StudyVideo | null>(null);

  useEffect(() => {
    async function fetchSubject() {
      setLoading(true);
      const subId = selectedSubjectId || 'PCC-CS301';
      const fetched = await AcademicService.getSubjectById(subId);
      if (fetched) {
        setSubject(fetched);
        if (fetched.units && fetched.units.length > 0) {
          setExpandedUnits({ [fetched.units[0].id]: true });
        }
      } else {
        const localSub = StorageService.getSubjectById(subId);
        if (localSub) setSubject(localSub);
      }
      setLoading(false);
    }
    fetchSubject();
  }, [selectedSubjectId]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-700">Loading verified BEU syllabus structure...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-slate-800">Subject not found</p>
        <button
          onClick={() => navigateTo('study-hub')}
          className="mt-3 px-4 py-2 bg-navy-900 text-white text-xs font-semibold rounded-xl"
        >
          Back to Study Hub
        </button>
      </div>
    );
  }

  const toggleUnitAccordion = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const handleTopicStatusToggle = async (topicId: string, currentStatus?: string) => {
    const nextStatusMap: Record<string, 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVISION_REQUIRED'> = {
      NOT_STARTED: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'REVISION_REQUIRED',
      REVISION_REQUIRED: 'NOT_STARTED',
    };

    const nextStatus = nextStatusMap[currentStatus || 'NOT_STARTED'] || 'IN_PROGRESS';
    await AcademicService.updateTopicProgress(topicId, nextStatus);

    setSubject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        units: prev.units?.map(u => ({
          ...u,
          topics: u.topics.map(t =>
            t.id === topicId ? { ...t, progress: [{ topicId, status: nextStatus }] } : t
          ),
        })),
      };
    });

    showToast(`Topic study status marked as ${nextStatus.replace('_', ' ')}`, 'success');
  };

  const notes = StorageService.getNotes(subject.id).filter(n =>
    selectedUnit === 'all' || n.unit === selectedUnit
  );

  const pyqs = StorageService.getPYQs(subject.branchCode || 'CSE', subject.semester || 3, subject.id);
  const videos = StorageService.getVideos(subject.id).filter(v =>
    selectedUnit === 'all' || v.unit === selectedUnit
  );

  const handleUploadNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !noteTitle.trim()) return;

    const finalUrl = noteFileDataUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200';

    const newNote: Note = {
      id: `note-${Date.now()}`,
      subjectId: subject.id,
      subjectName: subject.name,
      branchCode: subject.branchCode || 'CSE',
      semester: subject.semester || 3,
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
      verified: true,
    };

    StorageService.addNote(newNote);
    setShowUploadModal(false);
    setNoteTitle('');
    setNoteDesc('');
    showToast('Handwritten notes uploaded successfully!', 'success');
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('study-hub')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Study Hub</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official BEU Syllabus ✓ Verified</span>
        </div>
      </div>

      {/* Subject Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {subject.code}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
              {subject.credits} Credits • L-T-P: {subject.ltp || '3-1-0'}
            </span>
            <span className="text-xs text-slate-300">
              Exam: {subject.endSemMarks || 70} Marks | Sessional: {subject.internalMarks || 30} Marks
            </span>
          </div>

          <a
            href={subject.sourceUrl || 'https://beu-bih.ac.in/academics/Syllabus/B.Tech'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-300 hover:text-emerald-400 font-medium inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
          >
            <span>View Official BEU PDF</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{subject.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-2 leading-relaxed">
            {subject.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              navigateTo('ai-assistant', {
                prompt: `Mujhe BEU ${subject.name} (${subject.code}) ke standard repeated PYQs aur high-frequency numerical model questions samjhao.`,
              });
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discuss in AI Tutor</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Handwritten Notes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5 rounded-2xl shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'syllabus' ? 'bg-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Syllabus Checklist ({subject.units?.length || 5} Units)</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'notes' ? 'bg-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Handwritten Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pyqs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'pyqs' ? 'bg-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Solved PYQs ({pyqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'videos' ? 'bg-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Video Lectures ({videos.length})</span>
        </button>
      </div>

      {/* Tab Content: Syllabus Checklist */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
            <span>
              💡 <strong>Topic Study Tracker:</strong> Click the status pill on any topic to cycle through completion states.
            </span>
          </div>

          {subject.units && subject.units.length > 0 ? (
            subject.units.map(unit => {
              const isExpanded = !!expandedUnits[unit.id];
              return (
                <div key={unit.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div
                    onClick={() => toggleUnitAccordion(unit.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-navy-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                        U{unit.unitNumber}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{unit.unitTitle}</h3>
                        <p className="text-xs text-slate-500">
                          {unit.hours} Hours • Exam Yield: {unit.examFrequency} • {unit.topics.length} Official Topics
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180 text-navy-900' : ''
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-3 bg-slate-50/40 border-t border-slate-100">
                      {unit.description && (
                        <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                          <strong>Syllabus Scope: </strong> {unit.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        {unit.topics.map(topic => {
                          const currentStatus = topic.progress?.[0]?.status || 'NOT_STARTED';
                          return (
                            <div
                              key={topic.id}
                              className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-slate-900">
                                  {topic.orderIndex}. {topic.title}
                                </span>
                                {topic.subTopics && topic.subTopics.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {topic.subTopics.map(sub => (
                                      <span
                                        key={sub.id}
                                        className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                                      >
                                        • {sub.title}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button
                                  onClick={() => {
                                    navigateTo('ai-assistant', {
                                      prompt: `Mujhe BEU ${subject.name} ke topic "${topic.title}" ko formula aur important questions ke saath Hinglish mein samjhao.`,
                                    });
                                  }}
                                  className="text-xs font-semibold text-purple-700 hover:bg-purple-50 px-2 py-1 rounded-lg flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>AI Tutor</span>
                                </button>

                                <button
                                  onClick={() => handleTopicStatusToggle(topic.id, currentStatus)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    currentStatus === 'COMPLETED'
                                      ? 'bg-emerald-600 text-white'
                                      : currentStatus === 'IN_PROGRESS'
                                      ? 'bg-blue-600 text-white'
                                      : currentStatus === 'REVISION_REQUIRED'
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {currentStatus === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  {currentStatus === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5" />}
                                  {currentStatus === 'REVISION_REQUIRED' && <AlertCircle className="w-3.5 h-3.5" />}
                                  <span>
                                    {currentStatus === 'COMPLETED'
                                      ? 'Completed'
                                      : currentStatus === 'IN_PROGRESS'
                                      ? 'In Progress'
                                      : currentStatus === 'REVISION_REQUIRED'
                                      ? 'Revision Req.'
                                      : 'Not Started'}
                                  </span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              Syllabus data active. Access notes & PYQs in the tabs above.
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Handwritten Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(n => (
              <div key={n.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                    Unit {n.unit} Note
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{n.fileSize}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{n.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">By {n.authorName}</span>
                  <a
                    href={n.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: PYQs */}
      {activeTab === 'pyqs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pyqs.map(p => (
              <div key={p.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-navy-50 text-navy-900">
                    {p.year} {p.examType}
                  </span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    7 & 14 Marks
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{p.downloadCount} Downloads</span>
                  <a
                    href={p.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-navy-900 hover:text-navy-700 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Paper</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Videos */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map(v => (
              <div key={v.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700">
                    Unit {v.unit} Video
                  </span>
                  <span className="text-xs text-slate-400">{v.duration}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
                <p className="text-xs text-slate-600">{v.channelName}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={v.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch on YouTube</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Note Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">Upload Handwritten Notes</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3: Complete AVL Rotations & Solved Numericals"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Number</label>
                  <select
                    value={noteUnit}
                    onChange={e => setNoteUnit(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(u => (
                      <option key={u} value={u}>Unit {u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Format</label>
                  <select
                    value={noteFileType}
                    onChange={e => setNoteFileType(e.target.value as 'pdf' | 'image')}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="image">Scanned Image</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Formula Summary</label>
                <textarea
                  rows={3}
                  placeholder="Summary of formulas, 2019-2024 solved questions included..."
                  value={noteDesc}
                  onChange={e => setNoteDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
                >
                  Publish Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
