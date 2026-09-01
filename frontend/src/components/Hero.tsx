import React, { useState } from 'react';
import {
  ArrowRight,
  Download,
  Terminal,
  Cpu,
  Award,
  Zap,
  Check,
  Copy,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon, CodeforcesIcon } from './Icons';
import type { Profile } from '../types';

interface HeroProps {
  profile: Profile | null;
  onOpenResume: () => void;
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenResume, onOpenTerminal }) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="home" className="relative min-h-[88vh] pt-32 pb-16 flex items-center justify-center overflow-hidden">
      {/* Subtle, natural lighting mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-100/50 via-sky-100/40 to-slate-100/30 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center relative z-10">
        
        {/* Profile Avatar / AI Developer Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[2.5px] bg-gradient-to-tr from-slate-300 via-indigo-500 to-sky-400 shadow-md flex items-center justify-center transition-transform hover:scale-105">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={profile?.avatar_url || '/avatar.jpg'}
                  alt={profile?.name || 'Manish Kumar'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to /avatar.jpg if path error
                    (e.target as HTMLImageElement).src = '/avatar.jpg';
                  }}
                />
              </div>

              {/* Status pulse */}
              <span
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm"
                title="Available for hire & research"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono text-slate-700 font-medium">
            IIT Mandi EE '27 • Open to Opportunities
          </span>
        </div>

        {/* Human, Crisp Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight text-slate-900 mb-4 leading-[1.15]">
          Hi, I'm <span className="text-indigo-600 font-black">{profile?.name || 'Manish Kumar'}</span>.
        </h1>

        {/* Role & Core Focus */}
        <p className="text-lg sm:text-xl text-slate-800 font-semibold max-w-3xl mx-auto mb-3 leading-relaxed">
          {profile?.headline || 'Generative AI & Backend Systems Engineer'}
        </p>

        {/* Narrative / Context */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          {profile?.tagline || 'Crafting high-throughput FastAPI microservices, agentic AI pipelines & computer vision architectures.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <a
            href="#projects"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs"
          >
            <span>View Selected Work</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenResume}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Curriculum Vitae</span>
          </button>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs border border-slate-200 transition-all shadow-xs"
            title="Copy email address"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Email Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{socials.email}</span>
              </>
            )}
          </button>
        </div>

        {/* Verified Social Profiles */}
        <div className="flex items-center justify-center gap-3 mb-12 text-slate-600">
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-900 transition-all shadow-xs"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:text-indigo-600 transition-all shadow-xs"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {socials.leetcode && (
            <a
              href={socials.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-600 transition-all shadow-xs"
              title="LeetCode Profile"
            >
              <LeetCodeIcon className="w-4 h-4" />
            </a>
          )}
          {socials.codeforces && (
            <a
              href={socials.codeforces}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-xs"
              title="Codeforces Profile"
            >
              <CodeforcesIcon className="w-4 h-4" colored={true} />
            </a>
          )}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-all font-mono text-xs font-semibold shadow-xs"
            title="Open Developer Terminal"
          >
            <Terminal className="w-3.5 h-3.5" />
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
