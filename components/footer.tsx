'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Github, BookOpen, ShieldCheck, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-navy-950 rounded-lg font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span>📬 ParcelHub</span>
              <span className="text-[10px] text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                OS College Project
              </span>
            </div>
            <p className="text-slate-500 text-[11px] font-sans">
              Interactive Producer–Consumer Process Synchronization Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/learn" className="hover:text-amber-400 transition flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>OS Concepts</span>
          </Link>

          <Link href="/race-condition" className="hover:text-amber-400 transition flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Race Condition Lab</span>
          </Link>

          <Link href="/analytics" className="hover:text-amber-400 transition flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </Link>
        </div>

        <div className="text-right text-[11px] text-slate-500 font-sans">
          <p>Built with Next.js 14, TypeScript & Tailwind CSS</p>
          <p className="text-slate-600 font-mono mt-0.5">POSIX C implementation in /c-implementation</p>
        </div>
      </div>
    </footer>
  );
}
