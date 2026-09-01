import React, { useState } from 'react';
import {
  Flame,
  Bot,
  Sparkles,
  Terminal,
  Mic,
  Eye,
  Network,
  Zap,
  ShieldCheck,
  Database,
  Container,
  Cpu,
  Workflow,
  Code2,
  FileCode,
  Braces,
  GitBranch,
  Video,
  Layers,
  TerminalSquare,
  Wrench,
} from 'lucide-react';
import type { SkillCategory, SkillItem } from '../types';

interface SkillsProps {
  skills: SkillCategory[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Helper to render icon based on icon name string
  const renderSkillIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-orange-600" />;
      case 'Bot': return <Bot className="w-4 h-4 text-indigo-600" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'Terminal': return <Terminal className="w-4 h-4 text-slate-700" />;
      case 'Mic': return <Mic className="w-4 h-4 text-rose-600" />;
      case 'Eye': return <Eye className="w-4 h-4 text-emerald-600" />;
      case 'Network': return <Network className="w-4 h-4 text-purple-600" />;
      case 'Zap': return <Zap className="w-4 h-4 text-sky-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'Database': return <Database className="w-4 h-4 text-blue-600" />;
      case 'Container': return <Container className="w-4 h-4 text-sky-600" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-indigo-600" />;
      case 'Workflow': return <Workflow className="w-4 h-4 text-purple-600" />;
      case 'Code2': return <Code2 className="w-4 h-4 text-amber-600" />;
      case 'FileCode': return <FileCode className="w-4 h-4 text-blue-600" />;
      case 'Braces': return <Braces className="w-4 h-4 text-indigo-600" />;
      case 'GitBranch': return <GitBranch className="w-4 h-4 text-orange-600" />;
      case 'Video': return <Video className="w-4 h-4 text-rose-600" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-600" />;
      case 'TerminalSquare': return <TerminalSquare className="w-4 h-4 text-emerald-600" />;
      default: return <Wrench className="w-4 h-4 text-indigo-600" />;
    }
  };

  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>TECHNICAL EXPERTISE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Skills & <span className="elegant-text-accent">Specializations</span>
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mt-3">
            From low-latency FastAPI services and distributed pipelines to deep learning architectures.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {skills.map((category, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Active Category Display */}
        {skills[activeTab] && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl animate-in fade-in duration-300 bg-white/95">
            <div className="mb-6">
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-1">
                {skills[activeTab].category}
              </h3>
              {skills[activeTab].description && (
                <p className="text-xs sm:text-sm text-slate-500">
                  {skills[activeTab].description}
                </p>
              )}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills[activeTab].skills.map((skill: SkillItem, sIdx: number) => (
                <div
                  key={sIdx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform">
                        {renderSkillIcon(skill.icon)}
                      </div>
                      <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {skill.name}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-indigo-600 font-bold">
                      {skill.level}%
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
