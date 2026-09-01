import React from 'react';
import {
  ArrowRight,
  Download,
  Mail,
  Terminal,
  Cpu,
  Award,
  Zap,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './Icons';
import type { Profile } from '../types';

interface HeroProps {
  profile: Profile | null;
  onOpenResume: () => void;
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenResume, onOpenTerminal }) => {
  const stats = profile?.stats || {
    projects_completed: 8,
    cgpa: '8.07',
    years_experience: '1+',
    hackathons_won: 2,
    contributions: '650+',
  };

  const socials = profile?.socials || {
    github: 'https://github.com/manishiitmandi',
    linkedin: 'https://www.linkedin.com/in/manish-kumar-0067a42a0/',
    leetcode: 'https://leetcode.com/manish_iitm',
    codeforces: 'https://codeforces.com/profile/manish_iitm',
    email: 'manish.iitm484@gmail.com',
  };

  return (
    <section id="home" className="relative min-h-[92vh] pt-32 pb-16 flex items-center justify-center overflow-hidden">
      {/* Ambient background soft pastel glow orbs for elegant light theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-sky-200/40 to-purple-200/30 blur-[130px] rounded-full pointer-events-none -z-10 animate-glow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-100/60 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      {/* Background Subtle Light Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center relative z-10">
        
        {/* PROMINENT PROFILE PICTURE / MK MONOGRAM AVATAR */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            {/* Ambient Avatar Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-500"></div>
            
            {/* Avatar Container */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-indigo-600 via-sky-500 to-cyan-400 shadow-xl shadow-indigo-500/15 flex items-center justify-center animate-float">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-50 via-white to-sky-50 flex flex-col items-center justify-center select-none">
                    <span className="font-heading font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-tr from-indigo-700 via-indigo-600 to-cyan-600 tracking-wider">
                      MK
                    </span>
                    <span className="text-[9px] font-mono font-bold text-indigo-500 tracking-widest uppercase mt-0.5">
                      IIT MANDI
                    </span>
                  </div>
                )}
              </div>

              {/* Status indicator on avatar */}
              <span
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md"
                title="Active & Available for opportunities"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm backdrop-blur-md mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-indigo-700 tracking-wide uppercase font-bold">
            {profile?.available_for_hire ? 'Available for New Opportunities' : 'Currently Building'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-600 font-mono font-medium">IIT Mandi '27</span>
        </div>

        {/* Hero Name */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight text-slate-900 mb-4 leading-[1.1]">
          Hello, I'm{' '}
          <span className="elegant-text-primary font-black">
            {profile?.name || 'Manish Kumar'}
          </span>
        </h1>

        {/* Subtitle / Role */}
        <p className="text-lg sm:text-2xl text-slate-700 font-semibold max-w-3xl mx-auto mb-5 leading-relaxed">
          <span className="elegant-text-accent">
            {profile?.headline || 'Generative AI & Backend Systems Engineer'}
          </span>
        </p>

        {/* Tagline / Bio Summary */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
          {profile?.tagline ||
            'Crafting high-throughput FastAPI microservices, agentic AI pipelines & deep learning vision architectures.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <a
            href="#projects"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <button
            onClick={onOpenResume}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-800 font-semibold text-sm border border-slate-300 hover:bg-slate-50 hover:border-indigo-500/50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Download Resume</span>
          </button>

          <a
            href="#contact"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-50/80 text-indigo-700 font-semibold text-sm border border-indigo-100 hover:bg-indigo-100 transition-all"
          >
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>Contact Me</span>
          </a>
        </div>

        {/* Social Links Row */}
        <div className="flex items-center justify-center gap-3.5 mb-14 text-slate-600">
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:-translate-y-1 transition-all shadow-sm"
              title="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:-translate-y-1 transition-all shadow-sm"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
          )}
          {socials.leetcode && (
            <a
              href={socials.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:text-amber-600 hover:-translate-y-1 transition-all shadow-sm"
              title="LeetCode Profile"
            >
              <LeetCodeIcon className="w-5 h-5" />
            </a>
          )}
          {socials.email && (
            <a
              href={`mailto:${socials.email}`}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-500 hover:text-rose-600 hover:-translate-y-1 transition-all shadow-sm"
              title="Send Direct Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 hover:-translate-y-1 transition-all font-mono text-xs font-semibold shadow-sm"
            title="Launch Interactive Terminal"
          >
            <Terminal className="w-4 h-4" />
            <span>CLI</span>
          </button>
        </div>

        {/* Dynamic Key Stats Bar - 3 Columns (CGPA removed) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                {stats.projects_completed}+
              </span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Engineered Projects</span>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
              <Award className="w-4 h-4" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                {stats.hackathons_won}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">NASA Hackathon Awards</span>
          </div>

          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                {stats.contributions}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Git Contributions</span>
          </div>
        </div>

      </div>
    </section>
  );
};
