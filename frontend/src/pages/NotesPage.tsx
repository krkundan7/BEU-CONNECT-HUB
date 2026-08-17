import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import {
  FileText, Search, Plus, Bookmark, Download,
  ThumbsUp, CheckCircle2, Filter, Sparkles
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { Note } from '../types';

export const NotesPage: React.FC = () => {
  const { currentUser, toggleBookmarkResource } = useAuth();
  const { openReportModal } = useNavigation();
  const { showToast } = useNotification();

  const [notes, setNotes] = useState(StorageService.getNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Note Form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subjectName, setSubjectName] = useState('Data Structures & Algorithms');
  const [unit, setUnit] = useState(1);

  const subjects = StorageService.getSubjects();

  const filteredNotes = notes.filter(n => {
    const matchesSearch = !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || n.subjectName.toLowerCase().includes(selectedSubject.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  const handleLike = (noteId: string) => {
    StorageService.likeNote(noteId);
    setNotes(StorageService.getNotes());
    showToast('Upvoted note! Author awarded +10 points.', 'success');
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title) return;

    const newNote: Note = {
      id: `note-${Date.now()}`,
      subjectId: 'cse-301',
      subjectName,
      branchCode: currentUser.branchCode,
      semester: currentUser.semester,
      unit: Number(unit),
      title,
      description: desc,
      fileUrl: 'https://example.com/note.pdf',
      fileType: 'pdf',
      fileSize: '3.4 MB',
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
    setNotes(StorageService.getNotes());
    setShowUploadModal(false);
    setTitle('');
    setDesc('');
    showToast('Note uploaded successfully! +50 Contribution Points.', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Peer Knowledge Sharing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Handwritten Notes & Cheatsheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Download solved numericals, derivation summaries, and unit notes shared by top rankers across BEU colleges.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Notes</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by topic or author..."
            className="w-full pl-10 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Filter:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
          >
            <option value="all">All Engineering Subjects</option>
            <option value="Data Structures">Data Structures & Algorithms</option>
            <option value="Database">Database Management Systems</option>
            <option value="Object Oriented">Object Oriented Programming</option>
            <option value="Digital">Digital Electronics</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map(note => {
          const isBookmarked = currentUser?.bookmarkedResourceIds.includes(note.id);
          return (
            <div
              key={note.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                    {note.subjectName} • Unit {note.unit}
                  </span>
                  <span className="text-[11px] text-slate-400">{note.fileSize}</span>
                </div>

                <h3 className="text-sm font-bold text-beu-dark leading-snug">{note.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{note.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={note.authorAvatar} alt={note.authorName} className="w-7 h-7 rounded-full object-cover" />
                  <div className="text-[11px]">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-beu-dark leading-none">{note.authorName}</p>
                      {note.verified && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    </div>
                    <p className="text-slate-400 text-[10px]">{note.authorCollege}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(note.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{note.likes}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmarkResource(note.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isBookmarked ? 'bg-amber-50 border-amber-300 text-amber-600' : 'hover:bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => showToast(`Downloaded ${note.title}`, 'success')}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-beu-dark">Upload Handwritten Note</h3>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-beu-dark mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Graph Algorithms Kruskal Prim Solved Notes"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Subject</label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    <option value="Data Structures & Algorithms">Data Structures</option>
                    <option value="Database Management Systems">DBMS</option>
                    <option value="Digital Electronics">Digital Electronics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    {[1, 2, 3, 4, 5].map(u => (
                      <option key={u} value={u}>Unit {u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Summary Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  placeholder="Mention key topics, solved examples, and marks weightage..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
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
