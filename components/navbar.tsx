'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Play, Pause, RotateCcw, Presentation, HelpCircle, Activity, BookOpen, AlertTriangle, BarChart3, ShieldCheck } from 'lucide-react';
import { SimulationStatus } from '@/lib/simulation/types';

interface NavbarProps {
  status: SimulationStatus;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  onOpenVivaModal: (conceptKey: string) => void;
}

export function Navbar({
  status,
  isPresentationMode,
  onTogglePresentationMode,
  onOpenVivaModal,
}: NavbarProps) {
  const pathname = usePathname();

  const getStatusBadge = () => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            RUNNING
          </span>
        );
      case 'PAUSED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            PAUSED
          </span>
        );
      case 'STOPPED':
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            STOPPED
          </span>
        );
    }
  };

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Activity },
    { href: '/learn', label: 'Learn OS', icon: BookOpen },
    { href: '/race-condition', label: 'Race Condition', icon: AlertTriangle },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (isPresentationMode) {
    return (
      <header className="bg-navy-950 border-b border-navy-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 text-navy-950 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20">
            <Package className="w-6 h-6 animate-bounce" />
            <span className="text-lg tracking-tight font-extrabold">ParcelHub</span>
          </div>
          <span className="text-xs uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-mono">
            PRESENTATION MODE 📸
          </span>
        </div>

        <div className="flex items-center gap-4">
          {getStatusBadge()}
          <button
            onClick={onTogglePresentationMode}
            className="flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 rounded-lg text-sm font-medium transition"
          >
            <Presentation className="w-4 h-4 text-amber-400" />
            Exit Presentation
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-navy-900/95 backdrop-blur border-b border-navy-800 px-4 lg:px-8 py-3.5 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 bg-amber-500 text-navy-950 rounded-xl font-bold transition group-hover:scale-105 shadow-lg shadow-amber-500/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-mono">
                  📬 ParcelHub
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded font-mono">
                  OS Simulator
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Producer–Consumer Process Synchronization
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 bg-navy-950/60 p-1.5 rounded-xl border border-navy-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-500 text-navy-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status & Viva / Presentation Actions */}
        <div className="flex items-center gap-3">
          {getStatusBadge()}

          <button
            onClick={() => onOpenVivaModal('producer_consumer')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 rounded-lg text-xs font-medium transition"
            title="Viva Q&A Help"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Viva Guide</span>
          </button>

          <button
            onClick={onTogglePresentationMode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
          >
            <Presentation className="w-4 h-4" />
            <span className="hidden sm:inline">Presentation Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
