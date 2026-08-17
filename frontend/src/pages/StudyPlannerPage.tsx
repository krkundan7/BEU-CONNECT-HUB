import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { useNotification } from '../context/NotificationContext';
import {
  Calendar, CheckCircle2, Clock, Sparkles, Plus,
  Trash2, BookOpen, AlertCircle, TrendingUp, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyPlanTask } from '../types';

export const StudyPlannerPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [tasks, setTasks] = useState(currentUser ? StorageService.getStudyTasks(currentUser.id) : []);
  const [examDate, setExamDate] = useState('2025-09-18');
  const [dailyHours, setDailyHours] = useState(4);
  const [prepLevel, setPrepLevel] = useState<'beginner' | 'intermediate' | 'revision'>('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);

  // New Custom Task Form State
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Data Structures & Algorithms');
  const [newTaskMinutes, setNewTaskMinutes] = useState(45);
  const [newTaskType, setNewTaskType] = useState<StudyPlanTask['taskType']>('topic');

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleToggleTask = (taskId: string) => {
    const updated = StorageService.toggleStudyTask(taskId);
    setTasks(updated.filter(t => t.userId === currentUser?.id));

    const toggled = updated.find(t => t.id === taskId);
    if (toggled?.completed) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
      showToast('Task completed! Great progress! 🎉', 'success');
    }
  };

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedTasks: StudyPlanTask[] = [
        {
          id: `task-gen-${Date.now()}-1`,
          userId: currentUser?.id || 'usr-aman-101',
          dayNumber: 1,
          title: 'Master AVL Tree Rotations (LL, RR, LR, RL)',
          subjectName: 'Data Structures & Algorithms',
          durationMinutes: 60,
          taskType: 'topic',
          completed: false,
          date: 'Day 1'
        },
        {
          id: `task-gen-${Date.now()}-2`,
          userId: currentUser?.id || 'usr-aman-101',
          dayNumber: 1,
          title: 'Solve 2024 End-Sem AVL 14-Mark Question',
          subjectName: 'Data Structures & Algorithms',
          durationMinutes: 45,
          taskType: 'pyq',
          completed: false,
          date: 'Day 1'
        },
        {
          id: `task-gen-${Date.now()}-3`,
          userId: currentUser?.id || 'usr-aman-101',
          dayNumber: 2,
          title: 'Relational Model & ER Schema Mapping',
          subjectName: 'Database Management Systems',
          durationMinutes: 50,
          taskType: 'topic',
          completed: false,
          date: 'Day 2'
        },
        {
          id: `task-gen-${Date.now()}-4`,
          userId: currentUser?.id || 'usr-aman-101',
          dayNumber: 2,
          title: 'BCNF vs 3NF Candidate Key Proofs',
          subjectName: 'Database Management Systems',
          durationMinutes: 40,
          taskType: 'topic',
          completed: false,
          date: 'Day 2'
        },
        {
          id: `task-gen-${Date.now()}-5`,
          userId: currentUser?.id || 'usr-aman-101',
          dayNumber: 3,
          title: "Kruskal's MST Algorithm & DSU Disjoint Set",
          subjectName: 'Data Structures & Algorithms',
          durationMinutes: 50,
          taskType: 'practice',
          completed: false,
          date: 'Day 3'
        }
      ];

      StorageService.addStudyTasks(generatedTasks);
      setTasks(generatedTasks);
      setIsGenerating(false);
      showToast('Personalized AI study plan generated!', 'success');
    }, 800);
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newTaskTitle) return;

    const newTask: StudyPlanTask = {
      id: `task-${Date.now()}`,
      userId: currentUser.id,
      dayNumber: 1,
      title: newTaskTitle,
      subjectName: newTaskSubject,
      durationMinutes: Number(newTaskMinutes),
      taskType: newTaskType,
      completed: false,
      date: 'Custom Task'
    };

    StorageService.addStudyTasks([newTask]);
    setTasks(prev => [newTask, ...prev]);
    setShowAddTask(false);
    setNewTaskTitle('');
    showToast('Custom study task added!', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Smart Academic Timetable</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Personal Study Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Create structured day-by-day revision schedules calibrated around BEU examination dates, subject credits, and high-frequency PYQ weightages.
        </p>
      </div>

      {/* Plan Generator & Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Generator Form */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
          <h3 className="text-base font-bold text-beu-dark flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            AI Plan Generator
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-beu-dark mb-1">Target Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-beu-dark mb-1">Daily Available Study Hours: {dailyHours} hrs</label>
              <input
                type="range"
                min={2}
                max={8}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full accent-navy-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-beu-dark mb-1">Preparation Stage</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['beginner', 'intermediate', 'revision'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPrepLevel(lvl)}
                    className={`py-2 rounded-xl font-bold capitalize transition-colors text-[11px] ${
                      prepLevel === lvl
                        ? 'bg-navy-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isGenerating ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Custom Plan</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Card */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-beu-dark">Plan Completion</span>
              <span className="font-extrabold text-emerald-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-[11px] text-beu-muted text-center">
              {completedCount} of {tasks.length} tasks completed
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Tasks Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-beu-dark">Active Revision Checklist</h3>
                <p className="text-xs text-beu-muted">Tick off tasks as you complete topics and PYQs</p>
              </div>

              <button
                onClick={() => setShowAddTask(true)}
                className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="py-12 text-center text-beu-muted">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-beu-dark">No tasks in your schedule yet</p>
                <p className="text-xs mt-1">Click "Generate Custom Plan" to create your tailored revision schedule.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      task.completed
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-6 h-6 rounded-xl flex items-center justify-center border transition-colors ${
                        task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-xs sm:text-sm font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-beu-dark'}`}>
                            {task.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-beu-muted">
                          {task.subjectName} • <Clock className="w-3 h-3 inline mb-0.5" /> {task.durationMinutes} mins • {task.date}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg capitalize whitespace-nowrap ml-2 ${
                      task.taskType === 'pyq'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : task.taskType === 'practice'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {task.taskType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-beu-dark">Add Custom Study Task</h3>

            <form onSubmit={handleAddNewTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-beu-dark mb-1">Task Title / Concept</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  placeholder="e.g. Practice 5 Infix to Postfix conversions"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-beu-dark mb-1">Subject</label>
                <input
                  type="text"
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Estimated Minutes</label>
                  <input
                    type="number"
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-beu-dark mb-1">Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                  >
                    <option value="topic">Topic Study</option>
                    <option value="pyq">PYQ Drill</option>
                    <option value="practice">Practice / Code</option>
                    <option value="revision">Quick Revision</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
