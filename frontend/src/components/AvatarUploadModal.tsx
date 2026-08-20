import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Camera, UploadCloud, X, Check, RefreshCw,
  Sparkles, Image as ImageIcon, Trash2, CheckCircle2,
  AlertCircle, Link as LinkIcon
} from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  { id: 'av-1', name: 'Tech Guy', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-2', name: 'Engineer Girl', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-3', name: 'Code Scholar', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-4', name: 'Innovator', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-5', name: 'Researcher', url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-6', name: 'Designer', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-7', name: '3D Boy Avatar', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aman&backgroundColor=b6e3f4' },
  { id: 'av-8', name: '3D Tech Avatar', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya&backgroundColor=c0aede' },
  { id: 'av-9', name: 'Cyber Hero', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&clothing=hoodie' },
];

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(currentUser?.avatar || '');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  // Process file upload & convert to base64 for instant client reactivity & persistence
  const handleFileProcess = (file: File) => {
    setErrorMsg('');
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 8MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    if (!previewUrl) return;
    setIsSaving(true);
    try {
      updateProfile({ avatar: previewUrl });
      showToast('Profile photo updated successfully!', 'success');
      onClose();
    } catch (err) {
      setErrorMsg('Failed to save profile picture.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`;
    setPreviewUrl(defaultAvatar);
    updateProfile({ avatar: defaultAvatar });
    showToast('Profile photo reset to default avatar.', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Update Profile Photo</h3>
              <p className="text-xs text-slate-500">Upload your photo or choose an avatar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Avatar Preview Circle */}
        <div className="flex flex-col items-center justify-center py-2 space-y-2">
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-emerald-500 shadow-xl bg-slate-100"
            />
            <div className="absolute inset-0 rounded-full border border-black/10 pointer-events-none" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Live Circular Preview</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Avatars</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'url' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Image URL</span>
          </button>
        </div>

        {/* Tab 1: File Upload Dropzone */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl cursor-pointer text-center transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">
                Click to browse or drag & drop photo here
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports JPG, PNG, WebP up to 8MB
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Preset Avatars */}
        {activeTab === 'presets' && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-500">Pick from curated student avatars:</p>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 scrollbar-thin">
              {PRESET_AVATARS.map(av => (
                <div
                  key={av.id}
                  onClick={() => setPreviewUrl(av.url)}
                  className={`p-2 rounded-2xl border cursor-pointer transition-all flex flex-col items-center gap-1 text-center group ${
                    previewUrl === av.url
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img src={av.url} alt={av.name} className="w-12 h-12 rounded-full object-cover" />
                  <span className="text-[10px] font-bold text-slate-700 truncate w-full">{av.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Custom URL */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Paste Direct Image Link</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/my-photo.jpg"
                  value={customUrlInput}
                  onChange={e => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      setPreviewUrl(customUrlInput.trim());
                    }
                  }}
                  className="px-3 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
