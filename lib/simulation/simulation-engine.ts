import {
  SimulationConfig,
  SimulationStatus,
  SimulationStats,
  LogEntry,
  LogCategory,
  AnalyticsPoint,
  WorkerInfo,
  BufferSlot,
  SemaphoreState,
  MutexState,
} from './types';
import { AsyncSemaphore } from './semaphore';
import { AsyncMutex } from './mutex';
import { CircularBoundedBuffer, resetParcelSequence } from './buffer';
import { ProducerWorker } from './producer';
import { ConsumerWorker } from './consumer';

export class SimulationEngine {
  private static instance: SimulationEngine;

  private config: SimulationConfig = {
    capacity: 8,
    producerCount: 3,
    consumerCount: 3,
    productionDelayMs: 1500,
    consumptionDelayMs: 2000,
    isDemoMode: false,
  };

  private status: SimulationStatus = 'STOPPED';

  private buffer: CircularBoundedBuffer;
  private emptySlots: AsyncSemaphore;
  private fullSlots: AsyncSemaphore;
  private mutex: AsyncMutex;

  private producers: ProducerWorker[] = [];
  private consumers: ConsumerWorker[] = [];

  private logs: LogEntry[] = [];
  private analyticsHistory: AnalyticsPoint[] = [];

  private totalProducedCount: number = 0;
  private totalConsumedCount: number = 0;
  private producerWaitEvents: number = 0;
  private consumerWaitEvents: number = 0;
  private mutexContentionEvents: number = 0;

  private startTime: number | null = null;
  private analyticsTimer: NodeJS.Timeout | null = null;
  private demoTimer: NodeJS.Timeout | null = null;

  private listeners: Set<() => void> = new Set();
  private cachedState: any = null;
  private isDirty: boolean = true;

  private constructor() {
    this.buffer = new CircularBoundedBuffer(this.config.capacity);
    this.emptySlots = new AsyncSemaphore('EMPTY', this.config.capacity);
    this.fullSlots = new AsyncSemaphore('FULL', 0);
    this.mutex = new AsyncMutex();

    this.emptySlots.onChange(() => this.notify());
    this.fullSlots.onChange(() => this.notify());
    this.mutex.onChange(() => this.notify());

    this.setupWorkers();
  }

  public static getInstance(): SimulationEngine {
    if (!SimulationEngine.instance) {
      SimulationEngine.instance = new SimulationEngine();
    }
    return SimulationEngine.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.isDirty = true;
    this.listeners.forEach((listener) => listener());
  }

  private setupWorkers() {
    // Clean up existing
    this.producers.forEach((p) => p.stop());
    this.consumers.forEach((c) => c.stop());

    this.producers = [];
    for (let i = 1; i <= this.config.producerCount; i++) {
      this.producers.push(new ProducerWorker(`prod-${i}`, `Producer ${i}`));
    }

    this.consumers = [];
    for (let i = 1; i <= this.config.consumerCount; i++) {
      this.consumers.push(new ConsumerWorker(`cons-${i}`, `Consumer ${i}`));
    }
  }

  public start() {
    if (this.status === 'RUNNING') return;

    if (this.status === 'PAUSED') {
      this.resume();
      return;
    }

    this.status = 'RUNNING';
    this.startTime = Date.now();
    this.addLog('SYSTEM', '🚀 Simulation started');

    const checkCanProceed = () => this.status === 'RUNNING';

    // Start all Producers
    this.producers.forEach((p) => {
      p.start(
        this.emptySlots,
        this.fullSlots,
        this.mutex,
        this.buffer,
        () => this.config.productionDelayMs,
        checkCanProceed,
        (cat, msg, det, pid) => this.handleWorkerLog(cat, msg, det, p.id, pid),
        () => this.notify()
      );
    });

    // Start all Consumers
    this.consumers.forEach((c) => {
      c.start(
        this.emptySlots,
        this.fullSlots,
        this.mutex,
        this.buffer,
        () => this.config.consumptionDelayMs,
        checkCanProceed,
        (cat, msg, det, pid) => this.handleWorkerLog(cat, msg, det, c.id, pid),
        () => this.notify()
      );
    });

    this.startAnalyticsRecording();
    this.notify();
  }

