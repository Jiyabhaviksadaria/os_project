'use client';

import React, { useState } from 'react';
import { LogEntry, LogCategory } from '@/lib/simulation/types';
import { Terminal, Trash2, Download, Search, Filter, ShieldAlert } from 'lucide-react';

interface EventLogProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export function EventLog({ logs, onClearLogs }: EventLogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesCategory =
      selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: LogCategory) => {
    switch (category) {
      case 'MUTEX':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            MUTEX
          </span>
        );
      case 'SEMAPHORE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            SEMAPHORE
          </span>
        );
      case 'BUFFER':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            BUFFER
          </span>
        );
      case 'PRODUCER':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            PRODUCER
          </span>
        );
      case 'CONSUMER':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            CONSUMER
          </span>
        );
      case 'WARNING':
      case 'ERROR':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            {category}
          </span>
        );
      case 'SYSTEM':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            SYSTEM
          </span>
        );
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `parcelhub_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const categories = ['ALL', 'MUTEX', 'SEMAPHORE', 'BUFFER', 'PRODUCER', 'CONSUMER', 'SYSTEM'];

  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              REAL-TIME OS EVENT LOG
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Sequential trace of process synchronization events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 rounded-lg text-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-red-500/20 text-red-400 border border-navy-700 hover:border-red-500/40 rounded-lg text-xs transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Category Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-navy-950 font-bold'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-56 bg-navy-950 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-navy-800 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Logs Scrollbox */}
      <div className="h-64 overflow-y-auto bg-navy-950 rounded-xl p-3 border border-navy-800/80 space-y-2 text-xs">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 italic font-sans text-xs">
            No simulation log events recorded yet. Press START to begin.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 p-2 rounded bg-navy-900/60 hover:bg-navy-900 border border-navy-800/60 text-slate-300 font-mono"
            >
              <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>
              <div className="shrink-0">{getCategoryBadge(log.category)}</div>
              <div className="flex-1 font-sans text-xs">
                <p className="text-slate-200">{log.message}</p>
                {log.details && (
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{log.details}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
