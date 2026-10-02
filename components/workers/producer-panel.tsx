'use client';

import React from 'react';
import { WorkerInfo } from '@/lib/simulation/types';
import { PackageCheck, HelpCircle, Lock, AlertCircle, Clock, Play } from 'lucide-react';

interface ProducerPanelProps {
  producers: WorkerInfo[];
  onOpenVivaModal: (conceptKey: string) => void;
}

export function ProducerPanel({ producers, onOpenVivaModal }: ProducerPanelProps) {
  const getStatusBadge = (state: WorkerInfo['state'], reason?: string) => {
    switch (state) {
      case 'PRODUCING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            PRODUCING
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 animate-bounce">
            🔴 BLOCKED
          </span>
        );
      case 'WAITING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            🔒 WAITING
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ● ACTIVE
          </span>
        );
      case 'IDLE':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            IDLE
          </span>
        );
    }
  };

  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                PRODUCER SYSTEM ({producers.length})
              </h3>
              <button
                onClick={() => onOpenVivaModal('producer_consumer')}
                className="text-slate-400 hover:text-amber-400 transition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Generates parcels and acquires empty slot semaphores</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 font-mono">
        {producers.map((prod) => (
          <div
            key={prod.id}
            className={`p-3.5 rounded-xl border transition ${
              prod.state === 'BLOCKED'
                ? 'bg-red-950/20 border-red-500/40'
                : prod.state === 'WAITING'
                ? 'bg-blue-950/20 border-blue-500/40'
                : 'bg-navy-950/70 border-navy-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{prod.name}</span>
                <span className="text-[10px] text-slate-400">({prod.count} parcels)</span>
              </div>
              {getStatusBadge(prod.state, prod.waitingReason)}
            </div>

            <div className="text-xs text-slate-300 font-sans mb-1.5 flex items-center gap-1.5">
              <span className="text-amber-400 font-mono">Action:</span>
              <span className="font-medium text-slate-200">{prod.currentAction}</span>
            </div>

            {prod.waitingReason && (
              <div className="p-2 rounded bg-navy-900 border border-navy-800 text-[11px] text-amber-400 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Wait Reason:</strong> {prod.waitingReason}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
