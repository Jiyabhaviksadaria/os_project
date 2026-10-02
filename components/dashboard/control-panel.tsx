'use client';

import React from 'react';
import { Play, Pause, RotateCcw, Square, GraduationCap, Sliders, Zap, Users, Warehouse } from 'lucide-react';
import { SimulationConfig, SimulationStatus } from '@/lib/simulation/types';

interface ControlPanelProps {
  status: SimulationStatus;
  config: SimulationConfig;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onRunDemoMode: () => void;
  onUpdateConfig: (newConfig: Partial<SimulationConfig>) => void;
}

export function ControlPanel({
  status,
  config,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onRunDemoMode,
  onUpdateConfig,
}: ControlPanelProps) {
  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 mb-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              SIMULATION CONTROLS
            </h2>
            <p className="text-xs text-slate-400">
              Real-time speed, buffer capacity, and process configuration
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {status === 'STOPPED' && (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs transition"
            >
              <Play className="w-4 h-4 fill-navy-950" />
              <span>START</span>
            </button>
          )}

          {status === 'RUNNING' && (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs transition"
            >
              <Pause className="w-4 h-4 fill-navy-950" />
              <span>PAUSE</span>
            </button>
          )}

          {status === 'PAUSED' && (
            <button
              onClick={onResume}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs transition"
            >
              <Play className="w-4 h-4 fill-navy-950" />
              <span>RESUME</span>
            </button>
          )}

          {(status === 'RUNNING' || status === 'PAUSED') && (
            <button
              onClick={onStop}
              className="flex items-center gap-2 px-3 py-2 bg-navy-800 hover:bg-red-500/20 text-red-400 border border-navy-700 hover:border-red-500/40 rounded-xl text-xs font-semibold transition"
            >
              <Square className="w-4 h-4" />
              <span>STOP</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 rounded-xl text-xs font-semibold transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>RESET</span>
          </button>

          <button
            onClick={onRunDemoMode}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-navy-950 font-black rounded-xl shadow-lg shadow-amber-500/20 text-xs transition"
          >
            <GraduationCap className="w-4 h-4" />
            <span>🎓 DEMO MODE</span>
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 font-mono text-xs">
        {/* Buffer Capacity */}
        <div className="bg-navy-950/60 p-3 rounded-xl border border-navy-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Warehouse className="w-3.5 h-3.5 text-blue-400" />
              Buffer Capacity
            </label>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded font-bold">
              {config.capacity} slots
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={16}
            value={config.capacity}
            onChange={(e) => onUpdateConfig({ capacity: parseInt(e.target.value) })}
            className="w-full accent-blue-500 bg-navy-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>4 slots</span>
            <span>16 slots</span>
          </div>
        </div>

        {/* Producers Count */}
        <div className="bg-navy-950/60 p-3 rounded-xl border border-navy-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Producers
            </label>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded font-bold">
              {config.producerCount} workers
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            value={config.producerCount}
            onChange={(e) => onUpdateConfig({ producerCount: parseInt(e.target.value) })}
            className="w-full accent-amber-500 bg-navy-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>1</span>
            <span>6 workers</span>
          </div>
        </div>

        {/* Consumers Count */}
        <div className="bg-navy-950/60 p-3 rounded-xl border border-navy-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              Consumers
            </label>
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded font-bold">
              {config.consumerCount} workers
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            value={config.consumerCount}
            onChange={(e) => onUpdateConfig({ consumerCount: parseInt(e.target.value) })}
            className="w-full accent-purple-500 bg-navy-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>1</span>
            <span>6 workers</span>
          </div>
        </div>

        {/* Production Delay Slider */}
        <div className="bg-navy-950/60 p-3 rounded-xl border border-navy-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Producer Delay
            </label>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded font-bold">
              {(config.productionDelayMs / 1000).toFixed(1)}s
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={5000}
            step={250}
            value={config.productionDelayMs}
            onChange={(e) => onUpdateConfig({ productionDelayMs: parseInt(e.target.value) })}
            className="w-full accent-amber-500 bg-navy-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.5s (Fast)</span>
            <span>5.0s (Slow)</span>
          </div>
        </div>

        {/* Consumption Delay Slider */}
        <div className="bg-navy-950/60 p-3 rounded-xl border border-navy-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Consumer Delay
            </label>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-bold">
              {(config.consumptionDelayMs / 1000).toFixed(1)}s
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={5000}
            step={250}
            value={config.consumptionDelayMs}
            onChange={(e) => onUpdateConfig({ consumptionDelayMs: parseInt(e.target.value) })}
            className="w-full accent-emerald-500 bg-navy-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.5s (Fast)</span>
            <span>5.0s (Slow)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
