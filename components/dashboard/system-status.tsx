'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, Cpu, Database } from 'lucide-react';
import { SimulationStats } from '@/lib/simulation/types';

interface SystemStatusProps {
  stats: SimulationStats;
  onOpenVivaModal: (conceptKey: string) => void;
}

export function SystemStatus({ stats, onOpenVivaModal }: SystemStatusProps) {
  const isFull = stats.occupiedSlots === stats.bufferCapacity;
  const isEmpty = stats.occupiedSlots === 0;

  const getBufferBadge = () => {
    if (isFull) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          FULL (Producers Blocked)
        </span>
      );
    }
    if (isEmpty) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          EMPTY (Consumers Waiting)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        SAFE ({stats.occupiedSlots}/{stats.bufferCapacity} slots)
      </span>
    );
  };

  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-xl p-3.5 mb-6 shadow-lg flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-amber-400" />
        <span className="font-bold text-slate-300 uppercase tracking-wider">SYSTEM HEALTH:</span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Sync */}
        <div
          onClick={() => onOpenVivaModal('mutex')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-950 border border-navy-800 text-slate-300 hover:border-emerald-500/40 transition cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Synchronization:</span>
          <strong className="text-emerald-400">ACTIVE</strong>
        </div>

        {/* Buffer */}
        <div
          onClick={() => onOpenVivaModal('bounded_buffer')}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <span className="text-slate-400">Buffer:</span>
          {getBufferBadge()}
        </div>

        {/* Data Integrity */}
        <div
          onClick={() => onOpenVivaModal('critical_section')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-950 border border-navy-800 text-slate-300 hover:border-blue-500/40 transition cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Data Integrity:</span>
          <strong className="text-blue-400">100% OK</strong>
        </div>

        {/* Race Conditions */}
        <div
          onClick={() => onOpenVivaModal('race_condition')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-950 border border-navy-800 text-slate-300 hover:border-amber-500/40 transition cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Race Conditions:</span>
          <strong className="text-emerald-400">0 DETECTED</strong>
        </div>
      </div>
    </div>
  );
}
