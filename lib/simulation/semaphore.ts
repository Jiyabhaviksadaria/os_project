import { SemaphoreState } from './types';

interface DeferredWaiter {
  id: string;
  name: string;
  resolve: () => void;
  rejected?: boolean;
}

export class AsyncSemaphore {
  private name: 'EMPTY' | 'FULL';
  private value: number;
  private initialCapacity: number;
  private queue: DeferredWaiter[] = [];
  private onChangeListeners: (() => void)[] = [];

  constructor(name: 'EMPTY' | 'FULL', initialValue: number) {
    this.name = name;
    this.value = initialValue;
    this.initialCapacity = initialValue;
  }

  public onChange(listener: () => void): () => void {
    this.onChangeListeners.push(listener);
    return () => {
      this.onChangeListeners = this.onChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyChange() {
    this.onChangeListeners.forEach(listener => listener());
  }

  /**
   * wait (P operation)
   * Decrements semaphore value if > 0.
   * If value === 0, returns a Promise that suspends the caller until signal() is called.
   */
  public async wait(workerId: string, workerName: string): Promise<void> {
    if (this.value > 0) {
      this.value--;
      this.notifyChange();
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.queue.push({
        id: workerId,
        name: workerName,
        resolve,
      });
      this.notifyChange();
    });
  }

  /**
   * signal (V operation / post)
   * Wakes up the first waiting worker in the queue if any exist.
   * Otherwise increments the semaphore value.
   */
  public signal(): void {
    if (this.queue.length > 0) {
      const waiter = this.queue.shift();
      if (waiter) {
        // Value remains unchanged as permit is directly passed to waiting worker
        this.notifyChange();
        waiter.resolve();
      }
    } else {
      this.value++;
      this.notifyChange();
    }
  }

  public getValue(): number {
    return this.value;
  }

  public getWaitingCount(): number {
    return this.queue.length;
  }

  public getWaitingQueue(): string[] {
    return this.queue.map(w => w.name);
  }

  public getState(): SemaphoreState {
    return {
      name: this.name,
      value: this.value,
      initialCapacity: this.initialCapacity,
      waitingCount: this.queue.length,
      waitingQueue: this.getWaitingQueue(),
    };
  }

  public reset(newValue: number): void {
    // Reject any pending waiters gracefully on reset
    this.queue = [];
    this.value = newValue;
    this.initialCapacity = newValue;
    this.notifyChange();
  }
}
