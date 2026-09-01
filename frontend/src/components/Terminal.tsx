import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from 'lucide-react';
import { apiClient } from '../api/client';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandHistoryItem {
  command: string;
  output: string;
  type?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'welcome',
      output:
        "🚀 Manish Kumar's Portfolio Interactive CLI v1.0.0 (FastAPI Core)\nType 'help' to inspect available system commands or 'projects' to view research architectures.",
      type: 'text',
    },
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  if (!isOpen) return null;

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    setLoading(true);
    const cmd = trimmed;
    setInput('');

    try {
      const res = await apiClient.executeTerminalCommand(cmd);
      setHistory((prev) => [...prev, { command: cmd, output: res.output, type: res.type }]);
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        { command: cmd, output: `Error: ${err.message || 'Execution error'}`, type: 'error' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = ['help', 'skills', 'projects', 'stats', 'whoami', 'clear'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full ${
          isExpanded ? 'max-w-5xl h-[85vh]' : 'max-w-3xl h-[60vh]'
        } flex flex-col rounded-2xl bg-[#090d16] border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 overflow-hidden font-mono transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d1424] border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs text-slate-400 font-semibold ml-2 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>guest@manish-portfolio:~ (fastapi-bridge)</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title={isExpanded ? 'Restore window size' : 'Expand window'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Suggestions */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold uppercase">Quick:</span>
          {quickCommands.map((qc) => (
            <button
              key={qc}
              onClick={() => {
                if (qc === 'clear') {
                  setHistory([]);
                } else {
                  setInput(qc);
                  inputRef.current?.focus();
                }
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 border border-white/5 transition-colors whitespace-nowrap"
            >
              {qc}
            </button>
          ))}
        </div>

        {/* Terminal Content / Logs */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <span className="text-emerald-400">➜</span>
                <span className="text-slate-400">~</span>
                <span>{item.command}</span>
              </div>
              <pre
                className={`whitespace-pre-wrap font-mono p-2.5 rounded-lg bg-slate-950/60 border border-white/5 leading-relaxed ${
                  item.type === 'error' ? 'text-rose-400 border-rose-500/20' : 'text-slate-300'
                }`}
              >
                {item.output}
              </pre>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs">
              <span className="animate-spin inline-block">⚡</span>
              <span>Executing via FastAPI backend...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Interactive CLI Input Line */}
        <form
          onSubmit={handleCommand}
          className="flex items-center gap-2 px-4 py-3 bg-[#0d1424] border-t border-white/10"
        >
          <span className="text-emerald-400 font-bold">➜</span>
          <span className="text-cyan-400 font-bold">~</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command here (e.g. 'skills', 'projects', 'help')..."
            className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs sm:text-sm placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs flex items-center gap-1 border border-cyan-500/30"
          >
            <span>Run</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
