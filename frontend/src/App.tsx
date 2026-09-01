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
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  // State for data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('portfolio_admin_token');
  });

  // Fetch all portfolio data
  const loadPortfolioData = async () => {
    try {
      setError(null);

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
      console.error('Failed to load portfolio data:', err);
      setError(err.message || 'Could not connect to FastAPI backend');
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
        {error ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 max-w-md">
              <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-rose-400" />
              <h3 className="text-lg font-heading font-bold text-white mb-1">
                Backend Connection Error
              </h3>
              <p className="text-xs text-slate-400 mb-4">{error}</p>
              <button
                onClick={loadPortfolioData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-xs font-semibold mx-auto text-cyan-300"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
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
