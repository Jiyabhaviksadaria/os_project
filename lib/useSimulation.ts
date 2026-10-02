import { useState, useEffect, useSyncExternalStore } from 'react';
import { SimulationEngine } from './simulation/simulation-engine';

export function useSimulation() {
  const engine = SimulationEngine.getInstance();
  
  const state = useSyncExternalStore(
    (callback) => engine.subscribe(callback),
    () => engine.getState(),
    () => engine.getState()
  );

  return {
    ...state,
    start: () => engine.start(),
    pause: () => engine.pause(),
    resume: () => engine.resume(),
    stop: () => engine.stop(),
    reset: () => engine.reset(),
    setConfig: (config: Parameters<typeof engine.setConfig>[0]) => engine.setConfig(config),
    runDemoMode: () => engine.runDemoMode(),
    clearLogs: () => engine.clearLogs(),
  };
}
