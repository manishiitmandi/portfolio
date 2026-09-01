import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight, BarChart2, Cpu } from 'lucide-react';
import { GithubIcon } from './Icons';
import type { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';

interface ProjectsProps {
  projects: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'AI / Medical', 'Computer Vision', 'Geospatial', 'Generative AI'];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    const cat = p.category.toLowerCase();
    const query = selectedCategory.toLowerCase();
    return cat.includes(query) || p.tags.some((t) => t.toLowerCase().includes(query));
  });

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>FEATURED WORK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Research & <span className="elegant-text-accent">Engineered Projects</span>
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mt-3">
            Specialized deep learning architectures, multimodal AI pipelines, and high-performance backend microservices.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Row: Category & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {project.category}
                  </span>
                  {project.created_date && (
                    <span className="text-xs text-slate-400 font-mono">
                      {project.created_date}
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>

                {/* Performance Metric Badge */}
                {project.metrics && (
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-indigo-700 font-mono font-semibold">
                    <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{project.metrics}</span>
                  </div>
                )}

                {/* Short Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                  {project.description}
                </p>
              </div>

              {/* Bottom: Tags & Action Links */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.slice(0, 5).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 5 && (
                    <span className="px-2 py-1 text-[11px] font-mono rounded-lg bg-slate-100 text-slate-500">
                      +{project.tags.length - 5}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 group/btn transition-colors"
                  >
                    <span>View Architecture & Scope</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-sm"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all shadow-sm"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
