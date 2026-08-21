import React, { useState } from 'react';

export const FileDropzone: React.FC<{ onFileSelect: (file: File) => void }> = ({ onFileSelect }) => {
  const [isDrag, setIsDrag] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
      onDragLeave={() => setIsDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDrag(false);
        if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
      }}
      className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
        isDrag ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
      }`}
    >
      <p className="text-xs text-slate-300 font-medium">Drag and drop syllabus notes or PYQ PDF here</p>
      <p className="text-[11px] text-slate-500 mt-1">Supports PDF, JPG, PNG up to 50MB</p>
    </div>
  );
};
