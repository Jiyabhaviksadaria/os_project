'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck, Play, RotateCcw, ArrowLeft, Lock, Unlock, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

interface ExecutionStep {
  step: number;
  time: string;
  worker: string;
  action: string;
  slotIndex: number;
  writtenValue: string;
  isConflict: boolean;
}

export default function RaceConditionPage() {
  const [unsyncTrace, setUnsyncTrace] = useState<ExecutionStep[]>([]);
  const [syncTrace, setSyncTrace] = useState<ExecutionStep[]>([]);
  const [isRunningUnsync, setIsRunningUnsync] = useState(false);
  const [isRunningSync, setIsRunningSync] = useState(false);

  const runUnsynchronizedDemo = () => {
    setIsRunningUnsync(true);
    setUnsyncTrace([]);

    const steps: ExecutionStep[] = [
      { step: 1, time: '14:30:01.100', worker: 'Producer 1', action: 'Reads Buffer Tail Pointer', slotIndex: 3, writtenValue: 'Read Tail = 3', isConflict: false },
      { step: 2, time: '14:30:01.102', worker: 'Producer 2', action: 'Reads Buffer Tail Pointer (Preemption occurs!)', slotIndex: 3, writtenValue: 'Read Tail = 3', isConflict: true },
      { step: 3, time: '14:30:01.105', worker: 'Producer 1', action: 'Writes Parcel #105 into Slot [3]', slotIndex: 3, writtenValue: 'Parcel #105 (Amazon)', isConflict: false },
      { step: 4, time: '14:30:01.108', worker: 'Producer 2', action: 'Writes Parcel #106 into Slot [3] (OVERWRITES!)', slotIndex: 3, writtenValue: 'Parcel #106 (Flipkart)', isConflict: true },
      { step: 5, time: '14:30:01.110', worker: 'Producer 1', action: 'Increments buffer count (Count = 4)', slotIndex: 3, writtenValue: 'Count = 4', isConflict: false },
      { step: 6, time: '14:30:01.112', worker: 'Producer 2', action: 'Increments buffer count (Count = 5!)', slotIndex: 3, writtenValue: 'Count = 5 (Inconsistent!)', isConflict: true },
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setUnsyncTrace((prev) => [...prev, s]);
        if (idx === steps.length - 1) {
          setIsRunningUnsync(false);
        }
      }, (idx + 1) * 600);
    });
  };

  const runSynchronizedDemo = () => {
    setIsRunningSync(true);
    setSyncTrace([]);

    const steps: ExecutionStep[] = [
      { step: 1, time: '14:30:01.100', worker: 'Producer 1', action: 'wait(empty_slots) → Permit acquired', slotIndex: 3, writtenValue: 'EMPTY = 4', isConflict: false },
      { step: 2, time: '14:30:01.102', worker: 'Producer 1', action: 'acquire(MUTEX) → Lock acquired 🔒', slotIndex: 3, writtenValue: 'Mutex Locked by Producer 1', isConflict: false },
      { step: 3, time: '14:30:01.104', worker: 'Producer 2', action: 'Attempts acquire(MUTEX) → BLOCKED in queue ⏸', slotIndex: 3, writtenValue: 'Producer 2 Queued', isConflict: false },
      { step: 4, time: '14:30:01.106', worker: 'Producer 1', action: 'Writes Parcel #105 into Slot [3] safely', slotIndex: 3, writtenValue: 'Parcel #105 (Amazon)', isConflict: false },
      { step: 5, time: '14:30:01.108', worker: 'Producer 1', action: 'release(MUTEX) 🔓 & signal(full_slots)', slotIndex: 3, writtenValue: 'Mutex Released', isConflict: false },
      { step: 6, time: '14:30:01.110', worker: 'Producer 2', action: 'Woken up → acquire(MUTEX) → Writes to Slot [4]', slotIndex: 4, writtenValue: 'Parcel #106 (Flipkart)', isConflict: false },
      { step: 7, time: '14:30:01.112', worker: 'Producer 2', action: 'release(MUTEX) 🔓 & signal(full_slots)', slotIndex: 4, writtenValue: '100% Data Integrity Guaranteed', isConflict: false },
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setSyncTrace((prev) => [...prev, s]);
        if (idx === steps.length - 1) {
          setIsRunningSync(false);
        }
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        status="STOPPED"
        isPresentationMode={false}
        onTogglePresentationMode={() => {}}
        onOpenVivaModal={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-navy-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
            <span>/</span>
            <span>OS Concurrency Laboratory</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white font-mono flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
                Race Condition Laboratory
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Controlled conceptual simulation comparing unsynchronized shared memory modification vs synchronized Mutex & Semaphore protection.
              </p>
            </div>

            <div className="bg-navy-900 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-mono text-amber-400">
              ⚡ Note: Logical Concurrency Simulator
            </div>
          </div>
        </div>

        {/* Experiment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* MODE A: UN-SYNCHRONIZED */}
          <div className="bg-navy-900/90 border border-red-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-4 font-mono">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <XCircle className="w-5 h-5" />
                  <span>MODE A: WITHOUT SYNCHRONIZATION</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-bold">
                  HAZARD DEMO
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans">
                Producers 1 and 2 concurrently write to the shared warehouse buffer without Mutex locking or Semaphore checks.
              </p>

              {/* Action Button */}
              <button
                onClick={runUnsynchronizedDemo}
                disabled={isRunningUnsync}
                className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-navy-950 font-bold rounded-xl text-xs font-mono transition flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-navy-950" />
                <span>{isRunningUnsync ? 'RUNNING EXPERIMENT...' : 'RUN UNSYNCHRONIZED EXPERIMENT'}</span>
              </button>

              {/* Execution Trace */}
              <div className="space-y-2 max-h-72 overflow-y-auto font-mono text-xs bg-navy-950 p-3 rounded-xl border border-navy-800">
                {unsyncTrace.length === 0 ? (
                  <div className="text-slate-600 italic text-center py-6 font-sans">
                    Click button above to simulate concurrent unsynchronized writes.
                  </div>
                ) : (
                  unsyncTrace.map((t) => (
                    <div
                      key={t.step}
                      className={`p-2 rounded border text-[11px] ${
                        t.isConflict
                          ? 'bg-red-950/40 border-red-500/50 text-red-300 animate-pulse'
                          : 'bg-navy-900 border-navy-800 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                        <span>{t.time}</span>
                        <span>{t.worker}</span>
                      </div>
                      <p className="font-bold">{t.action}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Value: {t.writtenValue}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Result Alert */}
            {unsyncTrace.some((t) => t.isConflict) && (
              <div className="mt-4 p-3.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-xs font-mono flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 shrink-0 text-red-400 animate-bounce" />
                <div>
                  <strong>⚠️ RACE CONDITION DETECTED!</strong>
                  <p className="text-[11px] text-red-300 mt-0.5 font-sans">
                    Parcel #105 was overwritten by Parcel #106 in Slot [3]. Buffer count updated twice incorrectly.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* MODE B: SYNCHRONIZED */}
          <div className="bg-navy-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-4 font-mono">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>MODE B: WITH SYNCHRONIZATION</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                  SAFE PROTOCOL
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans">
                Producers execute strict Semaphore wait() and Mutex acquire() before accessing the critical section.
              </p>

              {/* Action Button */}
              <button
                onClick={runSynchronizedDemo}
                disabled={isRunningSync}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold rounded-xl text-xs font-mono transition flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-navy-950" />
                <span>{isRunningSync ? 'RUNNING EXPERIMENT...' : 'RUN SYNCHRONIZED EXPERIMENT'}</span>
              </button>

              {/* Execution Trace */}
              <div className="space-y-2 max-h-72 overflow-y-auto font-mono text-xs bg-navy-950 p-3 rounded-xl border border-navy-800">
                {syncTrace.length === 0 ? (
                  <div className="text-slate-600 italic text-center py-6 font-sans">
                    Click button above to simulate Mutex & Semaphore synchronization.
                  </div>
                ) : (
                  syncTrace.map((t) => (
                    <div
                      key={t.step}
                      className="p-2 rounded border bg-navy-900 border-navy-800 text-slate-300 text-[11px]"
                    >
                      <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                        <span>{t.time}</span>
                        <span>{t.worker}</span>
                      </div>
                      <p className="font-bold text-emerald-300">{t.action}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Status: {t.writtenValue}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Result Alert */}
            {syncTrace.length === 7 && (
              <div className="mt-4 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-mono flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-400" />
                <div>
                  <strong>✅ RACE CONDITION PREVENTED!</strong>
                  <p className="text-[11px] text-emerald-300 mt-0.5 font-sans">
                    Mutex lock guaranteed exclusive access. Producer 2 waited in queue until Producer 1 finished. Zero data loss.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
