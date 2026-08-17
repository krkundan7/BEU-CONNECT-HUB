import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import {
  Handshake, Plus, Users, Search, CheckCircle2,
  Sparkles, Check, Clock, FileCode, Briefcase, ChevronRight
} from 'lucide-react';
import { Project } from '../types';

export const ProjectPartnerPage: React.FC = () => {
  const { currentUser, allUsers } = useAuth();
  const { showToast } = useNotification();

  const [projects, setProjects] = useState<Project[]>(StorageService.getProjects());
  const [activeTab, setActiveTab] = useState<'finder' | 'workspaces'>('finder');
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  // Finder Query State
  const [reqSkills, setReqSkills] = useState(['Python', 'React', 'FastAPI']);
  const [skillInput, setSkillInput] = useState('');
  const [showCreateProjModal, setShowCreateProjModal] = useState(false);

  // New Project Form
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('AI / Web Development');
  const [projDesc, setProjDesc] = useState('');
  const [projTeamSize, setProjTeamSize] = useState(4);

  // Match students based on required skills
  const matchedStudents = allUsers.filter(u =>
    u.id !== currentUser?.id && u.skills.some(s => reqSkills.some(rs => rs.toLowerCase() === s.toLowerCase()))
  );

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!reqSkills.includes(skillInput.trim())) {
        setReqSkills([...reqSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setReqSkills(reqSkills.filter(s => s !== skill));
  };

  const handleInvite = (studentName: string) => {
    showToast(`Invitation sent to ${studentName}! They will receive an alert.`, 'success');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !projTitle) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      creatorCollege: currentUser.college,
      title: projTitle,
      category: projCategory,
      description: projDesc,
      requiredSkills: reqSkills,
      teamSize: Number(projTeamSize),
      members: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          role: 'Team Lead',
          avatar: currentUser.avatar
        }
      ],
      status: 'recruiting',
      tasks: [
        { id: `t-${Date.now()}-1`, title: 'Define project architecture & API schema', status: 'todo' },
        { id: `t-${Date.now()}-2`, title: 'Setup GitHub repository & CI pipeline', status: 'done' }
      ],
      createdAt: 'Just now'
    };

    StorageService.createProject(newProj);
    const updated = StorageService.getProjects();
    setProjects(updated);
    setSelectedProject(newProj);
    setShowCreateProjModal(false);
    showToast('Project created & recruiting is live!', 'success');
  };

  const handleToggleTaskStatus = (taskId: string, currentStatus: 'todo' | 'in_progress' | 'done') => {
    const nextStatus = currentStatus === 'todo' ? 'in_progress' : currentStatus === 'in_progress' ? 'done' : 'todo';
    StorageService.updateProjectTask(selectedProject.id, taskId, nextStatus);
    const updated = StorageService.getProjects();
    setProjects(updated);
    const curr = updated.find(p => p.id === selectedProject.id);
    if (curr) setSelectedProject(curr);
    showToast('Task status updated', 'info');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Handshake className="w-4 h-4" />
            <span>Hackathon & Capstone Teammate Matchmaker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Find Your Project Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Match with talented peers across all 38+ Bihar Engineering University colleges based on complementary tech stacks (AI, React, IoT, Flutter, Embedded).
          </p>
        </div>

        <button
          onClick={() => setShowCreateProjModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Project</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('finder')}
          className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'finder' ? 'border-navy-900 text-navy-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Skill-Based Matchmaker</span>
        </button>
        <button
          onClick={() => setActiveTab('workspaces')}
          className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'workspaces' ? 'border-navy-900 text-navy-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Project Workspaces & Tasks ({projects.length})</span>
        </button>
      </div>

      {/* TAB 1: SKILL-BASED MATCHMAKER */}
      {activeTab === 'finder' && (
        <div className="space-y-6">
          {/* Skill Filters Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-beu-dark flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Specify Desired Teammate Skill Stack
            </h3>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {reqSkills.map(skill => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-50 text-navy-900 border border-navy-200 text-xs font-bold"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type skill (e.g. PyTorch, TypeScript, IoT, Figma) and press Enter..."
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (skillInput.trim() && !reqSkills.includes(skillInput.trim())) {
                      setReqSkills([...reqSkills, skillInput.trim()]);
                      setSkillInput('');
                    }
                  }}
                  className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Matched Students Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-beu-dark">
              Recommended BEU Students with Matching Skills ({matchedStudents.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedStudents.map(student => {
                const matchedCount = student.skills.filter(s => reqSkills.some(rs => rs.toLowerCase() === s.toLowerCase())).length;
                return (
                  <div
                    key={student.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-beu-dark">{student.name}</h4>
                            {student.verificationStatus === 'verified' && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-[11px] text-beu-muted line-clamp-1">{student.college}</p>
                          <p className="text-[10px] text-slate-400">{student.branchCode} • Sem {student.semester}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matching Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {student.skills.map(sk => {
                            const isMatch = reqSkills.some(rs => rs.toLowerCase() === sk.toLowerCase());
                            return (
                              <span
                                key={sk}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  isMatch ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {sk}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInvite(student.name)}
                      className="w-full py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Handshake className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Invite to Project</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT WORKSPACES & TASKS */}
      {activeTab === 'workspaces' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Projects list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Campus Projects</h3>
            {projects.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedProject.id === p.id
                    ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-beu-dark'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedProject.id === p.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {p.category}
                  </span>
                  <span className="text-[10px] opacity-80">{p.members.length}/{p.teamSize} Members</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold truncate">{p.title}</h4>
              </div>
            ))}
          </div>

          {/* Right 2 Cols: Workspace Detail & Task Board */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedProject.status.toUpperCase()}
                </span>
                <h2 className="text-lg font-bold text-beu-dark mt-1">{selectedProject.title}</h2>
                <p className="text-xs text-beu-muted">{selectedProject.creatorCollege} • Team Lead: {selectedProject.creatorName}</p>
              </div>

              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{selectedProject.description}</p>

            {/* Team Members */}
            <div>
              <h4 className="text-xs font-bold text-beu-dark mb-2">Team Members ({selectedProject.members.length}/{selectedProject.teamSize})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.members.map(m => (
                  <div key={m.userId} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-beu-dark leading-none">{m.name}</p>
                      <p className="text-[10px] text-slate-400">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Management Board */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-beu-dark">Project Task Roadmap</h4>
              <div className="space-y-2">
                {selectedProject.tasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTaskStatus(t.id, t.status)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        t.status === 'done' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {t.status === 'done' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={t.status === 'done' ? 'line-through text-slate-400' : 'font-semibold text-beu-dark'}>
                        {t.title}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      t.status === 'done' ? 'bg-emerald-100 text-emerald-800' : t.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-beu-dark">Post Hackathon / Capstone Project</h3>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-beu-dark mb-1">Project Title</label>
                <input
                  type="text"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  required
                  placeholder="e.g. AI-Powered Smart Traffic Management for Patna"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Category</label>
                  <input
                    type="text"
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Target Team Size</label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={projTeamSize}
                    onChange={(e) => setProjTeamSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Description & Requirements</label>
                <textarea
                  rows={3}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  required
                  placeholder="Describe problem statement and which team roles are needed..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateProjModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Post Project & Recruit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
