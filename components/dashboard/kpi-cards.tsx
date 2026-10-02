'use client';

import React from 'react';
import { PackageCheck, Truck, Warehouse, CheckCircle2, UserCheck, Activity, Layers } from 'lucide-react';
import { SimulationStats } from '@/lib/simulation/types';

interface KPICardsProps {
  stats: SimulationStats;
  onOpenVivaModal: (conceptKey: string) => void;
}

export function KPICards({ stats, onOpenVivaModal }: KPICardsProps) {
  const cards = [
    {
      label: 'TOTAL PRODUCED',
      value: stats.totalProduced,
      subtext: 'Parcels inserted into buffer',
      icon: PackageCheck,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      conceptKey: 'producer_consumer',
    },
    {
      label: 'TOTAL CONSUMED',
      value: stats.totalConsumed,
      subtext: 'Parcels delivered by fleet',
      icon: Truck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      conceptKey: 'producer_consumer',
    },
    {
      label: 'BUFFER OCCUPANCY',
      value: `${stats.occupiedSlots} / ${stats.bufferCapacity}`,
      subtext: stats.occupiedSlots === stats.bufferCapacity ? '⚠️ BUFFER FULL' : `${stats.emptySlotsCount} slots empty`,
      icon: Warehouse,
      color: stats.occupiedSlots === stats.bufferCapacity ? 'text-red-400' : 'text-blue-400',
      bgColor: stats.occupiedSlots === stats.bufferCapacity ? 'bg-red-500/15 border-red-500/30' : 'bg-blue-500/10 border-blue-500/20',
      conceptKey: 'bounded_buffer',
    },
    {
      label: 'EMPTY SLOTS',
      value: stats.emptySlotsCount,
      subtext: 'EMPTY semaphore value',
      icon: Layers,
      color: stats.emptySlotsCount === 0 ? 'text-red-400' : 'text-emerald-400',
      bgColor: stats.emptySlotsCount === 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20',
      conceptKey: 'empty_semaphore',
    },
    {
      label: 'ACTIVE PRODUCERS',
      value: stats.activeProducers,
      subtext: `${stats.producerWaitCount} wait events recorded`,
      icon: UserCheck,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      conceptKey: 'producer_consumer',
    },
    {
      label: 'ACTIVE CONSUMERS',
      value: stats.activeConsumers,
      subtext: `${stats.consumerWaitCount} wait events recorded`,
      icon: UserCheck,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      conceptKey: 'producer_consumer',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => onOpenVivaModal(card.conceptKey)}
            className={`p-3.5 rounded-xl border ${card.bgColor} backdrop-blur shadow-md hover:scale-[1.02] transition cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                {card.label}
              </span>
              <Icon className={`w-4 h-4 ${card.color} group-hover:rotate-12 transition-transform`} />
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {card.value}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 font-sans truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
