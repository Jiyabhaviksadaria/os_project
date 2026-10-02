'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, ArrowLeft, TrendingUp, Activity, Clock, Warehouse, Cpu } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useSimulation } from '@/lib/useSimulation';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from 'recharts';

import { WorkerInfo } from '@/lib/simulation/types';

export default function AnalyticsPage() {
  const { stats, analyticsHistory, producers, consumers } = useSimulation();

  const producerBarData = producers.map((p: WorkerInfo) => ({
    name: p.name,
    produced: p.count,
  }));

  const consumerBarData = consumers.map((c: WorkerInfo) => ({
    name: c.name,
    delivered: c.count,
  }));

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
            <span>Real-Time OS Analytics</span>
          </div>

          <h1 className="text-3xl font-black text-white font-mono flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-amber-500" />
            Simulation Performance Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Live metric tracking for production throughput, consumer delivery rates, buffer occupancy trends, and mutex contention frequency.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-navy-900/90 border border-navy-800 p-4 rounded-xl">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Items Processed</span>
            <div className="text-2xl font-black text-white font-mono mt-1">{stats.totalProduced}</div>
          </div>
          <div className="bg-navy-900/90 border border-navy-800 p-4 rounded-xl">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Delivered</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{stats.totalConsumed}</div>
          </div>
          <div className="bg-navy-900/90 border border-navy-800 p-4 rounded-xl">
            <span className="text-xs font-mono text-slate-400 uppercase">Producer Wait Events</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">{stats.producerWaitCount}</div>
          </div>
          <div className="bg-navy-900/90 border border-navy-800 p-4 rounded-xl">
            <span className="text-xs font-mono text-slate-400 uppercase">Consumer Wait Events</span>
            <div className="text-2xl font-black text-purple-400 font-mono mt-1">{stats.consumerWaitCount}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Chart 1: Throughput Timeline */}
          <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Produced vs Consumed Over Time
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsHistory}>
                  <defs>
                    <linearGradient id="producedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="consumedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="produced" stroke="#f59e0b" fillOpacity={1} fill="url(#producedGrad)" name="Produced" />
                  <Area type="monotone" dataKey="consumed" stroke="#10b981" fillOpacity={1} fill="url(#consumedGrad)" name="Consumed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Buffer Occupancy Timeline */}
          <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-blue-400" />
              Buffer Occupancy Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="occupied" stroke="#3b82f6" strokeWidth={2} name="Occupied Slots" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Producer Breakdown */}
          <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">
              Producer Worker Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={producerBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="produced" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Parcels Produced" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Consumer Breakdown */}
          <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">
              Consumer Fleet Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumerBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="delivered" fill="#a855f7" radius={[4, 4, 0, 0]} name="Parcels Delivered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
