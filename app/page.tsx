'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/lib/useSimulation';
import { Navbar } from '@/components/navbar';
import { HeroPipeline } from '@/components/hero-pipeline';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { SystemStatus } from '@/components/dashboard/system-status';
import { ControlPanel } from '@/components/dashboard/control-panel';
import { BoundedBuffer } from '@/components/warehouse/bounded-buffer';
import { ProducerPanel } from '@/components/workers/producer-panel';
import { ConsumerPanel } from '@/components/workers/consumer-panel';
import { SemaphorePanel } from '@/components/synchronization/semaphore-panel';
import { MutexPanel } from '@/components/synchronization/mutex-panel';
import { EventLog } from '@/components/logs/event-log';
import { VivaExplainModal } from '@/components/dashboard/viva-explain-modal';
import { Footer } from '@/components/footer';

export default function DashboardPage() {
  const {
    status,
    config,
    bufferSlots,
    producers,
    consumers,
    emptySemaphore,
    fullSemaphore,
    mutex,
    stats,
    logs,
    start,
    pause,
    resume,
    stop,
    reset,
    setConfig,
    runDemoMode,
    clearLogs,
  } = useSimulation();

  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [vivaConceptKey, setVivaConceptKey] = useState<string | null>(null);

  const handleOpenVivaModal = (conceptKey: string) => {
    setVivaConceptKey(conceptKey);
  };

  const handleCloseVivaModal = () => {
    setVivaConceptKey(null);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-navy-950">
      {/* Top Navbar */}
      <Navbar
        status={status}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        onOpenVivaModal={handleOpenVivaModal}
      />

      <main className="flex-1">
        {/* Hide Hero in Presentation Mode */}
        {!isPresentationMode && (
          <HeroPipeline onStartSimulation={start} />
        )}

        <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isPresentationMode ? 'max-w-full' : 'max-w-7xl'}`}>
          {/* KPI Cards */}
          <KPICards stats={stats} onOpenVivaModal={handleOpenVivaModal} />

          {/* System Health Status */}
          <SystemStatus stats={stats} onOpenVivaModal={handleOpenVivaModal} />

          {/* Simulation Control Panel */}
          <ControlPanel
            status={status}
            config={config}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onStop={stop}
            onReset={reset}
            onRunDemoMode={runDemoMode}
            onUpdateConfig={setConfig}
          />

          {/* Main Bounded Buffer Warehouse */}
          <BoundedBuffer
            slots={bufferSlots}
            capacity={config.capacity}
            onOpenVivaModal={handleOpenVivaModal}
          />

          {/* Synchronization Section: Semaphores & Mutex */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SemaphorePanel
              emptySemaphore={emptySemaphore}
              fullSemaphore={fullSemaphore}
              onOpenVivaModal={handleOpenVivaModal}
            />
            <MutexPanel
              mutex={mutex}
              onOpenVivaModal={handleOpenVivaModal}
            />
          </div>

          {/* Process Workers Section: Producers & Consumers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProducerPanel
              producers={producers}
              onOpenVivaModal={handleOpenVivaModal}
            />
            <ConsumerPanel
              consumers={consumers}
              onOpenVivaModal={handleOpenVivaModal}
            />
          </div>

          {/* Live Event Log */}
          <EventLog logs={logs} onClearLogs={clearLogs} />
        </div>
      </main>

      {/* Footer */}
      {!isPresentationMode && <Footer />}

      {/* Viva Explanation Modal */}
      <VivaExplainModal
        conceptKey={vivaConceptKey}
        onClose={handleCloseVivaModal}
      />
    </div>
  );
}
