import { MutexState } from './types';

interface MutexWaiter {
  workerId: string;
  workerName: string;
  resolve: () => void;
}

export class AsyncMutex {
  private locked: boolean = false;
  private ownerId: string | null = null;
  private ownerName: string | null = null;
  private queue: MutexWaiter[] = [];
  private onChangeListeners: (() => void)[] = [];

  public onChange(listener: () => void): () => void {
    this.onChangeListeners.push(listener);
    return () => {
      this.onChangeListeners = this.onChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyChange() {
    this.onChangeListeners.forEach(l => l());
  }

  /**
   * Acquire mutex lock.
   * If unlocked, acquires lock immediately and sets caller as owner.
   * If locked, caller is placed into waiting queue and returns suspended promise.
   */
  public async acquire(workerId: string, workerName: string): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      this.ownerId = workerId;
      this.ownerName = workerName;
      this.notifyChange();
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.queue.push({
        workerId,
        workerName,
        resolve,
      });
      this.notifyChange();
    });
  }

  /**
   * Release mutex lock.
   * Only the current lock owner can release the mutex.
   * If waiters exist in queue, passes ownership to next waiter and resolves its promise.
   * Otherwise unlocks the mutex.
   */
  public release(workerId: string): void {
    if (!this.locked) {
      return; // Already unlocked
    }

    if (this.ownerId !== workerId) {
      throw new Error(`Worker ${workerId} attempted to release mutex owned by ${this.ownerId}`);
    }

    if (this.queue.length > 0) {
      const nextWaiter = this.queue.shift()!;
      this.ownerId = nextWaiter.workerId;
      this.ownerName = nextWaiter.workerName;
      this.notifyChange();
      nextWaiter.resolve();
    } else {
      this.locked = false;
      this.ownerId = null;
      this.ownerName = null;
      this.notifyChange();
    }
  }

  public isLocked(): boolean {
    return this.locked;
  }

  public getOwnerId(): string | null {
    return this.ownerId;
  }

  public getOwnerName(): string | null {
    return this.ownerName;
  }

  public getWaitingCount(): number {
    return this.queue.length;
  }

  public getWaitingQueue(): { workerId: string; workerName: string }[] {
    return this.queue.map(q => ({ workerId: q.workerId, workerName: q.workerName }));
  }

  public getState(): MutexState {
    return {
      isLocked: this.locked,
      ownerId: this.ownerId,
      ownerName: this.ownerName,
      waitingCount: this.queue.length,
      waitingQueue: this.getWaitingQueue(),
    };
  }

  public reset(): void {
    this.locked = false;
    this.ownerId = null;
    this.ownerName = null;
    this.queue = [];
    this.notifyChange();
  }
}