  public pause() {
    if (this.status !== 'RUNNING') return;

    this.status = 'PAUSED';
    this.producers.forEach((p) => p.pause());
    this.consumers.forEach((c) => c.pause());

    if (this.analyticsTimer) {
      clearInterval(this.analyticsTimer);
      this.analyticsTimer = null;
    }

    this.addLog('SYSTEM', '⏸ Simulation paused');
    this.notify();
  }

  public resume() {
    if (this.status !== 'PAUSED') return;

    this.status = 'RUNNING';
    this.producers.forEach((p) => p.resume());
    this.consumers.forEach((c) => c.resume());

    this.startAnalyticsRecording();
    this.addLog('SYSTEM', '▶ Simulation resumed');
    this.notify();
  }

  public stop() {
    this.status = 'STOPPED';
    this.producers.forEach((p) => p.stop());
    this.consumers.forEach((c) => c.stop());

    if (this.analyticsTimer) {
      clearInterval(this.analyticsTimer);
      this.analyticsTimer = null;
    }
    if (this.demoTimer) {
      clearTimeout(this.demoTimer);
      this.demoTimer = null;
    }

    this.addLog('SYSTEM', '⏹ Simulation stopped');
    this.notify();
  }

  public reset() {
    this.stop();

    this.buffer.clear();
    this.buffer.resize(this.config.capacity);

    this.emptySlots.reset(this.config.capacity);
    this.fullSlots.reset(0);
    this.mutex.reset();

    this.totalProducedCount = 0;
    this.totalConsumedCount = 0;
    this.producerWaitEvents = 0;
    this.consumerWaitEvents = 0;
    this.mutexContentionEvents = 0;

    resetParcelSequence();
    this.logs = [];
    this.analyticsHistory = [];
    this.setupWorkers();

    this.addLog('SYSTEM', '↻ Simulation state reset to initial conditions');
    this.notify();
  }

  public setConfig(newConfig: Partial<SimulationConfig>) {
    const wasRunning = this.status === 'RUNNING';
    if (wasRunning) {
      this.stop();
    }

    this.config = { ...this.config, ...newConfig };

    // Update buffer capacity if changed
    this.buffer.resize(this.config.capacity);
    this.emptySlots.reset(this.config.capacity);
    this.fullSlots.reset(this.buffer.size());

    this.setupWorkers();
    this.addLog('SYSTEM', `⚙ Config updated: Capacity=${this.config.capacity}, Producers=${this.config.producerCount}, Consumers=${this.config.consumerCount}`);

    if (wasRunning) {
      this.start();
    } else {
      this.notify();
    }
  }

  public runDemoMode() {
    this.reset();
    this.config = {
      capacity: 5,
      producerCount: 2,
      consumerCount: 2,
      productionDelayMs: 1800,
      consumptionDelayMs: 2500,
      isDemoMode: true,
    };
    this.buffer.resize(5);
    this.emptySlots.reset(5);
    this.fullSlots.reset(0);
    this.setupWorkers();

    this.addLog('SYSTEM', '🎓 Demo Mode activated (Buffer: 5, Producers: 2, Consumers: 2)');
    this.start();
  }

  private handleWorkerLog(
    category: LogCategory,
    message: string,
    details?: string,
    workerId?: string,
    parcelId?: number
  ) {
    if (category === 'BUFFER' && message.includes('inserted')) {
      this.totalProducedCount++;
    } else if (category === 'BUFFER' && message.includes('picked up')) {
      this.totalConsumedCount++;
    } else if (category === 'SEMAPHORE' && message.includes('BLOCKED')) {
      this.producerWaitEvents++;
    } else if (category === 'SEMAPHORE' && message.includes('WAITING')) {
      this.consumerWaitEvents++;
    } else if (category === 'MUTEX' && message.includes('waiting')) {
      this.mutexContentionEvents++;
    }

    this.addLog(category, message, details, workerId, parcelId);
  }

