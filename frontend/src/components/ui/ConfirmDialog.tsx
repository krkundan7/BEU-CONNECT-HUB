import React from 'react';
import { ModalWrapper } from './ModalWrapper';

interface ConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-sm text-slate-300 mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-rose-600 text-xs text-white hover:bg-rose-500 font-semibold">Confirm</button>
      </div>
    </ModalWrapper>
  );
};
