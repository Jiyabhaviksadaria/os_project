'use client';

import React from 'react';
import { Parcel } from '@/lib/simulation/types';
import { Package, Tag, MapPin, Scale, Clock, Laptop, Shirt, Utensils, Pill, FileText } from 'lucide-react';

interface ParcelCardProps {
  parcel: Parcel;
}

export function ParcelCard({ parcel }: ParcelCardProps) {
  const getTypeIcon = () => {
    switch (parcel.type) {
      case 'Electronics':
        return <Laptop className="w-3.5 h-3.5 text-blue-400" />;
      case 'Clothing':
        return <Shirt className="w-3.5 h-3.5 text-purple-400" />;
      case 'Food':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'Medicine':
        return <Pill className="w-3.5 h-3.5 text-red-400" />;
      case 'Documents':
      default:
        return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getPriorityBadge = () => {
    switch (parcel.priority) {
      case 'EXPRESS':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
            EXPRESS
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            HIGH
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            NORMAL
          </span>
        );
    }
  };

  return (
    <div className="bg-navy-950 border border-amber-500/40 rounded-xl p-3 shadow-lg relative overflow-hidden group hover:border-amber-400 transition transform hover:-translate-y-0.5">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-navy-800 pb-2 mb-2 font-mono">
        <div className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black text-white">#{parcel.id}</span>
        </div>
        {getPriorityBadge()}
      </div>

      {/* Content */}
      <div className="space-y-1.5 font-sans text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Sender:</span>
          <span className="font-semibold text-slate-200">{parcel.sender}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
            {getTypeIcon()}
            {parcel.type}
          </span>
          <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
            <Scale className="w-3 h-3 text-slate-500" />
            {parcel.weight} kg
          </span>
        </div>

        <div className="flex items-center justify-between text-amber-300 bg-navy-900/80 px-2 py-1 rounded border border-navy-800 font-mono text-[11px] mt-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            {parcel.destination}
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {parcel.createdAt}
          </span>
        </div>
      </div>
    </div>
  );
}
