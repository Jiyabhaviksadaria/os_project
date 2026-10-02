'use client';

import React from 'react';
import { SemaphoreState } from '@/lib/simulation/types';
import { Binary, HelpCircle, AlertCircle, Layers } from 'lucide-react';

interface SemaphorePanelProps {
  emptySemaphore: SemaphoreState;
  fullSemaphore: SemaphoreState;
  onOpenVivaModal: (conceptKey: string) => void;
}

export function SemaphorePanel({
  emptySemaphore,
  fullSemaphore,
  onOpenVivaModal,
}: SemaphorePanelProps) {
  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-xl font-mono">
      <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                COUNTING SEMAPHORES
              </h3>
              <button
                onClick={() => onOpenVivaModal('semaphores')}
                className="text-slate-400 hover:text-amber-400 transition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Resource tracking & blocking synchronization primitives
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* EMPTY Semaphore */}
        <div
          onClick={() => onOpenVivaModal('empty_semaphore')}
          className="p-4 rounded-xl bg-navy-950/80 border border-blue-500/30 hover:border-blue-500/60 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase">
              EMPTY SEMAPHORE
            </span>
            <span className="text-[10px] text-slate-400 bg-navy-900 px-2 py-0.5 rounded">
              Initial: {emptySemaphore.initialCapacity}
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-3">
            <span className="text-3xl font-black text-white">
              {emptySemaphore.value}
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Available buffer slots
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans mb-3 bg-navy-900/90 p-2.5 rounded border border-navy-800">
            &quot;{emptySemaphore.value} warehouse slots are currently available for producers.&quot;
          </p>

          {/* Waiters Queue */}
          {emptySemaphore.waitingCount > 0 ? (
            <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-lg text-xs font-sans">
              <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Blocked Producers ({emptySemaphore.waitingCount}):</span>
              </div>
              <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                {emptySemaphore.waitingQueue.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded border border-red-500/30"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 font-sans italic">
              No producers currently blocked on empty slots.
            </div>
          )}
        </div>

        {/* FULL Semaphore */}
        <div
          onClick={() => onOpenVivaModal('full_semaphore')}
          className="p-4 rounded-xl bg-navy-950/80 border border-emerald-500/30 hover:border-emerald-500/60 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase">
              FULL SEMAPHORE
            </span>
            <span className="text-[10px] text-slate-400 bg-navy-900 px-2 py-0.5 rounded">
              Initial: 0
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-3">
            <span className="text-3xl font-black text-white">
              {fullSemaphore.value}
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Parcels ready for pickup
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans mb-3 bg-navy-900/90 p-2.5 rounded border border-navy-800">
            &quot;{fullSemaphore.value} parcels are ready in warehouse for consumer pickup.&quot;
          </p>

          {/* Waiters Queue */}
          {fullSemaphore.waitingCount > 0 ? (
            <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs font-sans">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Waiting Consumers ({fullSemaphore.waitingCount}):</span>
              </div>
              <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                {fullSemaphore.waitingQueue.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 font-sans italic">
              No consumers currently waiting on full parcels.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
