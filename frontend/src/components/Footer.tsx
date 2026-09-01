import React, { useState, useEffect } from 'react';
import { ArrowUp, Mail, Terminal, Database } from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon, CodeforcesIcon } from './Icons';
import { apiClient } from '../api/client';
import type { Profile } from '../types';

interface FooterProps {
  profile: Profile | null;
  onOpenTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenTerminal }) => {
  const [health, setHealth] = useState<{ status: string; database: string; latency: number } | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await apiClient.getHealth();
        setHealth({
          status: data.status,
          database: data.database === 'connected' ? 'PostgreSQL' : data.database,
          latency: data.database_latency_ms,
        });
      } catch (err) {
        setHealth({ status: 'offline', database: 'Disconnected', latency: 0 });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 20000); // Poll every 20s
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = profile?.socials || {
    github: 'https://github.com/manishiitmandi',
    linkedin: 'https://www.linkedin.com/in/manish-kumar-0067a42a0/',
    leetcode: 'https://leetcode.com/manish_iitm',
    codeforces: 'https://codeforces.com/profile/manish_iitm',
    email: 'manish.iitm484@gmail.com',
  };

  return (
    <footer className="relative bg-white border-t border-slate-200/80 py-10 text-slate-600 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Status & Telemetry */}
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-800 font-semibold flex items-center gap-1.5">
              <span>FastAPI Gateway</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-indigo-600">
                <Database className="w-3 h-3" />
                <span>{health?.database || 'Cloud DB'}</span>
              </span>
              {health && health.latency > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-mono">
                  {health.latency}ms
                </span>
              )}
            </span>
          </div>

          <p className="text-slate-400 text-center sm:text-left text-[11px] font-normal">
            Designed & engineered by {profile?.name || 'Manish Kumar'}. Powered by FastAPI & React.
          </p>
        </div>

        {/* Middle Links & Terminal Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors font-mono text-[11px] font-medium"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span>CLI</span>
          </button>
          
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
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
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
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
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 transition-colors"
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
              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
              title="Codeforces Profile"
            >
              <CodeforcesIcon className="w-4 h-4" colored={true} />
            </a>
          )}
          {socials.email && (
            <a
              href={`mailto:${socials.email}`}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 transition-colors"
              title="Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all text-xs font-medium"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

      </div>
    </footer>
  );
};
