import React, { useState } from 'react';
import { X, ExternalLink, Cpu, BarChart2, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';
import type { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'benchmarks'>('overview');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {project.category}
            </span>
            {project.created_date && (
              <span className="text-xs text-slate-400 font-mono">
                {project.created_date}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Project Title */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 leading-tight mb-2">
              {project.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Modal Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Technical Case Study', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'architecture', label: 'System Pipeline', icon: <Cpu className="w-3.5 h-3.5" /> },
              { id: 'benchmarks', label: 'Metrics & Results', icon: <BarChart2 className="w-3.5 h-3.5" /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === t.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & CASE STUDY */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Engineering Scope & Problem Statement
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {project.full_description || project.description}
                </p>
              </div>

              {/* Technologies Applied */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Applied Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM ARCHITECTURE PIPELINE */}
          {activeTab === 'architecture' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Architecture Diagram Image (if uploaded/provided) */}
              {project.architecture_image_url && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      System Architecture Diagram
                    </span>
                    <a
                      href={project.architecture_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-mono font-semibold"
                    >
                      <span>Full Resolution</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50/70 p-2.5 flex items-center justify-center">
                    <img
                      src={project.architecture_image_url}
                      alt={`${project.title} Architecture Pipeline`}
                      className="max-h-80 w-auto object-contain rounded-xl shadow-xs hover:scale-[1.01] transition-transform"
                    />
                  </div>
                </div>
              )}

              {/* End-to-End Pipeline Stages */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  End-to-End Execution Flow
                </h4>

                {project.architecture && project.architecture.length > 0 ? (
                  <div className="space-y-3">
                    {project.architecture.map((stage, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5"
                      >
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-mono font-bold text-slate-500 block mb-0.5">
                            Stage {idx + 1} Pipeline Block
                          </span>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed">
                            {stage}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !project.architecture_image_url ? (
                  <div className="p-6 text-center text-slate-400 font-mono text-xs bg-slate-50 rounded-2xl">
                    Architecture stages documented directly in repository source code.
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 3: BENCHMARKS & METRICS */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Visual Results / Benchmarks Image (if uploaded/provided) */}
              {project.results_image_url && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Visual Results & Output Verification
                    </span>
                    <a
                      href={project.results_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-mono font-semibold"
                    >
                      <span>Full Resolution</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50/70 p-2.5 flex items-center justify-center">
                    <img
                      src={project.results_image_url}
                      alt={`${project.title} Results Output`}
                      className="max-h-80 w-auto object-contain rounded-xl shadow-xs hover:scale-[1.01] transition-transform"
                    />
                  </div>
                </div>
              )}

              {/* Target Metrics Card */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Benchmark Verification & Quantitative Metrics
                </h4>

                {project.metrics ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase text-indigo-700 font-bold block mb-1">
                        Target Metric Achieved
                      </span>
                      <p className="text-base font-bold text-slate-900 mb-1">
                        {project.metrics}
                      </p>
                      <span className="text-xs text-slate-500 font-normal">
                        Verified against baseline architectures under consistent dataset test splits.
                      </span>
                    </div>
                  </div>
                ) : !project.results_image_url ? (
                  <div className="p-6 text-center text-slate-400 font-mono text-xs bg-slate-50 rounded-2xl">
                    Benchmark metrics listed in project documentation.
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors shadow-xs"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
