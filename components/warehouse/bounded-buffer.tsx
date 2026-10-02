'use client';

import React from 'react';
import { BufferSlot } from '@/lib/simulation/types';
import { ParcelCard } from './parcel-card';
import { Warehouse, ArrowDown, ArrowUp, HelpCircle, Layers } from 'lucide-react';

interface BoundedBufferProps {
  slots: BufferSlot[];
  capacity: number;
  onOpenVivaModal: (conceptKey: string) => void;
}

export function BoundedBuffer({ slots, capacity, onOpenVivaModal }: BoundedBufferProps) {
  const occupiedCount = slots.filter((s) => s.parcel !== null).length;
  const isFull = occupiedCount === capacity;
  const isEmpty = occupiedCount === 0;

  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-800 pb-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shadow-md">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-mono">
                BOUNDED BUFFER (CIRCULAR QUEUE WAREHOUSE)
              </h2>
              <button
                onClick={() => onOpenVivaModal('bounded_buffer')}
                className="text-slate-400 hover:text-amber-400 transition"
                title="Explain Bounded Buffer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Shared critical resource protected by Mutex lock and Counting Semaphores
            </p>
          </div>
        </div>

        {/* Capacity Indicator */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-800 flex items-center gap-2">
            <span className="text-slate-400">Slots Occupied:</span>
            <strong className={`font-black text-sm ${isFull ? 'text-red-400' : 'text-blue-400'}`}>
              {occupiedCount} / {capacity}
            </strong>
          </div>

          {isFull && (
            <span className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 font-bold animate-pulse">
              🔴 BUFFER FULL
            </span>
          )}

          {isEmpty && (
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              🟡 BUFFER EMPTY
            </span>
          )}
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {slots.map((slot) => {
          const isOccupied = slot.parcel !== null;

          return (
            <div
              key={slot.slotIndex}
              className="flex flex-col relative group"
            >
              {/* Slot Header / Pointer Index */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1 px-1">
                <span className="font-bold">SLOT [{slot.slotIndex}]</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOccupied ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'
                  }`}
                />
              </div>

              {/* Slot Box */}
              {isOccupied ? (
                <div className="transition-all duration-300 transform scale-100">
                  <ParcelCard parcel={slot.parcel!} />
                </div>
              ) : (
                <div className="h-32 bg-navy-950/60 border-2 border-dashed border-navy-800 hover:border-navy-700 rounded-xl p-4 flex flex-col items-center justify-center text-center transition">
                  <Layers className="w-6 h-6 text-slate-700 mb-2" />
                  <span className="text-xs font-bold text-slate-500 font-mono">EMPTY</span>
                  <span className="text-[10px] text-slate-600 mt-1 font-mono">Available Slot</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Queue Legend */}
      <div className="mt-5 pt-3 border-t border-navy-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Occupied Parcel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>Available Slot</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          FIFO order enforced: Producers insert at tail pointer, Consumers remove from head pointer.
        </p>
      </div>
    </div>
  );
}
