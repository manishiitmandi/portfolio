import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Cpu,
  Zap,
  Briefcase,
  MessageSquare,
  FileUp,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import type {
  Profile,
  SkillCategory,
  ExperienceItem,
  ProjectItem,
  EducationItem,
  ContactMessage,
} from '../../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onLogout: () => void;
  onDataUpdated: () => void;
  initialProfile: Profile | null;
  initialSkills: SkillCategory[];
  initialProjects: ProjectItem[];
  initialExperience: ExperienceItem[];
  initialEducation: EducationItem[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  token,
  onLogout,
  onDataUpdated,
  initialProfile,
  initialSkills,
  initialProjects,
  initialExperience,
  initialEducation,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'experience' | 'messages' | 'resume'>('profile');

  // Editable local state
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [experience, setExperience] = useState<ExperienceItem[]>(initialExperience);
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Status & Notification
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Project Editing State
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  useEffect(() => {
    if (initialProfile) setProfile(initialProfile);
    if (initialSkills) setSkills(initialSkills);
    if (initialProjects) setProjects(initialProjects);
    if (initialExperience) setExperience(initialExperience);
    if (initialEducation) setEducation(initialEducation);
  }, [initialProfile, initialSkills, initialProjects, initialExperience, initialEducation]);

  useEffect(() => {
    if (isOpen && activeTab === 'messages') {
      fetchMessages();
    }
  }, [isOpen, activeTab]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchMessages = async () => {
    try {
      const data = await apiClient.getAdminMessages(token);
      setMessages(data);
    } catch (err: any) {
      showToast('Failed to load contact inquiries', 'error');
    }
  };

  if (!isOpen) return null;

  // --- SAVE HANDLERS ---
  const handleSaveProfile = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      await apiClient.updateProfile(profile, token);
      showToast('Profile and metrics saved successfully!');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateProject = async (p: ProjectItem) => {
    setLoading(true);
    try {
      if (isAddingProject) {
        await apiClient.createProject(p, token);
        showToast('Project created successfully!');
      } else {
        await apiClient.updateProject(p.id, p, token);
        showToast('Project updated successfully!');
      }
      setIsAddingProject(false);
      setEditingProject(null);
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to save project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setLoading(true);
    try {
      await apiClient.deleteProject(id, token);
      setProjects(projects.filter((p) => p.id !== id));
      showToast('Project removed');
      onDataUpdated();
    } catch (err: any) {
      showToast('Failed to delete project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkills = async () => {
    setLoading(true);
    try {
      await apiClient.updateSkills(skills, token);
      showToast('Skills matrix saved successfully!');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to update skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExperience = async () => {
    setLoading(true);
    try {
      await apiClient.updateExperience(experience, token);
      await apiClient.updateEducation(education, token);
      showToast('Experience and education updated!');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to update experience', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await apiClient.deleteMessage(id, token);
      setMessages(messages.filter((m) => m.id !== id));
      showToast('Message deleted');
    } catch (err: any) {
      showToast('Failed to delete message', 'error');
    }
  };

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;
    setLoading(true);
    try {
      await apiClient.uploadResume(resumeFile, token);
      showToast('Resume PDF replaced successfully!');
      setResumeFile(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to upload resume', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-6xl h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Studio Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                <span>Portfolio Admin Studio</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                  LIVE SESSION
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Changes persist directly to FastAPI backend storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            className={`mx-6 mt-4 p-3 rounded-2xl flex items-center gap-2 text-xs font-mono font-semibold animate-in slide-in-from-top-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                : 'bg-rose-50 border border-rose-300 text-rose-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-4 pb-2 bg-slate-50/50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'profile', label: 'Profile & Stats', icon: <User className="w-4 h-4" /> },
            { id: 'projects', label: 'Projects Manager', icon: <Cpu className="w-4 h-4" /> },
            { id: 'skills', label: 'Skills Matrix', icon: <Zap className="w-4 h-4" /> },
            { id: 'experience', label: 'Experience & Edu', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'messages', label: `Messages (${messages.length})`, icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'resume', label: 'Resume PDF', icon: <FileUp className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Studio Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          
          {/* TAB 1: PROFILE & STATS */}
          {activeTab === 'profile' && profile && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white">
                <h3 className="text-base font-heading font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Headline / Role</label>
                  <input
                    type="text"
                    value={profile.headline}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Detailed Bio</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="avail"
                    checked={profile.available_for_hire}
                    onChange={(e) => setProfile({ ...profile, available_for_hire: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-100 border-slate-300"
                  />
                  <label htmlFor="avail" className="text-sm text-slate-700 font-semibold">
                    Available for Hire / Open to Opportunities
                  </label>
                </div>
              </div>

              {/* Social Channels */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white">
                <h3 className="text-base font-heading font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Contact & Social Profiles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Email</label>
                    <input
                      type="text"
                      value={profile.socials.email}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, email: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Phone</label>
                    <input
                      type="text"
                      value={profile.socials.phone}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, phone: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={profile.socials.github}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, github: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profile.socials.linkedin}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Bar Metrics */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white">
                <h3 className="text-base font-heading font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Live Hero Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Projects Count</label>
                    <input
                      type="number"
                      value={profile.stats.projects_completed}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          stats: { ...profile.stats, projects_completed: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">IIT CGPA</label>
                    <input
                      type="text"
                      value={profile.stats.cgpa}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          stats: { ...profile.stats, cgpa: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Hackathons Won</label>
                    <input
                      type="number"
                      value={profile.stats.hackathons_won}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          stats: { ...profile.stats, hackathons_won: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Git Contributions</label>
                    <input
                      type="text"
                      value={profile.stats.contributions}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          stats: { ...profile.stats, contributions: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Password Change */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white">
                <h3 className="text-base font-heading font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Admin Security & Password</span>
                  <span className="text-xs text-slate-500 font-mono">Private</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Current Password</label>
                    <input
                      type="password"
                      id="currPass"
                      placeholder="Current password"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1">New Password</label>
                    <input
                      type="password"
                      id="newPass"
                      placeholder="New password (min 4 chars)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      const curr = (document.getElementById('currPass') as HTMLInputElement)?.value;
                      const newP = (document.getElementById('newPass') as HTMLInputElement)?.value;
                      if (!curr || !newP) {
                        showToast('Please enter both current and new password', 'error');
                        return;
                      }
                      try {
                        await apiClient.changeAdminPassword(curr, newP, token);
                        showToast('Admin password successfully updated!');
                        (document.getElementById('currPass') as HTMLInputElement).value = '';
                        (document.getElementById('newPass') as HTMLInputElement).value = '';
                      } catch (err: any) {
                        showToast(err.message || 'Failed to update password', 'error');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Update Admin Password
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Add / Edit Form Modal or Inline */}
              {(isAddingProject || editingProject) && (
                <div className="glass-panel p-6 rounded-2xl border-indigo-300 space-y-4 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-base font-heading font-bold text-slate-900">
                      {isAddingProject ? 'Add New Project' : `Edit Project: ${editingProject?.title}`}
                    </h4>
                    <button
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const p = (editingProject || {
                        id: `proj-${Date.now()}`,
                        title: '',
                        category: 'AI / Deep Learning',
                        description: '',
                        tags: [],
                        featured: true,
                      }) as ProjectItem;
                      handleCreateOrUpdateProject(p);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Project Title *</label>
                        <input
                          type="text"
                          required
                          value={editingProject?.title || ''}
                          onChange={(e) =>
                            setEditingProject({ ...(editingProject as any), title: e.target.value })
                          }
                          placeholder="e.g. Graph-Based NCA"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Category *</label>
                        <input
                          type="text"
                          required
                          value={editingProject?.category || ''}
                          onChange={(e) =>
                            setEditingProject({ ...(editingProject as any), category: e.target.value })
                          }
                          placeholder="e.g. AI / Medical Imaging, Computer Vision"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Short Description *</label>
                      <textarea
                        rows={2}
                        required
                        value={editingProject?.description || ''}
                        onChange={(e) =>
                          setEditingProject({ ...(editingProject as any), description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Detailed Research Scope</label>
                      <textarea
                        rows={3}
                        value={editingProject?.full_description || ''}
                        onChange={(e) =>
                          setEditingProject({ ...(editingProject as any), full_description: e.target.value })
                        }
                        placeholder="Comprehensive explanation of problem statement, architecture and results..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Key Performance Metric</label>
                        <input
                          type="text"
                          value={editingProject?.metrics || ''}
                          onChange={(e) =>
                            setEditingProject({ ...(editingProject as any), metrics: e.target.value })
                          }
                          placeholder="e.g. Dice score: 0.84 vs 0.81 benchmark"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Tags (Comma-separated)</label>
                        <input
                          type="text"
                          value={editingProject?.tags?.join(', ') || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...(editingProject as any),
                              tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          placeholder="PyTorch, FastAPI, ViG-UNet"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-600 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={editingProject?.github_url || ''}
                          onChange={(e) =>
                            setEditingProject({ ...(editingProject as any), github_url: e.target.value })
                          }
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Demo / App URL</label>
                        <input
                          type="text"
                          value={editingProject?.demo_url || ''}
                          onChange={(e) =>
                            setEditingProject({ ...(editingProject as any), demo_url: e.target.value })
                          }
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProject(false);
                          setEditingProject(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Project</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects List View */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">
                  Total Projects: {projects.length}
                </span>
                <button
                  onClick={() => {
                    setEditingProject({
                      id: `proj-${Date.now()}`,
                      title: '',
                      category: 'Generative AI',
                      description: '',
                      tags: ['Python', 'FastAPI'],
                      featured: true,
                    });
                    setIsAddingProject(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {p.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setIsAddingProject(false);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-heading font-bold text-slate-900 mb-2">{p.title}</h4>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-3 border-t border-slate-100">
                      {p.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS MATRIX */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Skills Matrix Editor</h3>
                  <p className="text-xs text-slate-500">Adjust proficiency levels, add or remove skills</p>
                </div>
                <button
                  onClick={handleSaveSkills}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Skills Matrix</span>
                </button>
              </div>

              <div className="space-y-6">
                {skills.map((category, cIdx) => (
                  <div key={cIdx} className="glass-panel p-5 rounded-2xl space-y-4 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <input
                        type="text"
                        value={category.category}
                        onChange={(e) => {
                          const updated = [...skills];
                          updated[cIdx].category = e.target.value;
                          setSkills(updated);
                        }}
                        className="bg-transparent text-sm font-heading font-bold text-slate-900 focus:outline-none border-b border-dashed border-slate-300 px-1"
                      />
                      <button
                        onClick={() => {
                          const updated = [...skills];
                          updated[cIdx].skills.push({ name: 'New Skill', level: 85, icon: 'Zap' });
                          setSkills(updated);
                        }}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-mono font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const updated = [...skills];
                                updated[cIdx].skills[sIdx].name = e.target.value;
                                setSkills(updated);
                              }}
                              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none flex-1 border-b border-slate-200"
                            />
                            <button
                              onClick={() => {
                                const updated = [...skills];
                                updated[cIdx].skills.splice(sIdx, 1);
                                setSkills(updated);
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={skill.level}
                              onChange={(e) => {
                                const updated = [...skills];
                                updated[cIdx].skills[sIdx].level = parseInt(e.target.value);
                                setSkills(updated);
                              }}
                              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                            />
                            <span className="text-[11px] font-mono text-indigo-700 w-8 text-right font-bold">
                              {skill.level}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE & EDUCATION */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Experience & Academics</h3>
                  <p className="text-xs text-slate-500">Edit positions, achievements, and coursework</p>
                </div>
                <button
                  onClick={handleSaveExperience}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Timeline Changes</span>
                </button>
              </div>

              {/* Experience list */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-indigo-700 font-bold tracking-wider">
                  Work Experience
                </h4>
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="glass-panel p-5 rounded-2xl space-y-3 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[idx].role = e.target.value;
                            setExperience(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[idx].company = e.target.value;
                            setExperience(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1">Period & Location</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[idx].period = e.target.value;
                            setExperience(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[idx].location = e.target.value;
                            setExperience(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1">Highlights (One per line)</label>
                      <textarea
                        rows={3}
                        value={exp.highlights.join('\n')}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[idx].highlights = e.target.value.split('\n').filter(Boolean);
                          setExperience(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-mono uppercase text-indigo-700 font-bold tracking-wider">
                  Academic Degree
                </h4>
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="glass-panel p-5 rounded-2xl space-y-3 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx].institution = e.target.value;
                            setEducation(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-600 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx].degree = e.target.value;
                            setEducation(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Contact Inquiries Inbox</h3>
                  <p className="text-xs text-slate-500">All submissions received through your dynamic portfolio</p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                >
                  Refresh Inbox
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center glass-panel rounded-2xl text-slate-500 font-mono text-xs bg-white">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`glass-panel p-5 rounded-2xl flex flex-col gap-2.5 bg-white ${
                        !m.is_read ? 'border-indigo-300 bg-indigo-50/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{m.name}</span>
                          <span className="text-xs font-mono font-medium text-indigo-600">({m.email})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {m.created_at && (
                            <span className="text-[11px] font-mono text-slate-400">
                              {new Date(m.created_at).toLocaleString()}
                            </span>
                          )}
                          <button
                            onClick={() => m.id && handleDeleteMessage(m.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-indigo-700">{m.subject}</div>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                        {m.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: RESUME REPLACEMENT */}
          {activeTab === 'resume' && (
            <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl space-y-6 text-center bg-white">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center">
                <FileUp className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-1">
                  Upload Updated Resume PDF
                </h3>
                <p className="text-xs text-slate-500">
                  Select a new PDF to immediately update the live downloadable resume across your portfolio.
                </p>
              </div>

              <form onSubmit={handleResumeUpload} className="space-y-4">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />

                <button
                  type="submit"
                  disabled={!resumeFile || loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all disabled:opacity-40"
                >
                  {loading ? 'Uploading & Replacing...' : 'Upload & Deploy Resume'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
