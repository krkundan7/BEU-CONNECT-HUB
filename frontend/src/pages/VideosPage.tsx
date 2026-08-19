import React, { useState, useRef } from 'react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StudyVideo } from '../types';
import {
  Video, Search, Play, ExternalLink, ThumbsUp, Sparkles,
  Plus, X, UploadCloud, Film, Eye, Clock, CheckCircle2,
  Bookmark, Share2, Tag, Layers
} from 'lucide-react';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const VideosPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [videos, setVideos] = useState<StudyVideo[]>(StorageService.getVideos());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'youtube' | 'upload'>('all');

  // Video Player Modal State
  const [activeVideo, setActiveVideo] = useState<StudyVideo | null>(null);

  // Upload/Share Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'youtube' | 'upload'>('youtube');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [subjectName, setSubjectName] = useState('Data Structures & Algorithms');
  const [unit, setUnit] = useState(1);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [channelName, setChannelName] = useState('');
  const [duration, setDuration] = useState('25:00');
  const [tagsInput, setTagsInput] = useState('');

  // Upload file state
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [uploadedVideoDataUrl, setUploadedVideoDataUrl] = useState<string>('');
  const [uploadedVideoFileName, setUploadedVideoFileName] = useState<string>('');
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState<string>('');

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const subjects = StorageService.getSubjects();

  // Helper to extract YouTube video ID from various URL formats
  const extractYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  const filteredVideos = videos.filter(v => {
    const matchesSearch =
      !searchQuery ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject =
      selectedSubject === 'all' ||
      v.subjectName.toLowerCase().includes(selectedSubject.toLowerCase());

    const isYoutube = v.videoType === 'youtube' || (!v.videoType && !!v.youtubeId);
    const matchesFormat =
      formatFilter === 'all' ||
      (formatFilter === 'youtube' && isYoutube) ||
      (formatFilter === 'upload' && v.videoType === 'upload');

    return matchesSearch && matchesSubject && matchesFormat;
  });

  const handleLike = (videoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    StorageService.likeVideo(videoId);
    setVideos(StorageService.getVideos());
    if (activeVideo && activeVideo.id === videoId) {
      setActiveVideo(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
    showToast('Upvoted lecture! Creator awarded +10 points.', 'success');
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedVideoFile(file);
    setUploadedVideoFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedVideoDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCustomThumbnailUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleShareVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !videoTitle.trim()) return;

    let finalVideoUrl = '';
    let ytId = '';
    let finalThumbnail = customThumbnailUrl;

    if (uploadType === 'youtube') {
      ytId = extractYoutubeId(youtubeUrl);
      if (!ytId && youtubeUrl.trim()) {
        ytId = '1QZDe_J_e4E'; // Fallback sample if format is arbitrary
      }
      finalVideoUrl = youtubeUrl || `https://www.youtube.com/watch?v=${ytId}`;
      if (!finalThumbnail && ytId) {
        finalThumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    } else {
      finalVideoUrl =
        uploadedVideoDataUrl ||
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      if (!finalThumbnail) {
        finalThumbnail =
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
      }
    }

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newVideo: StudyVideo = {
      id: `vid-${Date.now()}`,
      subjectId: 'cse-301',
      subjectName,
      branchCode: currentUser.branchCode || 'CSE',
      semester: currentUser.semester || 3,
      unit: Number(unit),
      title: videoTitle.trim(),
      description: videoDesc.trim() || 'Curated high-yield video lecture for BEU syllabus.',
      videoUrl: finalVideoUrl,
      videoType: uploadType,
      youtubeId: ytId,
      thumbnailUrl: finalThumbnail,
      duration: duration || '20:00',
      channelName: channelName.trim() || (uploadType === 'youtube' ? 'Top Educator' : `${currentUser.name} (Demo)`),
      authorName: currentUser.name,
      authorCollege: currentUser.college,
      likes: 1,
      views: '1 view',
      tags: parsedTags.length > 0 ? parsedTags : ['BEU Syllabus', 'Exam Prep'],
      createdAt: 'Just now'
    };

    StorageService.addVideo(newVideo);
    setVideos(StorageService.getVideos());
    setShowUploadModal(false);

    // Reset Form
    setVideoTitle('');
    setVideoDesc('');
    setYoutubeUrl('');
    setChannelName('');
    setUploadedVideoDataUrl('');
    setUploadedVideoFileName('');
    setCustomThumbnailUrl('');
    setTagsInput('');
    showToast('Video shared successfully! +50 Contribution Points awarded 🎉', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-navy-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Video className="w-4 h-4" />
            <span>Curated Video Lectures & Student Walkthroughs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Engineering Video Library & Demonstrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Watch high-yield video lectures from top national educators and lab experiment demonstrations recorded by BEU students, all mapped Unit-by-Unit to your syllabus.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white text-xs sm:text-sm font-extrabold rounded-2xl flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all self-start md:self-auto transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload / Share Video</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lectures, educators, numericals..."
            className="w-full pl-10 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Format filter pills */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {[
              { id: 'all', label: 'All Lectures' },
              { id: 'youtube', label: '🔴 YouTube Lectures', icon: YoutubeIcon },
              { id: 'upload', label: '📁 Student Demos', icon: Film }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFormatFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  formatFilter === tab.id
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
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

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No video lectures found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or be the first to share a video link / lab demo for this subject!
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-xl mt-2 inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Share Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map(v => {
            const isUpload = v.videoType === 'upload';
            const thumb =
              v.thumbnailUrl ||
              (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : '');

            return (
              <div
                key={v.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail / Video Box */}
                  <div
                    onClick={() => setActiveVideo(v)}
                    className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer"
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                        <Video className="w-10 h-10 mb-1" />
                        <span className="text-xs">Click to Watch</span>
                      </div>
                    )}

                    {/* Dark gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    {/* Video Format Badge */}
                    <div className="absolute top-3 left-3">
                      {isUpload ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                          <Film className="w-3 h-3" /> Direct Video
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                          <YoutubeIcon className="w-3.5 h-3.5" /> YouTube
                        </span>
                      )}
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono font-bold">
                        <Clock className="w-3 h-3 text-red-400" /> {v.duration}
                      </span>
                    </div>

                    {/* Big Center Play Button Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Subject & Unit Banner at bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs font-medium">
                        Unit {v.unit} • {v.subjectName}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <h3
                      onClick={() => setActiveVideo(v)}
                      className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-red-600 transition-colors"
                    >
                      {v.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>

                    {/* Tags */}
                    {v.tags && v.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {v.tags.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Section */}
                <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="text-[11px]">
                    <p className="font-bold text-slate-800 line-clamp-1">{v.channelName}</p>
                    <p className="text-slate-400 text-[10px]">{v.views}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(v.id, e)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-600 transition-colors"
                      title="Upvote lecture"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{v.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveVideo(v)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* IN-APP THEATER VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden max-h-[92vh]">
            {/* Player Frame Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  {activeVideo.videoType === 'upload' ? <Film className="w-4 h-4" /> : <YoutubeIcon className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    {activeVideo.videoType === 'upload' ? 'DIRECT VIDEO DEMO' : 'YOUTUBE LECTURE'}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {activeVideo.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(activeVideo.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{activeVideo.likes}</span>
                </button>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Screen (16:9 ratio) */}
            <div className="w-full bg-black aspect-video flex items-center justify-center overflow-hidden relative">
              {activeVideo.videoType === 'upload' ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
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

            {/* Player Info Box */}
            <div className="p-5 bg-white space-y-3 overflow-y-auto max-h-48">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{activeVideo.title}</h4>
                  <p className="text-xs text-slate-500">
                    Channel / Author: <strong className="text-slate-800">{activeVideo.channelName}</strong> • {activeVideo.subjectName} (Unit {activeVideo.unit})
                  </p>
                </div>

                <a
                  href={activeVideo.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                </a>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {activeVideo.description}
              </p>

              {activeVideo.tags && activeVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeVideo.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / SHARE VIDEO MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Share Study Video Lecture</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleShareVideo} className="space-y-4 text-xs">
              {/* Type Selection (YouTube vs Direct Upload) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Video Source</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadType('youtube')}
                    className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      uploadType === 'youtube'
                        ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <YoutubeIcon className="w-4 h-4 text-red-600" />
                    <span>YouTube Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadType('upload')}
                    className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      uploadType === 'upload'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Film className="w-4 h-4 text-emerald-600" />
                    <span>Upload MP4 / Demo</span>
                  </button>
                </div>
              </div>

              {/* YouTube Link Input or Video File Picker */}
              {uploadType === 'youtube' ? (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">YouTube Video URL *</label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  />
                  {youtubeUrl && extractYoutubeId(youtubeUrl) && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <img
                        src={`https://img.youtube.com/vi/${extractYoutubeId(youtubeUrl)}/hqdefault.jpg`}
                        alt="Preview"
                        className="w-16 h-10 object-cover rounded-lg"
                      />
                      <span className="text-[11px] text-emerald-600 font-bold">
                        ✓ Valid YouTube Lecture Found
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Upload MP4 / WebM Video File *
                  </label>
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer hover:bg-emerald-50/30 transition-all space-y-2 bg-slate-50/50"
                  >
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      onChange={handleVideoFileChange}
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      className="hidden"
                    />

                    {uploadedVideoFileName ? (
                      <div className="space-y-1">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                          <Film className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-emerald-700">{uploadedVideoFileName}</p>
                        <p className="text-[11px] text-slate-400">Ready to upload</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto" />
                        <p className="font-bold text-slate-700">Click to browse or drag video file</p>
                        <p className="text-[11px] text-slate-400">MP4, WebM, MOV up to 100MB</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Lecture Title *</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  required
                  placeholder="e.g. Complete AVL Tree 4 Rotations Solved with BEU Examples"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                />
              </div>

              {/* Subject & Unit */}
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
                      <option key={u} value={u}>Unit {u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Educator / Channel Name & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Educator / Channel</label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="e.g. Abdul Bari / Gate Smashers"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Approx. Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 28:45"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Description / Key Highlights</label>
                <textarea
                  rows={2}
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="Key concepts covered in this video lecture..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none font-medium"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. AVL Tree, Data Structures, BEU Exam, Numericals"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
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
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish & Earn +50 Pts</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
