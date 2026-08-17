import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useNotification } from '../../context/NotificationContext';
import { StorageService } from '../../services/storageService';
import {
  UserCheck, ArrowLeft, Check, X, ShieldAlert,
  GraduationCap, CheckCircle2, Clock
} from 'lucide-react';
import { User } from '../../types';

export const UserVerificationPage: React.FC = () => {
  const { allUsers, refreshUsers } = useAuth();
  const { navigateTo } = useNavigation();
  const { showToast } = useNotification();

  const [users, setUsers] = useState<User[]>(StorageService.getUsers());

  const pendingStudents = users.filter(u => u.verificationStatus === 'pending');
  const verifiedStudents = users.filter(u => u.verificationStatus === 'verified');

  const handleApprove = (userId: string, userName: string) => {
    StorageService.verifyUser(userId, 'verified');
    const updated = StorageService.getUsers();
    setUsers(updated);
    refreshUsers();
    showToast(`Approved verification for ${userName}! Badge assigned.`, 'success');
  };

  const handleReject = (userId: string, userName: string) => {
    StorageService.verifyUser(userId, 'unverified');
    const updated = StorageService.getUsers();
    setUsers(updated);
    refreshUsers();
    showToast(`Verification rejected for ${userName}.`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('admin-dashboard')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-beu-dark">Student Verification Queue</h1>
          <p className="text-xs text-beu-muted">Verify BEU students against college registration numbers</p>
        </div>
      </div>

      {/* Pending Students Section */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-beu-dark">Pending Verification Requests ({pendingStudents.length})</h3>
          <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full">
            Action Required
          </span>
        </div>

        {pendingStudents.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No pending verification requests at this time.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingStudents.map(student => (
              <div
                key={student.id}
                className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={student.avatar} alt={student.name} className="w-11 h-11 rounded-2xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-beu-dark">{student.name}</h4>
                    <p className="text-xs text-slate-600">{student.college} • {student.branchCode} Sem {student.semester}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">BEU Reg No: {student.beuRegNo || '23103108031'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleReject(student.id, student.name)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-red-50 hover:text-red-700 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(student.id, student.name)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Verify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Students Showcase */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
        <h3 className="text-base font-bold text-beu-dark">Recently Verified BEU Students ({verifiedStudents.length})</h3>
        <div className="divide-y divide-slate-100">
          {verifiedStudents.map(student => (
            <div key={student.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-beu-dark">{student.name}</p>
                  <p className="text-slate-500">{student.college} • {student.branchCode}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
