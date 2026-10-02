'use client';

import React from 'react';
import { WorkerInfo } from '@/lib/simulation/types';
import { Truck, HelpCircle, AlertCircle, MapPin } from 'lucide-react';

interface ConsumerPanelProps {
  consumers: WorkerInfo[];
  onOpenVivaModal: (conceptKey: string) => void;
}

export function ConsumerPanel({ consumers, onOpenVivaModal }: ConsumerPanelProps) {
  const getStatusBadge = (state: WorkerInfo['state']) => {
    switch (state) {
      case 'PROCESSING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            🚚 PROCESSING
          </span>
        );
      case 'DELIVERING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            🚚 DELIVERING
          </span>
        );
      case 'WAITING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
            ⏸ WAITING
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
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                CONSUMER FLEET ({consumers.length})
              </h3>
              <button
                onClick={() => onOpenVivaModal('producer_consumer')}
                className="text-slate-400 hover:text-amber-400 transition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Picks parcels from buffer and signals empty semaphores</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 font-mono">
        {consumers.map((cons) => (
          <div
            key={cons.id}
            className={`p-3.5 rounded-xl border transition ${
              cons.state === 'WAITING'
                ? 'bg-amber-950/20 border-amber-500/40'
                : cons.state === 'DELIVERING'
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-navy-950/70 border-navy-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{cons.name}</span>
                <span className="text-[10px] text-slate-400">({cons.count} delivered)</span>
              </div>
              {getStatusBadge(cons.state)}
            </div>

            <div className="text-xs text-slate-300 font-sans mb-1.5 flex items-center gap-1.5">
              <span className="text-purple-400 font-mono">Action:</span>
              <span className="font-medium text-slate-200">{cons.currentAction}</span>
            </div>

            {cons.currentParcel && (
              <div className="p-2 rounded bg-navy-900 border border-navy-800 text-[11px] text-emerald-300 flex items-center justify-between mt-1 font-mono">
                <span>Parcel #{cons.currentParcel.id}</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {cons.currentParcel.destination}
                </span>
              </div>
            )}

            {cons.waitingReason && (
              <div className="p-2 rounded bg-navy-900 border border-navy-800 text-[11px] text-amber-400 flex items-start gap-1.5 mt-1 font-sans">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Wait Reason:</strong> {cons.waitingReason}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
