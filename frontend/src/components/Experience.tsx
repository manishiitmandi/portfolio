import React from 'react';
import { Calendar, MapPin, CheckCircle2, Building2 } from 'lucide-react';
import type { ExperienceItem } from '../types';

interface ExperienceProps {
  experience: ExperienceItem[];
}

export const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-mono font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>CAREER JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Work Experience & <span className="elegant-text-accent">Leadership</span>
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 space-y-12">
          {experience.map((item, idx) => (
            <div key={item.id || idx} className="relative pl-6 sm:pl-10 group">
              
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center group-hover:scale-110 transition-all shadow-md shadow-indigo-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              </div>

              {/* Experience Card */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900">
                        {item.role}
                      </h3>
                      {item.current && (
                        <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Current
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold mt-1">
                      <Building2 className="w-4 h-4" />
                      <span>{item.company}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end text-xs text-slate-500 font-mono gap-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-2.5 mb-6 text-sm text-slate-700 font-normal">
                  {item.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-mono font-medium mr-1">Stack:</span>
                  {item.tech_stack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
