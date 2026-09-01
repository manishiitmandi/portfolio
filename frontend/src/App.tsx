import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Terminal } from './components/Terminal';
import { ResumeModal } from './components/ResumeModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { apiClient } from './api/client';
import type {
  Profile,
  SkillCategory,
  ExperienceItem,
  ProjectItem,
  EducationItem,
} from './types';

export const App: React.FC = () => {
  // Pure Live Database State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('portfolio_admin_token');
  });

  // Fetch all portfolio data strictly from database API
  const loadPortfolioData = async () => {
    try {
      const [pData, sData, prData, eData, edData] = await Promise.all([
        apiClient.getProfile(),
        apiClient.getSkills(),
        apiClient.getProjects(),
        apiClient.getExperience(),
        apiClient.getEducation(),
      ]);

      setProfile(pData);
      setSkills(sData);
      setProjects(prData);
      setExperience(eData);
      setEducation(edData);
    } catch (err: any) {
      console.error('Failed to load live database data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Keyboard shortcut: Ctrl+Shift+A opens Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdmin();
      }
      if (e.ctrlKey && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminToken]);

  const handleOpenAdmin = () => {
    if (adminToken) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('portfolio_admin_token', token);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('portfolio_admin_token');
    setIsAdminDashboardOpen(false);
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connecting to Neon Cloud Database...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Navbar */}
      <Navbar
        profile={profile}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!adminToken}
      />

      {/* Main Content */}
      <main>
        <Hero
          profile={profile}
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />
        <About profile={profile} />
        <Experience experience={experience} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Contact profile={profile} />
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      {/* Modals & Overlays */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {isAdminDashboardOpen && adminToken && (
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          token={adminToken}
          onLogout={handleAdminLogout}
          onDataUpdated={loadPortfolioData}
          initialProfile={profile}
          initialSkills={skills}
          initialProjects={projects}
          initialExperience={experience}
          initialEducation={education}
        />
      )}
    </div>
  );
};

export default App;