  public addLog(
    category: LogCategory,
    message: string,
    details?: string,
    workerId?: string,
    parcelId?: number
  ) {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      category,
      message,
      details,
      workerId,
      parcelId,
    };
    this.logs.unshift(entry);
    if (this.logs.length > 200) {
      this.logs.pop();
    }
    this.notify();
  }

  public clearLogs() {
    this.logs = [];
    this.addLog('SYSTEM', 'Log history cleared');
    this.notify();
  }

  private startAnalyticsRecording() {
    if (this.analyticsTimer) clearInterval(this.analyticsTimer);

    this.analyticsTimer = setInterval(() => {
      if (this.status !== 'RUNNING') return;

      const elapsedSec = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
      const point: AnalyticsPoint = {
        timestamp: new Date().toLocaleTimeString(),
        timeSec: elapsedSec,
        produced: this.totalProducedCount,
        consumed: this.totalConsumedCount,
        occupancy: this.buffer.size(),
        emptySlots: this.config.capacity - this.buffer.size(),
        mutexContention: this.mutexContentionEvents,
        producerWaiters: this.emptySlots.getWaitingCount(),
        consumerWaiters: this.fullSlots.getWaitingCount(),
      };

      this.analyticsHistory.push(point);
      if (this.analyticsHistory.length > 60) {
        this.analyticsHistory.shift();
      }
      this.notify();
    }, 1500);
  }

  public getState() {
    if (!this.isDirty && this.cachedState) {
      return this.cachedState;
    }

    const occupied = this.buffer.size();
    const emptyCount = this.config.capacity - occupied;

    const producerInfos = this.producers.map((p) => p.getInfo());
    const consumerInfos = this.consumers.map((c) => c.getInfo());

    const activeProducersCount = producerInfos.filter((p) => p.state === 'ACTIVE' || p.state === 'PRODUCING').length;
    const activeConsumersCount = consumerInfos.filter((c) => c.state === 'PROCESSING' || c.state === 'DELIVERING').length;

    const stats: SimulationStats = {
      totalProduced: this.totalProducedCount,
      totalConsumed: this.totalConsumedCount,
      bufferCapacity: this.config.capacity,
      occupiedSlots: occupied,
      emptySlotsCount: emptyCount,
      activeProducers: activeProducersCount,
      activeConsumers: activeConsumersCount,
      emptySemaphoreValue: this.emptySlots.getValue(),
      fullSemaphoreValue: this.fullSlots.getValue(),
      mutexLocked: this.mutex.isLocked(),
      mutexOwner: this.mutex.getOwnerName(),
      mutexWaitingCount: this.mutex.getWaitingCount(),
      producerWaitCount: this.producerWaitEvents,
      consumerWaitCount: this.consumerWaitEvents,
      mutexContentionCount: this.mutexContentionEvents,
      throughput: this.startTime ? parseFloat(((this.totalConsumedCount / Math.max(1, (Date.now() - this.startTime) / 1000)) * 60).toFixed(1)) : 0,
      averageProcessingTimeMs: this.config.consumptionDelayMs,
      averageWaitTimeMs: Math.round(this.config.productionDelayMs * 0.4),
    };

    this.cachedState = {
      status: this.status,
      config: { ...this.config },
      bufferSlots: this.buffer.getSlots(),
      producers: producerInfos,
      consumers: consumerInfos,
      emptySemaphore: this.emptySlots.getState(),
      fullSemaphore: this.fullSlots.getState(),
      mutex: this.mutex.getState(),
      stats,
      logs: [...this.logs],
      analyticsHistory: [...this.analyticsHistory],
    };
    this.isDirty = false;

    return this.cachedState;
  }
}
