'use client';

import React from 'react';
import Link from 'next/link';
import { Play, BookOpen, ArrowRight, ShieldCheck, Lock, Binary, Cpu, AlertTriangle, BarChart2, PackageCheck, Truck } from 'lucide-react';

interface HeroPipelineProps {
  onStartSimulation: () => void;
}

export function HeroPipeline({ onStartSimulation }: HeroPipelineProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 border-b border-navy-800 py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Cpu className="w-4 h-4 text-amber-500" />
            Operating Systems Coursework & Viva Demonstration
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 font-mono">
            📬 <span className="text-amber-400">ParcelHub</span> Simulator
          </h1>
          <p className="text-lg sm:text-xl text-amber-200/90 font-medium mb-3">
            Visualize Operating System Synchronization in Action
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An interactive, event-driven logical simulation of the classic Producer–Consumer problem using bounded buffers, counting semaphores, mutex locks, and concurrent async workers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <button
              onClick={onStartSimulation}
              className="flex items-center gap-2.5 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-navy-950" />
              <span>Start Simulation</span>
            </button>

            <Link
              href="/learn"
              className="flex items-center gap-2.5 px-6 py-3 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-xl border border-navy-700 transition"
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Learn OS Concepts</span>
            </Link>
          </div>
        </div>

        {/* Visual Synchronization Pipeline */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-6 shadow-2xl mb-10">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-6">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Producer–Consumer Operating System Synchronization Pipeline
            </h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 font-mono">
              FIFO Bounded Buffer Flow
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center">
            {/* 1. Producer */}
            <div className="p-4 bg-navy-950 border border-amber-500/30 rounded-xl shadow-md">
              <PackageCheck className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white uppercase font-mono">PRODUCERS</div>
              <p className="text-[11px] text-slate-400 mt-1">Generates Parcel #ID</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-500">
              <ArrowRight className="w-6 h-6 animate-pulse text-amber-400" />
            </div>

            {/* 2. Empty Semaphore */}
            <div className="p-4 bg-navy-950 border border-blue-500/30 rounded-xl shadow-md">
              <Binary className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white uppercase font-mono">EMPTY SEMAPHORE</div>
              <p className="text-[11px] text-slate-400 mt-1">wait(empty) → Blocks if 0</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-500">
              <ArrowRight className="w-6 h-6 animate-pulse text-amber-400" />
            </div>

            {/* 3. Mutex & Buffer */}
            <div className="p-4 bg-navy-950 border border-emerald-500/40 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-navy-950 text-[9px] font-extrabold px-2 py-0.5 rounded-bl">
                CRITICAL SECTION
              </div>
              <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white uppercase font-mono">BOUNDED BUFFER</div>
              <p className="text-[11px] text-slate-400 mt-1">Mutex Protected Queue</p>
            </div>

            <div className="hidden md:flex justify-center text-slate-500">
              <ArrowRight className="w-6 h-6 animate-pulse text-amber-400" />
            </div>

            {/* 4. Full Semaphore & Consumer */}
            <div className="p-4 bg-navy-950 border border-amber-500/30 rounded-xl shadow-md">
              <Truck className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white uppercase font-mono">CONSUMERS</div>
              <p className="text-[11px] text-slate-400 mt-1">signal(empty) → Picks Parcel</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-navy-900/60 border border-navy-800 p-4 rounded-xl hover:border-amber-500/40 transition">
            <PackageCheck className="w-6 h-6 text-amber-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Bounded Buffer</h4>
            <p className="text-xs text-slate-400 mt-1">Fixed capacity circular queue with safe pointers.</p>
          </div>

          <div className="bg-navy-900/60 border border-navy-800 p-4 rounded-xl hover:border-blue-500/40 transition">
            <Lock className="w-6 h-6 text-blue-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Mutex Lock</h4>
            <p className="text-xs text-slate-400 mt-1">Strict single-worker critical section access.</p>
          </div>

          <div className="bg-navy-900/60 border border-navy-800 p-4 rounded-xl hover:border-emerald-500/40 transition">
            <Binary className="w-6 h-6 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Semaphores</h4>
            <p className="text-xs text-slate-400 mt-1">Empty and Full counting semaphores for blocking.</p>
          </div>

          <div className="bg-navy-900/60 border border-navy-800 p-4 rounded-xl hover:border-amber-500/40 transition">
            <Cpu className="w-6 h-6 text-amber-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Workers</h4>
            <p className="text-xs text-slate-400 mt-1">Independent concurrent producers & consumers.</p>
          </div>

          <div className="bg-navy-900/60 border border-navy-800 p-4 rounded-xl hover:border-red-500/40 transition">
            <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Race Lab</h4>
            <p className="text-xs text-slate-400 mt-1">Compare unsynchronized vs synchronized runs.</p>
          </div>

          <div className="bg-navy-900/60 border border-navy-800 p-4 rounded-xl hover:border-purple-500/40 transition">
            <BarChart2 className="w-6 h-6 text-purple-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Analytics</h4>
            <p className="text-xs text-slate-400 mt-1">Live metrics, throughput & occupancy charts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
