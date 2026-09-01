import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './Icons';
import confetti from 'canvas-confetti';
import { apiClient } from '../api/client';
import type { Profile } from '../types';

interface ContactProps {
  profile: Profile | null;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Portfolio Inquiry / Collaboration',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const socials = profile?.socials || {
    email: 'manish.iitm484@gmail.com',
    phone: '+91 9872095834',
    github: 'https://github.com/manishiitmandi',
    linkedin: 'https://www.linkedin.com/in/manish-kumar-0067a42a0/',
    leetcode: 'https://leetcode.com/manish_iitm',
    codeforces: 'https://codeforces.com/profile/manish_iitm',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await apiClient.submitContact(formData);
      setStatus({ type: 'success', message: res.message || 'Message delivered successfully!' });
      setFormData({ name: '', email: '', subject: 'Portfolio Inquiry / Collaboration', message: '' });

      // Trigger celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4f46e5', '#0284c7', '#10b981'],
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to submit message. Please try again or email directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>LET'S CONNECT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Get in <span className="elegant-text-accent">Touch</span>
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mt-3">
            Whether you have a question regarding Generative AI, high-performance backends, research collaboration, or career opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Contact channels card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95">
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-6">
                Direct Channels
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${socials.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white transition-all group shadow-sm"
                >
                  <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-mono font-medium block">Email Address</span>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {socials.email}
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-mono font-medium block">Phone</span>
                    <span className="text-sm font-bold text-slate-800">
                      {socials.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-mono font-medium block">Location</span>
                    <span className="text-sm font-bold text-slate-800">
                      {profile?.location || 'Himachal Pradesh / Indore, India'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Grid */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Developer Profiles
                </span>
                <div className="flex items-center gap-2.5">
                  {socials.github && (
                    <a
                      href={socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-400 transition-all shadow-sm"
                      title="GitHub"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  )}
                  {socials.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-500 transition-all shadow-sm"
                      title="LinkedIn"
                    >
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                  )}
                  {socials.leetcode && (
                    <a
                      href={socials.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-amber-500 transition-all shadow-sm"
                      title="LeetCode"
                    >
                      <LeetCodeIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/95">
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-2">
                Send a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Your message is stored securely via the FastAPI backend and notified immediately.
              </p>

              {status && (
                <div
                  className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-medium ${
                    status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1.5 uppercase">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors text-sm shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-600 mb-1.5 uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors text-sm shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1.5 uppercase">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors text-sm shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1.5 uppercase">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hi Manish, I'd like to talk about..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors text-sm resize-none shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/25 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⚡</span> Sending Message...
                    </span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
