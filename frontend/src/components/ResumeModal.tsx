import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const resumeUrl = '/resume.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-slate-900">
                Manish Kumar — Curriculum Vitae
              </h3>
              <p className="text-xs text-slate-500 font-mono font-medium">
                IIT Mandi (B.Tech EE) • GenAI Intern @ Zangoh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Tab</span>
            </a>

            <a
              href={resumeUrl}
              download="Manish_Kumar_Resume.pdf"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewer / Object */}
        <div className="flex-1 w-full bg-slate-100 relative">
          <object
            data={`${resumeUrl}#toolbar=0`}
            type="application/pdf"
            className="w-full h-full border-0"
          >
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FileText className="w-12 h-12 text-indigo-500 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-2">Resume PDF Ready</h4>
              <p className="text-xs text-slate-500 mb-4 max-w-sm">
                Your browser does not support inline PDF previews. You can view or download it directly below.
              </p>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
              >
                View PDF Fullscreen
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
};
