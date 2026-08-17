import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import {
  ArrowLeft, BookOpen, FileText, FileSpreadsheet, Video,
  Sparkles, Download, Bookmark, ThumbsUp, Plus, CheckCircle2,
  ExternalLink, Bot, HelpCircle, Layers, Clock
} from 'lucide-react';
import { Note } from '../types';

export const SubjectDetailPage: React.FC = () => {
  const { selectedSubjectId, navigateTo, openReportModal } = useNavigation();
  const { currentUser, toggleBookmarkResource } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'pyqs' | 'videos' | 'ai'>('syllabus');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Note Upload Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteUnit, setNoteUnit] = useState(1);

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
    if (!currentUser) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      subjectId: subject.id,
      subjectName: subject.name,
      branchCode: subject.branchCode,
      semester: subject.semester,
      unit: Number(noteUnit),
      title: noteTitle,
      description: noteDesc,
      fileUrl: 'https://example.com/uploaded-note.pdf',
      fileType: 'pdf',
      fileSize: '3.2 MB',
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
            <p className="text-xs text-beu-muted">Verified handwritten peer study notes and formula sheets</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              + Upload your notes (Earn Points)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map(note => {
              const isBookmarked = currentUser?.bookmarkedResourceIds.includes(note.id);
              return (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                        Unit {note.unit} Notes
                      </span>
                      <span className="text-[11px] text-slate-400">{note.fileSize}</span>
                    </div>

                    <h3 className="text-sm font-bold text-beu-dark leading-snug">{note.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{note.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
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
                        onClick={() => showToast('Simulating note download...', 'success')}
                        className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map(v => (
            <div
              key={v.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                    Unit {v.unit} Lecture
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{v.duration}</span>
                </div>
                <h3 className="text-sm font-bold text-beu-dark">{v.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{v.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-600">{v.channelName} • {v.views} views</span>
                <a
                  href={v.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Watch Lecture</span>
                </a>
              </div>
            </div>
          ))}
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

      {/* Upload Note Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-beu-dark">Upload Study Resource</h3>
              <p className="text-xs text-beu-muted">Help your fellow BEU students and earn Karma Contribution Points</p>
            </div>

            <form onSubmit={handleUploadNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Title of Notes</label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  required
                  placeholder="e.g. Complete Unit 3 AVL Trees Handwritten Solved Notes"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Unit Number</label>
                <select
                  value={noteUnit}
                  onChange={(e) => setNoteUnit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                >
                  {[1, 2, 3, 4, 5].map(u => (
                    <option key={u} value={u}>Unit {u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-beu-dark mb-1">Description & Topic Highlights</label>
                <textarea
                  rows={3}
                  value={noteDesc}
                  onChange={(e) => setNoteDesc(e.target.value)}
                  required
                  placeholder="Briefly describe what formulas or solved BEU questions are inside..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-beu-dark">Choose PDF or Document file</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Maximum size: 25 MB</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Submit & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
