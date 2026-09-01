import type {
  Profile,
  SkillCategory,
  ExperienceItem,
  ProjectItem,
  EducationItem,
  AchievementItem,
  Stats,
  ContactMessage,
  TerminalCommandResponse,
} from '../types';

const API_BASE = '/api';

export const apiClient = {
  // Public Endpoints
  async getProfile(): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async getSkills(): Promise<SkillCategory[]> {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  async getExperience(): Promise<ExperienceItem[]> {
    const res = await fetch(`${API_BASE}/experience`);
    if (!res.ok) throw new Error('Failed to fetch experience');
    return res.json();
  },

  async getProjects(category?: string): Promise<ProjectItem[]> {
    const url = category && category !== 'All' 
      ? `${API_BASE}/projects?category=${encodeURIComponent(category)}`
      : `${API_BASE}/projects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProjectById(id: string): Promise<ProjectItem> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async getEducation(): Promise<EducationItem[]> {
    const res = await fetch(`${API_BASE}/education`);
    if (!res.ok) throw new Error('Failed to fetch education');
    return res.json();
  },

  async getAchievements(): Promise<AchievementItem[]> {
    const res = await fetch(`${API_BASE}/achievements`);
    if (!res.ok) throw new Error('Failed to fetch achievements');
    return res.json();
  },

  async getStats(): Promise<Stats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async submitContact(data: { name: string; email: string; subject?: string; message: string }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to send message' }));
      throw new Error(err.detail || 'Failed to submit contact');
    }
    return res.json();
  },

  async executeTerminalCommand(command: string): Promise<TerminalCommandResponse> {
    const res = await fetch(`${API_BASE}/terminal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    if (!res.ok) throw new Error('Terminal execution failed');
    return res.json();
  },

  // Admin Endpoints
  async adminLogin(pin: string): Promise<{ success: boolean; token: string; message: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Invalid admin credentials');
    }
    return res.json();
  },

  async changeAdminPassword(current_pin: string, new_pin: string, token: string) {
    const res = await fetch(`${API_BASE}/admin/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ current_pin, new_pin }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to change password' }));
      throw new Error(err.detail || 'Failed to update admin password');
    }
    return res.json();
  },

  async updateProfile(profile: Profile, token: string) {
    const res = await fetch(`${API_BASE}/admin/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async createProject(project: Partial<ProjectItem>, token: string) {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, project: ProjectItem, token: string) {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(id: string, token: string) {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  async updateSkills(skills: SkillCategory[], token: string) {
    const res = await fetch(`${API_BASE}/admin/skills`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(skills),
    });
    if (!res.ok) throw new Error('Failed to update skills');
    return res.json();
  },

  async updateExperience(experience: ExperienceItem[], token: string) {
    const res = await fetch(`${API_BASE}/admin/experience`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(experience),
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
  },

  async updateEducation(education: EducationItem[], token: string) {
    const res = await fetch(`${API_BASE}/admin/education`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(education),
    });
    if (!res.ok) throw new Error('Failed to update education');
    return res.json();
  },

  async getAdminMessages(token: string): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/admin/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async markMessageRead(id: string, token: string) {
    const res = await fetch(`${API_BASE}/admin/messages/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to mark message read');
    return res.json();
  },

  async deleteMessage(id: string, token: string) {
    const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return res.json();
  },

  async uploadResume(file: File, token: string) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload resume');
    return res.json();
  },
};
