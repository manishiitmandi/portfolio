import React from 'react';
import { X, ExternalLink, Cpu, BarChart2 } from 'lucide-react';
import { GithubIcon } from './Icons';
import type { ProjectItem } from '../types';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Date */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {project.category}
          </span>
          {project.created_date && (
            <span className="text-xs text-slate-500 font-mono">
              {project.created_date}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mb-4 pr-8">
          {project.title}
        </h3>

        {/* Highlight Metric Banner if available */}
        {project.metrics && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-indigo-600 font-bold block">
                Key Performance Metric
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {project.metrics}
              </span>
            </div>
          </div>
        )}

        {/* Full Detailed Description */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
            Overview & Research Scope
          </h4>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {project.full_description || project.description}
          </p>
        </div>

        {/* Architecture & Workflow Breakdown */}
        {project.architecture && project.architecture.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Architecture & Engineering Stages</span>
            </h4>
            <div className="space-y-2.5">
              {project.architecture.map((arch, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700"
                >
                  <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{arch}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Pills */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
            Technologies & Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-semibold border border-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions (GitHub / Demo) */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold border border-slate-300 transition-all shadow-sm"
            >
              <GithubIcon className="w-4 h-4 text-slate-700" />
              <span>View Source Code</span>
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Application</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold border border-slate-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
