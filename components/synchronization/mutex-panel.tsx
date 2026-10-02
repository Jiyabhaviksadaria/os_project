'use client';

import React from 'react';
import { MutexState } from '@/lib/simulation/types';
import { Lock, Unlock, HelpCircle, ShieldCheck, Users } from 'lucide-react';

interface MutexPanelProps {
  mutex: MutexState;
  onOpenVivaModal: (conceptKey: string) => void;
}

export function MutexPanel({ mutex, onOpenVivaModal }: MutexPanelProps) {
  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-xl font-mono">
      <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            {mutex.isLocked ? <Lock className="w-5 h-5 text-amber-400" /> : <Unlock className="w-5 h-5 text-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                MUTEX LOCK (CRITICAL SECTION PROTECTION)
              </h3>
              <button
                onClick={() => onOpenVivaModal('mutex')}
                className="text-slate-400 hover:text-amber-400 transition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Ensures mutual exclusion: exactly 1 process inside critical section at a time
            </p>
          </div>
        </div>

        {mutex.isLocked ? (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold animate-pulse">
            🔒 LOCKED
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold">
            🔓 AVAILABLE
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Owner Card */}
        <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono">
            CURRENT LOCK OWNER:
          </span>
          <div className="mt-2 text-sm font-bold">
            {mutex.isLocked ? (
              <div className="flex items-center gap-2 text-amber-400 font-mono">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>{mutex.ownerName}</span>
                <span className="text-[10px] text-slate-500">({mutex.ownerId})</span>
              </div>
            ) : (
              <span className="text-slate-500 italic font-sans text-xs">
                No process currently holds the mutex lock.
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-sans mt-3">
            {mutex.isLocked
              ? `Worker "${mutex.ownerName}" is currently modifying the shared buffer queue.`
              : 'Mutex is free. Any ready worker can acquire the lock.'}
          </p>
        </div>

        {/* Mutex Waiting Queue */}
        <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">
              MUTEX WAITING QUEUE:
            </span>
            <span className="text-xs text-amber-400 font-bold">
              {mutex.waitingCount} processes
            </span>
          </div>

          {mutex.waitingCount > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {mutex.waitingQueue.map((w, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 text-xs font-mono flex items-center gap-1"
                >
                  <Users className="w-3 h-3 text-blue-400" />
                  {w.workerName}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-sans italic mt-2">
              Mutex queue is empty. Zero workers waiting to lock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
