import { describe, it, expect } from 'vitest';
import { AsyncSemaphore } from '../lib/simulation/semaphore';
import { AsyncMutex } from '../lib/simulation/mutex';
import { CircularBoundedBuffer, generateParcel } from '../lib/simulation/buffer';
import { SimulationEngine } from '../lib/simulation/simulation-engine';

describe('AsyncSemaphore Unit Tests', () => {
  it('should initialize with correct value', () => {
    const sem = new AsyncSemaphore('EMPTY', 5);
    expect(sem.getValue()).toBe(5);
    expect(sem.getWaitingCount()).toBe(0);
  });

  it('should decrement on wait() when positive', async () => {
    const sem = new AsyncSemaphore('EMPTY', 2);
    await sem.wait('worker-1', 'Worker 1');
    expect(sem.getValue()).toBe(1);
  });

  it('should block worker on wait() when value is 0', async () => {
    const sem = new AsyncSemaphore('EMPTY', 0);
    let resolved = false;

    const waitPromise = sem.wait('worker-1', 'Worker 1').then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);
    expect(sem.getWaitingCount()).toBe(1);

    sem.signal();
    await waitPromise;
    expect(resolved).toBe(true);
    expect(sem.getValue()).toBe(0);
  });
});

describe('AsyncMutex Unit Tests', () => {
  it('should allow single worker to acquire lock', async () => {
    const mutex = new AsyncMutex();
    expect(mutex.isLocked()).toBe(false);

    await mutex.acquire('Worker1', 'Worker 1');
    expect(mutex.isLocked()).toBe(true);
    expect(mutex.getOwnerName()).toBe('Worker 1');

    mutex.release('Worker1');
    expect(mutex.isLocked()).toBe(false);
  });

  it('should queue second worker when already locked', async () => {
    const mutex = new AsyncMutex();
    await mutex.acquire('Worker1', 'Worker 1');

    let worker2Acquired = false;
    const worker2Promise = mutex.acquire('Worker2', 'Worker 2').then(() => {
      worker2Acquired = true;
    });

    expect(worker2Acquired).toBe(false);
    expect(mutex.getWaitingCount()).toBe(1);

    mutex.release('Worker1');
    await worker2Promise;

    expect(worker2Acquired).toBe(true);
    expect(mutex.getOwnerName()).toBe('Worker 2');
    mutex.release('Worker2');
  });
});

describe('CircularBoundedBuffer Unit Tests', () => {
  it('should insert and remove items in FIFO order', () => {
    const buffer = new CircularBoundedBuffer(4);
    const p1 = generateParcel(101);
    const p2 = generateParcel(102);

    const parcel1 = buffer.insert(p1);
    const parcel2 = buffer.insert(p2);

    expect(buffer.size()).toBe(2);
    expect(buffer.getCapacity() - buffer.size()).toBe(2);

    const removed1 = buffer.remove();
    expect(removed1.parcel.id).toBe(parcel1.parcel.id);

    const removed2 = buffer.remove();
    expect(removed2.parcel.id).toBe(parcel2.parcel.id);

    expect(buffer.size()).toBe(0);
  });
});

describe('SimulationEngine Integration Test', () => {
  it('should start and update stats correctly', () => {
    const engine = SimulationEngine.getInstance();
    engine.setConfig({ capacity: 8, producerCount: 2, consumerCount: 2 });
    
    expect(engine.getState().status).toBe('STOPPED');
    engine.start();
    expect(engine.getState().status).toBe('RUNNING');
    
    engine.stop();
    expect(engine.getState().status).toBe('STOPPED');
  });
});
