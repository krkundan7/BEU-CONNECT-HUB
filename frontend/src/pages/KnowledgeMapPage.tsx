import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { StorageService } from '../services/storageService';
import {
  GitGraph, BookOpen, Bot, Sparkles, ChevronRight,
  ArrowRight, FileSpreadsheet, CheckCircle2, Info, Layers
} from 'lucide-react';
import { KnowledgeNode } from '../types';

export const KnowledgeMapPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const nodes = StorageService.getKnowledgeNodes();

  const [activeSubject, setActiveSubject] = useState<'DBMS' | 'DSA'>('DBMS');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode>(nodes[0]);

  const filteredNodes = nodes.filter(n => n.subject === activeSubject);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-card space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <GitGraph className="w-4 h-4" />
          <span>Interactive Concept Graph</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          BEU Knowledge Map
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Explore visual concept trees for engineering subjects. Click on any topic to inspect prerequisites, key formulas, past BEU exam weightages, and instant AI summaries.
        </p>

        {/* Subject Filter */}
        <div className="flex gap-2 pt-2">
          {['DBMS', 'Data Structures'].map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub === 'DBMS' ? 'DBMS' : 'DSA')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                (activeSubject === 'DBMS' && sub === 'DBMS') || (activeSubject === 'DSA' && sub === 'Data Structures')
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-navy-800 text-slate-300 hover:text-white'
              }`}
            >
              {sub} Concept Tree
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Graph + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Node Hierarchy */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-beu-dark">Concept Tree: {activeSubject}</h3>
              <p className="text-xs text-beu-muted">Click any node to open formulas & AI analysis</p>
            </div>
            <span className="text-[11px] font-semibold bg-navy-50 text-navy-900 px-2.5 py-1 rounded-lg">
              {filteredNodes.length} Concept Nodes
            </span>
          </div>

          {/* Hierarchical Node Levels */}
          <div className="space-y-6">
            {/* Level 1: Root */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Level 1: Core Foundation</p>
              <div className="flex flex-wrap gap-3">
                {filteredNodes.filter(n => n.level === 1).map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border text-left transition-all max-w-sm ${
                      selectedNode.id === node.id
                        ? 'bg-navy-900 border-navy-900 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-beu-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold">{node.label}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        selectedNode.id === node.id ? 'bg-emerald-500 text-navy-950' : 'bg-red-50 text-red-700'
                      }`}>
                        🔴 {node.pyqWeight} Weight
                      </span>
                    </div>
                    <p className={`text-[11px] line-clamp-2 ${selectedNode.id === node.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {node.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tree Branch Connector */}
            <div className="flex items-center gap-2 pl-6 text-slate-300">
              <div className="w-0.5 h-6 bg-slate-300" />
              <span className="text-[10px] text-slate-400 font-mono">↓ Decomposes into</span>
            </div>

            {/* Level 2: Core Sub-domains */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Level 2: Major Modules</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredNodes.filter(n => n.level === 2).map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedNode.id === node.id
                        ? 'bg-navy-900 border-navy-900 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-beu-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold">{node.label}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        selectedNode.id === node.id ? 'bg-emerald-500 text-navy-950' : 'bg-red-50 text-red-700'
                      }`}>
                        Unit {node.unit}
                      </span>
                    </div>
                    <p className={`text-[11px] line-clamp-2 ${selectedNode.id === node.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {node.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tree Branch Connector */}
            <div className="flex items-center gap-2 pl-12 text-slate-300">
              <div className="w-0.5 h-6 bg-slate-300" />
              <span className="text-[10px] text-slate-400 font-mono">↓ Granular Forms (Normalization Tree)</span>
            </div>

            {/* Level 3: Granular Forms */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Level 3: Normal Forms & Rules</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {filteredNodes.filter(n => n.level === 3).map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedNode.id === node.id
                        ? 'bg-emerald-700 border-emerald-700 text-white shadow-md'
                        : 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50 text-emerald-950'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{node.label.split(' ')[0]}</p>
                    <p className={`text-[10px] truncate ${selectedNode.id === node.id ? 'text-emerald-100' : 'text-emerald-800'}`}>
                      {node.pyqWeight} Priority
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Node Details & AI Explanation */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Selected Topic
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              {selectedNode.pyqWeight} Exam Frequency
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-beu-dark">{selectedNode.label}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedNode.description}</p>
          </div>

          {/* Key Points */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-beu-dark flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Core Formulae & Conditions
            </p>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
              {selectedNode.keyPoints.map((pt, idx) => (
                <li key={idx} className="leading-snug">{pt}</li>
              ))}
            </ul>
          </div>

          {/* AI Concept Summary */}
          <div className="p-4 rounded-2xl bg-navy-50/60 border border-navy-100 space-y-2 text-xs">
            <p className="font-bold text-navy-900 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-600" />
              BEU AI Concept Insight
            </p>
            <p className="text-slate-700 leading-relaxed">{selectedNode.aiSummary}</p>
          </div>

          <button
            onClick={() => navigateTo('ai-assistant')}
            className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Ask BEU AI for Deep Explanation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
