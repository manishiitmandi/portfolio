import React from 'react';
import { ArrowUp, Mail, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import type { Profile } from '../types';

interface FooterProps {
  profile: Profile | null;
  onOpenTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenTerminal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = profile?.socials || {
    github: 'https://github.com/manishiitmandi',
    linkedin: 'https://www.linkedin.com/in/manish-kumar-0067a42a0/',
    email: 'manish.iitm484@gmail.com',
  };

  return (
    <footer className="relative bg-slate-100/80 border-t border-slate-200 py-12 text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Status & Brand */}
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-mono text-[11px] text-emerald-700 font-bold">
              FastAPI Core: ONLINE
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-[11px] text-slate-500">v1.0.0</span>
          </div>

          <p className="text-slate-500 text-center sm:text-left font-medium">
            © {new Date().getFullYear()} {profile?.name || 'Manish Kumar'}. Crafted for high performance.
          </p>
        </div>

        {/* Middle Links & Terminal Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-mono text-[11px] font-semibold shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Developer CLI</span>
          </button>
          
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {socials.email && (
            <a
              href={`mailto:${socials.email}`}
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-white transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-700 transition-all text-xs font-semibold shadow-sm text-slate-700"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
        </button>

      </div>
    </footer>
  );
};
