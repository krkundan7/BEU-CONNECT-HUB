import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import {
  Radio, Plus, Heart, MessageSquare, Bookmark, Share2,
  AlertTriangle, CheckCircle2, Image as ImageIcon, Send, Sparkles, Filter
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

  // Create Post Form
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<Post['category']>('general');
  const [postMediaUrl, setPostMediaUrl] = useState('');
  const [postTags, setPostTags] = useState('#BEU #Engineering');

  const filteredPosts = posts.filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  const handleLike = (postId: string) => {
    if (!currentUser) return;
    const updated = StorageService.toggleLikePost(postId, currentUser.id);
    setPosts(updated);
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!currentUser || !text) return;

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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !postContent.trim()) return;

    const tagsArray = postTags
      .split(' ')
      .filter(t => t.startsWith('#'))
      .map(t => t.trim());

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
      mediaUrl: postMediaUrl || undefined,
      mediaType: postMediaUrl ? 'image' : undefined,
      likes: [currentUser.id],
      comments: [],
      saves: [],
      tags: tagsArray.length > 0 ? tagsArray : ['#BEU', '#CampusLife'],
      createdAt: 'Just now'
    };

    StorageService.addPost(newPost);
    setPosts(StorageService.getPosts());
    setShowCreateModal(false);
    setPostContent('');
    setPostMediaUrl('');
    showToast('Post shared with the BEU campus feed! +20 Points', 'success');
  };

  const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'educational', label: '📚 Study Tips & Notes' },
    { id: 'achievement', label: '🏆 Achievements' },
    { id: 'project', label: '🚀 Project Updates' },
    { id: 'general', label: '💬 Campus Life' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header & Post Creator Trigger */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            <span>BEU Campus Network</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Campus Social Feed</h1>
          <p className="text-xs text-slate-300">
            Connect with peers, share academic achievements, find project teammates, and celebrate student life.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
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

          return (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-4 transition-all"
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
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-beu-dark group-hover:text-navy-900">{post.userName}</h3>
                      {post.isVerified && (
                        <span title="Verified BEU Student">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-beu-muted">
                      {post.userCollege} • {post.userBranch} Sem {post.userSemester}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{post.createdAt}</span>
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
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {post.content}
              </p>

              {/* Media Attachment if present */}
              {post.mediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96">
                  <img
                    src={post.mediaUrl}
                    alt="Post Attachment"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(t => (
                  <span key={t} className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>

              {/* Actions Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
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
                    onClick={() => showToast('Post link copied to clipboard!', 'info')}
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
                              <span className="font-bold text-beu-dark">{c.userName}</span>
                              <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                            </div>
                            <p className="text-slate-600 mt-0.5">{c.content}</p>
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
                      placeholder="Write a constructive academic comment..."
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-beu-dark">Create Campus Update</h3>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-beu-dark mb-1">Post Category</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                >
                  <option value="general">Campus Life / General</option>
                  <option value="educational">Educational / Notes / Tips</option>
                  <option value="achievement">Achievement & Hackathon Win</option>
                  <option value="project">Project Teammate Request</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Post Content</label>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                  placeholder="Share notes, SIH milestones, project queries, or academic tips..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Media Image URL (Optional)</label>
                <input
                  type="url"
                  value={postMediaUrl}
                  onChange={(e) => setPostMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Hashtags</label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="#SIH2025 #MITMuzaffarpur #DSA"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Publish Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
