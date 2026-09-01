import React, { useState, useEffect } from 'react';
import { Terminal, FileText, Lock, Menu, X } from 'lucide-react';
import type { Profile } from '../types';

interface NavbarProps {
  profile: Profile | null;
  onOpenTerminal: () => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenTerminal,
  onOpenResume,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm shadow-slate-900/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand with Profile Avatar */}
        <a
          href="#home"
          className="group flex items-center gap-3 text-slate-900 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-cyan-400 p-[2px] shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
              <img
                src={profile?.avatar_url || '/avatar.jpg'}
                alt={profile?.name || 'Manish Kumar'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/avatar.jpg';
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              {profile?.name || 'Manish Kumar'}
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Available for hire" />
            </span>
            <span className="text-[11px] text-indigo-600 font-mono font-medium tracking-tight hidden sm:inline">
              FastAPI • GenAI • PyTorch
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeSection === link.href.substring(1)
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Terminal Trigger */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 rounded-xl transition-all hover:border-indigo-500/50 hover:text-indigo-600 shadow-sm"
            title="Open Interactive Developer Terminal (CLI)"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span>CLI</span>
          </button>

          {/* Resume Modal Trigger */}
          <button
            onClick={onOpenResume}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/80 rounded-xl transition-all hover:border-indigo-500/50 hover:text-indigo-600 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Resume</span>
          </button>

          {/* Admin Studio Trigger */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl transition-all border shadow-sm ${
              isAdminLoggedIn
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                : 'bg-white border-slate-200 text-slate-600 hover:text-amber-700 hover:border-amber-400'
            }`}
            title="Admin Studio (Live Portfolio Editor)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenTerminal}
            className="p-2 text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl shadow-sm"
            title="Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-xl shadow-xl flex flex-col gap-2.5 animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 text-sm rounded-xl font-medium transition-colors ${
                activeSection === link.href.substring(1)
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </a>
          ))}
          <hr className="border-slate-200 my-1" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl"
            >
              <FileText className="w-4 h-4" /> Resume
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 rounded-xl"
            >
              <Lock className="w-4 h-4" /> Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
