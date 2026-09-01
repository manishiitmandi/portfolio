export interface SocialLinks {
  github: string;
  linkedin: string;
  leetcode: string;
  codeforces: string;
  email: string;
  phone: string;
  twitter?: string;
}

export interface Stats {
  projects_completed: number;
  cgpa: string;
  years_experience: string;
  hackathons_won: number;
  contributions: string;
}

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  available_for_hire: boolean;
  avatar_url?: string;
  socials: SocialLinks;
  stats: Stats;
}

export interface SkillItem {
  name: string;
  level: number;
  icon?: string;
  highlight?: boolean;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  highlights: string[];
  tech_stack: string[];
  current?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  full_description?: string;
  tags: string[];
  metrics?: string;
  github_url?: string;
  demo_url?: string;
  featured: boolean;
  architecture?: string[];
  created_date?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  cgpa_or_grade: string;
  coursework: string[];
  highlights?: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  rank: string;
  year: string;
  description: string;
  link?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: string;
  is_read?: boolean;
}

export interface TerminalCommandResponse {
  output: string;
  type?: 'text' | 'table' | 'json' | 'error' | 'link';
}
