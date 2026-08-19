import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import {
  Radio, Plus, Heart, MessageSquare, Bookmark, Share2,
  AlertTriangle, CheckCircle2, Image as ImageIcon, Video, Send,
  Sparkles, Filter, X, Play, UploadCloud, Link as LinkIcon,
  Maximize2, Tag, Eye, Smile, FileText, Check
} from 'lucide-react';
import { Post } from '../types';

export const SocialFeedPage: React.FC = () => {
  const { currentUser, toggleSavePost } = useAuth();
  const { navigateTo, openReportModal } = useNavigation();
  const { showToast } = useNotification();

  const [posts, setPosts] = useState<Post[]>(StorageService.getPosts());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  
  // Lightbox modal state for viewing media in full screen
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; type: 'image' | 'video'; title: string } | null>(null);

  // Create Post Form State
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<Post['category']>('general');
  const [mediaMode, setMediaMode] = useState<'upload' | 'url' | 'none'>('none');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [mediaDirectUrl, setMediaDirectUrl] = useState<string>('');
  const [postTags, setPostTags] = useState('#BEU #CampusLife');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPosts = posts.filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  const handleLike = (postId: string) => {
    if (!currentUser) {
      showToast('Please login to like posts', 'info');
      return;
    }
    const updated = StorageService.toggleLikePost(postId, currentUser.id);
    setPosts(updated);
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!currentUser) {
      showToast('Please login to comment', 'info');
      return;
    }
    if (!text) return;

    const updated = StorageService.addComment(postId, {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userCollege: currentUser.college,
      content: text
    });

    setPosts(updated);
    setCommentText(prev => ({ ...prev, [postId]: '' }));
    showToast('Comment posted', 'success');
  };

  // Handle local file selection for image/video
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 25MB for video, 10MB for image
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isImage && !isVideo) {
      showToast('Please select a valid image (PNG, JPG, WebP) or video (MP4, WebM)', 'error');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      showToast('File size must be under 25MB', 'error');
      return;
    }

    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMediaPreviewUrl(reader.result);
        setMediaMode('upload');
        showToast(`${isVideo ? 'Video' : 'Image'} attached successfully!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrlMedia = () => {
    if (!mediaDirectUrl.trim()) return;
    const url = mediaDirectUrl.trim();
    // Auto detect video url extensions
    const isVideoExt = url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.includes('youtube.com') || url.includes('youtu.be');
    setMediaType(isVideoExt ? 'video' : mediaType);
    setMediaPreviewUrl(url);
    showToast('Media URL linked successfully!', 'success');
  };

  const handleRemoveMedia = () => {
    setMediaPreviewUrl('');
    setMediaDirectUrl('');
    setMediaMode('none');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please login to publish posts', 'error');
      return;
    }
    if (!postContent.trim() && !mediaPreviewUrl) {
      showToast('Please enter text content or attach media to post', 'error');
      return;
    }

    const tagsArray = postTags
      .split(' ')
      .filter(t => t.startsWith('#'))
      .map(t => t.trim());

    const finalMediaUrl = mediaPreviewUrl || mediaDirectUrl || undefined;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userCollege: currentUser.college,
      userBranch: currentUser.branchCode,
      userSemester: currentUser.semester,
      isVerified: currentUser.verificationStatus === 'verified',
      content: postContent,
      category: postCategory,
      mediaUrl: finalMediaUrl,
      mediaType: finalMediaUrl ? mediaType : undefined,
      likes: [currentUser.id],
      comments: [],
      saves: [],
      tags: tagsArray.length > 0 ? tagsArray : ['#BEU', '#CampusLife'],
      createdAt: 'Just now'
    };

    StorageService.addPost(newPost);
    setPosts(StorageService.getPosts());
    setShowCreateModal(false);
    
    // Reset Form
    setPostContent('');
    handleRemoveMedia();
    setPostCategory('general');
    showToast('🎉 Post with media published to BEU Campus Feed! +25 Points', 'success');
  };

  const categories = [
    { id: 'all', label: '🌟 All Updates' },
    { id: 'educational', label: '📚 Study Tips & Notes' },
    { id: 'achievement', label: '🏆 Achievements & SIH' },
    { id: 'project', label: '🚀 Project Collaboration' },
    { id: 'general', label: '💬 Campus Life' }
  ];

  const suggestedTags = [
    '#SIH2025', '#BEUConnect', '#Hackathon', '#MITMuzaffarpur', '#BCEBhagalpur',
    '#DSAPrep', '#ProjectPartner', '#CampusLife', '#BEUNotes'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header & Post Creator Trigger */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-indigo-950 text-white shadow-card space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-navy-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            <span>BEU Campus Multimedia Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Campus Social Network</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Share study notes, project video demos, hackathon milestones, and student life across Bihar Engineering University.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Quick Interactive Inline Post Trigger Box */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User"
            className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 text-xs font-semibold transition-all border border-slate-200/60"
          >
            Share an update, project video demo, or academic note...
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => {
                setMediaType('image');
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-700 font-bold transition-all"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Photo / Image</span>
            </button>

            <button
              onClick={() => {
                setMediaType('video');
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50 text-red-700 font-bold transition-all"
            >
              <Video className="w-4 h-4 text-red-600" />
              <span>Video Demo</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs"
          >
            Post Update
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map(post => {
          const hasLiked = currentUser ? post.likes.includes(currentUser.id) : false;
          const isSaved = currentUser ? currentUser.savedPostIds.includes(post.id) : false;
          const isExpanded = expandedPostId === post.id;
          const isVideo = post.mediaType === 'video' || (post.mediaUrl && (post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.webm') || post.mediaUrl.includes('youtube')));

          return (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-4 transition-all hover:shadow-md"
            >
              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div
                  onClick={() => navigateTo('profile', { userId: post.userId })}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-navy-900">{post.userName}</h3>
                      {post.isVerified && (
                        <span title="Verified BEU Student">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {post.userCollege} • {post.userBranch} Sem {post.userSemester}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">{post.createdAt}</span>
                  <button
                    onClick={() => openReportModal('post', post.id, `Post by ${post.userName}`)}
                    className="p-1 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                    title="Report post"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                {post.content}
              </p>

              {/* Media Attachment (IMAGE / VIDEO) */}
              {post.mediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 relative group">
                  {isVideo ? (
                    <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                      <video
                        src={post.mediaUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full max-h-[420px] object-contain rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div className="relative max-h-[440px] overflow-hidden flex items-center justify-center bg-slate-900">
                      <img
                        src={post.mediaUrl}
                        alt="Post Attachment"
                        className="w-full h-full object-cover max-h-[440px] transition-transform duration-300 group-hover:scale-101 cursor-pointer"
                        onClick={() => setLightboxMedia({ url: post.mediaUrl!, type: 'image', title: `Post by ${post.userName}` })}
                      />
                      <button
                        onClick={() => setLightboxMedia({ url: post.mediaUrl!, type: 'image', title: `Post by ${post.userName}` })}
                        className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(t => (
                  <span key={t} className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100/60">
                    {t}
                  </span>
                ))}
              </div>

              {/* Actions Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                      hasLiked
                        ? 'bg-red-50 text-red-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{post.likes.length} Likes</span>
                  </button>

                  <button
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSavePost(post.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      isSaved ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Save Post"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Post link copied to clipboard!', 'success');
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Share Post"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments Accordion */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-400 py-2">No comments yet. Be the first to reply!</p>
                    ) : (
                      post.comments.map(c => (
                        <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl flex items-start gap-2.5 text-xs">
                          <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{c.userName}</span>
                              <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                            </div>
                            <p className="text-slate-700 mt-0.5 leading-relaxed">{c.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Bar */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                      placeholder="Write a constructive academic reply..."
                      className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl transition-colors flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
            <Radio className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No posts in this category yet</p>
            <p className="text-xs text-slate-400">Be the first student to publish an update or project demo!</p>
          </div>
        )}
      </div>

      {/* CREATE POST MODAL (WITH FULL IMAGE & VIDEO SUPPORT) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-navy-950">Create Campus Update</h3>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  handleRemoveMedia();
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              {/* Category Select */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Category</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-semibold text-slate-800"
                >
                  <option value="general">💬 Campus Life / General Update</option>
                  <option value="educational">📚 Educational / Study Notes / PYQ Tips</option>
                  <option value="achievement">🏆 Achievement & Hackathon Win (SIH)</option>
                  <option value="project">🚀 Project Teammate Request / Code Demo</option>
                </select>
              </div>

              {/* Content Textarea */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">What do you want to share?</label>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share notes, hackathon updates, project code milestones, or questions for BEU peers..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-xs sm:text-sm text-slate-800 font-normal leading-relaxed"
                />
              </div>

              {/* MEDIA ATTACHMENT SECTION (IMAGE & VIDEO) */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Attach Media (Image / Video)</span>
                  <span className="text-[11px] text-slate-400 font-medium">Supports JPG, PNG, WebP, MP4, WebM (up to 25MB)</span>
                </div>

                {/* Media Type & Mode Selection Pills */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="p-3 rounded-2xl border border-dashed border-slate-300 hover:border-red-500 hover:bg-red-50/20 flex items-center justify-center gap-2 font-bold text-slate-700 transition-all"
                  >
                    <UploadCloud className="w-4 h-4 text-red-600" />
                    <span>Upload from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaMode(mediaMode === 'url' ? 'none' : 'url')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      mediaMode === 'url'
                        ? 'border-navy-950 bg-navy-950 text-white'
                        : 'border-slate-300 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Attach via Link</span>
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/mp4,video/webm,video/ogg"
                  className="hidden"
                />

                {/* URL Input Form if URL mode selected */}
                {mediaMode === 'url' && (
                  <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex gap-2">
                      <select
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value as any)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        <option value="image">Image (JPG/PNG)</option>
                        <option value="video">Video (MP4/WebM)</option>
                      </select>
                      <input
                        type="url"
                        value={mediaDirectUrl}
                        onChange={(e) => setMediaDirectUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or https://.../demo.mp4"
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrlMedia}
                        className="px-3 py-1.5 bg-navy-900 text-white rounded-xl font-bold"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                {/* LIVE MEDIA PREVIEW CARD */}
                {mediaPreviewUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 mt-2 max-h-56 flex items-center justify-center">
                    {mediaType === 'video' ? (
                      <video
                        src={mediaPreviewUrl}
                        controls
                        className="max-h-56 w-full object-contain"
                      />
                    ) : (
                      <img
                        src={mediaPreviewUrl}
                        alt="Preview"
                        className="max-h-56 w-full object-contain"
                      />
                    )}

                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold uppercase backdrop-blur-xs flex items-center gap-1">
                      {mediaType === 'video' ? <Video className="w-3 h-3 text-red-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                      <span>{mediaType} Attached</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-500 transition-colors"
                      title="Remove Attachment"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Hashtags input and suggestions */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-bold text-slate-700">Hashtags</label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="#SIH2025 #BEUConnect #MITMuzaffarpur"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-mono text-xs"
                />

                <div className="flex flex-wrap gap-1 pt-1">
                  {suggestedTags.map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        if (!postTags.includes(tag)) {
                          setPostTags(prev => (prev ? `${prev} ${tag}` : tag));
                        }
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    handleRemoveMedia();
                  }}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black max-h-[85vh] w-full flex items-center justify-center">
              {lightboxMedia.type === 'video' ? (
                <video src={lightboxMedia.url} controls autoPlay className="max-h-[80vh] w-full object-contain" />
              ) : (
                <img src={lightboxMedia.url} alt={lightboxMedia.title} className="max-h-[80vh] w-full object-contain" />
              )}
            </div>
            <p className="text-white text-xs font-semibold mt-2 text-center">{lightboxMedia.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};
