import React from 'react';
import { Bot, Cpu, Database, Eye, GraduationCap, Sparkles, Zap, Award } from 'lucide-react';
import type { Profile } from '../types';

interface AboutProps {
  profile: Profile | null;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const bio =
    profile?.bio ||
    'Electrical Engineering undergraduate at IIT Mandi with industry experience in Generative AI, LLM multi-agent systems, speech/lip-sync data pipelines, and medical image segmentation.';

  const coreFocus = [
    {
      icon: <Bot className="w-5 h-5 text-indigo-600" />,
      title: 'Generative AI & Agentic Systems',
      desc: 'LangChain agent workflows, context-aware prompt engineering, Whisper ASR speech ingestion, and conversational AI avatars.',
    },
    {
      icon: <Zap className="w-5 h-5 text-sky-600" />,
      title: 'FastAPI & Distributed Backends',
      desc: 'Async REST endpoints, Pydantic type validation, PostgreSQL + Alembic schema migrations, and Dockerized microservices.',
    },
    {
      icon: <Eye className="w-5 h-5 text-emerald-600" />,
      title: 'Computer Vision & Deep Learning',
      desc: 'PyTorch architectures, Vision GNN (ViG-UNet), Neural Cellular Automata (Med-NCA), and CLAHE vascular segmentation.',
    },
    {
      icon: <Database className="w-5 h-5 text-amber-600" />,
      title: 'Data Pipelines & Media Automation',
      desc: 'MediaPipe facial landmark extraction, phoneme mapping, FFmpeg shot segmentation, and Sentinel satellite GIS data processing.',
    },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT ME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Engineering at the Intersection of <span className="elegant-text-accent">AI & Systems</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bio & Education Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-white/90">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <span>Background & Vision</span>
              </h3>
              
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {bio}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 shadow-sm">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">IIT Mandi (B.Tech EE)</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">August 2023 – May 2027 • CGPA: 8.07 / 10</p>
                  <p className="text-xs text-indigo-600 font-mono mt-1 font-semibold">
                    DSA, Machine Learning, Deep Learning, Signals & Systems
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 shadow-sm">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">NASA SpaceApp Challenge 2024</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">4th Rank among 40+ University Teams</p>
                  <p className="text-xs text-amber-700 font-mono mt-1 font-semibold">
                    Space Data Analytics & Orbital Classification
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreFocus.map((item, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                    {item.icon}
                  </div>
                  <h4 className="text-base font-heading font-bold text-slate-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
