import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import {
  FileText, Search, Plus, Bookmark, Download,
  ThumbsUp, CheckCircle2, Eye, Image as ImageIcon,
  FileCode, X, ZoomIn, ZoomOut, RotateCw, ExternalLink,
  Sparkles, UploadCloud, Layers
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { Note } from '../types';

export const NotesPage: React.FC = () => {
  const { currentUser, toggleBookmarkResource } = useAuth();
  const { showToast } = useNotification();

  const [notes, setNotes] = useState<Note[]>(StorageService.getNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'pdf' | 'image'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Active Note Preview Modal state
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // New Note Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subjectName, setSubjectName] = useState('Data Structures & Algorithms');
  const [unit, setUnit] = useState(1);
  const [fileType, setFileType] = useState<'pdf' | 'image'>('pdf');
  const [uploadedFileDataUrl, setUploadedFileDataUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('2.5 MB');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = StorageService.getSubjects();

  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      selectedSubject === 'all' ||
      n.subjectName.toLowerCase().includes(selectedSubject.toLowerCase());

    const matchesFileType =
      fileTypeFilter === 'all' || n.fileType === fileTypeFilter;

    return matchesSearch && matchesSubject && matchesFileType;
  });

  const handleLike = (noteId: string) => {
    StorageService.likeNote(noteId);
    setNotes(StorageService.getNotes());
    showToast('Upvoted note! Author awarded +10 points.', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFileSize(`${sizeInMb} MB`);

    if (file.type.startsWith('image/')) {
      setFileType('image');
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setFileType('pdf');
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title.trim()) return;

    // Use uploaded data url or appropriate placeholder
    const finalFileUrl =
      uploadedFileDataUrl ||
      (fileType === 'image'
        ? 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80');

    const newNote: Note = {
      id: `note-${Date.now()}`,
      subjectId: 'cse-301',
      subjectName,
      branchCode: currentUser.branchCode || 'CSE',
      semester: currentUser.semester || 3,
      unit: Number(unit),
      title: title.trim(),
      description: desc.trim() || 'Handwritten study note and formula sheet for BEU examinations.',
      fileUrl: finalFileUrl,
      thumbnailUrl: finalFileUrl,
      fileType,
      fileSize: uploadedFileSize,
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

    // Reset Form
    setTitle('');
    setDesc('');
    setUploadedFileDataUrl('');
    setUploadedFileName('');
    showToast('Note uploaded successfully! +50 Contribution Points awarded 🎉', 'success');
  };

  const openPreview = (note: Note) => {
    setPreviewNote(note);
    setZoomLevel(1);
    setRotation(0);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-navy-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>BEU Peer Knowledge Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Handwritten Notes, Diagrams & PDF Cheatsheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Browse verified study material, solved numericals, circuit schematics, and derivation summaries uploaded by BEU rankers across Bihar. Supports high-res handwritten images and multi-page PDFs.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs sm:text-sm font-extrabold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all self-start md:self-auto transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload Image / PDF Note</span>
        </button>
      </div>

      {/* Search, Subject & Format Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, derivation topics, author..."
            className="w-full pl-10 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* File Type Filter Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'pdf', label: '📄 PDFs', icon: FileText },
              { id: 'image', label: '🖼️ Handwritten Images', icon: ImageIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFileTypeFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  fileTypeFilter === tab.id
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium text-slate-700"
            >
              <option value="all">All BEU Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No study notes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or subject/format filters, or be the first to upload handwritten notes for this topic!
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-xl mt-2 inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Upload Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map(note => {
            const isBookmarked = currentUser?.bookmarkedResourceIds.includes(note.id);
            const isImage = note.fileType === 'image';

            return (
              <div
                key={note.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Note Card Visual Banner / Preview Thumbnail */}
                  <div
                    onClick={() => openPreview(note)}
                    className="relative h-44 bg-slate-950 overflow-hidden cursor-pointer group-hover:opacity-95 transition-opacity"
                  >
                    {note.thumbnailUrl ? (
                      <img
                        src={note.thumbnailUrl}
                        alt={note.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                        <FileText className="w-10 h-10 mb-2 text-slate-600" />
                        <span className="text-xs font-medium">Click to Preview Document</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    {/* Format Badge (Image vs PDF) */}
                    <div className="absolute top-3 left-3">
                      {isImage ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                          <ImageIcon className="w-3 h-3" /> Image Scan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                          <FileText className="w-3 h-3" /> PDF Document
                        </span>
                      )}
                    </div>

                    {/* Quick Preview Hover Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <span className="px-3 py-1.5 rounded-xl bg-white/90 text-navy-950 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" /> Click to View
                      </span>
                    </div>

                    {/* Unit & File Size at bottom of banner */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium">
                      <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        Unit {note.unit} • {note.branchCode} Sem {note.semester}
                      </span>
                      <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs font-bold text-emerald-400">
                        {note.fileSize}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md line-clamp-1">
                        {note.subjectName}
                      </span>
                    </div>

                    <h3
                      onClick={() => openPreview(note)}
                      className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700 transition-colors"
                    >
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {note.description}
                    </p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  {/* Author details */}
                  <div className="flex items-center gap-2">
                    <img
                      src={note.authorAvatar}
                      alt={note.authorName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-[11px]">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-slate-800 leading-none">{note.authorName}</p>
                        {note.verified && (
                          <span title="Verified Ranker Notes">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[10px] mt-0.5">{note.authorCollege}</p>
                    </div>
                  </div>

                  {/* Actions (Like, Bookmark, View/Download) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleLike(note.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-600 transition-colors"
                      title="Upvote note"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{note.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleBookmarkResource(note.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'hover:bg-white border-slate-200 text-slate-500'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark note'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openPreview(note)}
                      className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
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
      )}

      {/* FULL NOTE PREVIEW / READER MODAL */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
                  {previewNote.fileType === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {previewNote.fileType.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-300">
                      {previewNote.subjectName} • Unit {previewNote.unit}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {previewNote.title}
                  </h3>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {previewNote.fileType === 'image' && (
                  <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                      className="p-1.5 text-slate-300 hover:text-white rounded-lg"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono px-1 text-slate-300">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                      className="p-1.5 text-slate-300 hover:text-white rounded-lg"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRotation(prev => (prev + 90) % 360)}
                      className="p-1.5 text-slate-300 hover:text-white rounded-lg"
                      title="Rotate 90deg"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <a
                  href={previewNote.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => setPreviewNote(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 bg-slate-100 overflow-auto p-4 flex items-center justify-center relative">
              {previewNote.fileType === 'image' ? (
                <div className="overflow-auto max-w-full max-h-full flex items-center justify-center p-4">
                  <img
                    src={previewNote.fileUrl}
                    alt={previewNote.title}
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-xl border border-slate-300 bg-white"
                  />
                </div>
              ) : (
                <div className="w-full h-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">PDF Reader Mode: {previewNote.title}</p>
                        <p className="text-blue-700 mt-0.5">
                          This verified peer document ({previewNote.fileSize}) is prepared in compliant BEU exam syllabus format.
                        </p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 text-slate-800 space-y-4 font-sans text-xs sm:text-sm">
                      <h4 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-2">
                        {previewNote.title}
                      </h4>
                      <p className="leading-relaxed text-slate-700">
                        {previewNote.description}
                      </p>

                      {/* Embedded Sample Notes Preview Sheet */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b pb-2">
                          <span>BEU UNIT {previewNote.unit} SUMMARY SHEET</span>
                          <span>AUTHOR: {previewNote.authorName} ({previewNote.authorCollege})</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                          <li>Verified high-yield formulas and 14-marks standard derivations.</li>
                          <li>Step-by-step solved BEU previous year question models.</li>
                          <li>Labeled diagrams and tabular difference comparisons.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      File Format: <strong className="text-slate-800">PDF ({previewNote.fileSize})</strong>
                    </span>
                    <a
                      href={previewNote.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-navy-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Full PDF in New Window
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD NOTE MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Upload Handwritten Note / PDF</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              {/* File Type Selection (Image vs PDF) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Note Document Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFileType('pdf')}
                    className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      fileType === 'pdf'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>PDF Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFileType('image')}
                    className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      fileType === 'image'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>Handwritten Image / Scan</span>
                  </button>
                </div>
              </div>

              {/* File Picker Drag & Drop Box */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Attach {fileType === 'image' ? 'Image File (PNG, JPG, WEBP)' : 'PDF File (.pdf)'}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer hover:bg-emerald-50/30 transition-all space-y-2 bg-slate-50/50"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={fileType === 'image' ? 'image/*' : 'application/pdf,.pdf'}
                    className="hidden"
                  />

                  {uploadedFileDataUrl ? (
                    <div className="space-y-2">
                      {fileType === 'image' ? (
                        <img
                          src={uploadedFileDataUrl}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-xl border border-slate-200"
                        />
                      ) : (
                        <div className="p-4 bg-white rounded-xl border border-blue-200 flex items-center justify-center gap-2 text-blue-700 font-bold">
                          <FileText className="w-5 h-5" />
                          <span>{uploadedFileName || 'Document.pdf'}</span>
                        </div>
                      )}
                      <p className="text-[11px] text-emerald-600 font-bold">
                        File selected: {uploadedFileName || 'Attachment ready'} ({uploadedFileSize})
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">Click to browse or drag & drop</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {fileType === 'image' ? 'Upload high-resolution scans of your notes' : 'Upload multi-page PDF documents up to 25MB'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Note Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Trees & AVL 4 Rotations Step-by-Step Notes"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                />
              </div>

              {/* Subject & Unit Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Subject</label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Unit Number</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  >
                    {[1, 2, 3, 4, 5].map(u => (
                      <option key={u} value={u}>
                        Unit {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Description / Key Topics</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Mention important derivations, solved numericals, formulas included..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none font-medium"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upload & Earn +50 Pts</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
