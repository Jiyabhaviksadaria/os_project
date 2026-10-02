import { WorkerInfo, Parcel } from './types';
import { AsyncSemaphore } from './semaphore';
import { AsyncMutex } from './mutex';
import { CircularBoundedBuffer, generateParcel } from './buffer';

export class ProducerWorker {
  public id: string;
  public name: string;
  public state: WorkerInfo['state'] = 'IDLE';
  public parcelsGenerated: number = 0;
  public currentParcel: Parcel | null = null;
  public currentAction: string = 'Initialized';
  public waitingReason: string = '';

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private delayResolver: (() => void) | null = null;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  public getInfo(): WorkerInfo {
    return {
      id: this.id,
      name: this.name,
      type: 'PRODUCER',
      state: this.state,
      count: this.parcelsGenerated,
      currentParcel: this.currentParcel,
      currentAction: this.currentAction,
      waitingReason: this.waitingReason,
    };
  }

  public start(
    emptySlots: AsyncSemaphore,
    fullSlots: AsyncSemaphore,
    mutex: AsyncMutex,
    buffer: CircularBoundedBuffer,
    getDelayMs: () => number,
    checkCanProceed: () => boolean,
    onLog: (category: any, message: string, details?: string, parcelId?: number) => void,
    onStateChange: () => void
  ) {
    this.isRunning = true;
    this.isPaused = false;
    this.state = 'ACTIVE';
    this.currentAction = 'Started worker loop';
    onStateChange();

    this.runLoop(
      emptySlots,
      fullSlots,
      mutex,
      buffer,
      getDelayMs,
      checkCanProceed,
      onLog,
      onStateChange
    );
  }

  private async runLoop(
    emptySlots: AsyncSemaphore,
    fullSlots: AsyncSemaphore,
    mutex: AsyncMutex,
    buffer: CircularBoundedBuffer,
    getDelayMs: () => number,
    checkCanProceed: () => boolean,
    onLog: (category: any, message: string, details?: string, parcelId?: number) => void,
    onStateChange: () => void
  ) {
    while (this.isRunning) {
      if (!checkCanProceed()) {
        await this.sleep(200);
        continue;
      }

      // 1. Create Parcel
      this.state = 'PRODUCING';
      const parcel = generateParcel();
      this.currentParcel = parcel;
      this.currentAction = `Generated Parcel #${parcel.id}`;
      this.waitingReason = '';
      onLog('PRODUCER', `${this.name} created Parcel #${parcel.id} (${parcel.type} for ${parcel.destination})`, undefined, parcel.id);
      onStateChange();

      // 2. WAIT(emptySlots) - Check if buffer is full
      if (emptySlots.getValue() === 0) {
        this.state = 'BLOCKED';
        this.currentAction = 'Blocked on Semaphore';
        this.waitingReason = 'Buffer Full (0 empty slots)';
        onLog('SEMAPHORE', `${this.name} BLOCKED waiting on EMPTY semaphore (Buffer Full)`);
        onStateChange();
      }

      await emptySlots.wait(this.id, this.name);
      if (!this.isRunning) break;

      // 3. Acquire MUTEX
      this.state = 'WAITING';
      this.currentAction = 'Acquiring Mutex Lock';
      this.waitingReason = 'Waiting for Critical Section Mutex';
      if (mutex.isLocked()) {
        onLog('MUTEX', `${this.name} waiting to acquire Mutex (locked by ${mutex.getOwnerName()})`);
      }
      onStateChange();

      await mutex.acquire(this.id, this.name);
      if (!this.isRunning) break;

      // 4. CRITICAL SECTION - Insert into buffer
      this.state = 'ACTIVE';
      this.currentAction = 'Inside Critical Section';
      this.waitingReason = '';
      onLog('MUTEX', `🔒 ${this.name} acquired Mutex lock`);
      onStateChange();

      const { slotIndex } = buffer.insert(parcel);
      this.parcelsGenerated++;
      this.currentAction = `Inserted Parcel #${parcel.id} into Slot ${slotIndex}`;
      onLog('BUFFER', `📦 ${this.name} inserted Parcel #${parcel.id} into Slot ${slotIndex}`, `Buffer count: ${buffer.size()}/${buffer.getCapacity()}`, parcel.id);
      onStateChange();

      // Small simulation delay inside critical section to make visualization clear
      await this.sleep(150);

      // 5. RELEASE MUTEX
      mutex.release(this.id);
      onLog('MUTEX', `🔓 ${this.name} released Mutex lock`);
      onStateChange();

      // 6. SIGNAL(fullSlots)
      fullSlots.signal();
      onLog('SEMAPHORE', `🔵 ${this.name} signaled FULL semaphore (+1 parcel ready)`);
      onStateChange();

      // 7. Worker production cooldown delay
      this.state = 'IDLE';
      this.currentParcel = null;
      this.currentAction = `Cooling down (${(getDelayMs() / 1000).toFixed(1)}s)`;
      onStateChange();

      await this.sleep(getDelayMs());
    }
  }

  public pause() {
    this.isPaused = true;
    if (this.state === 'IDLE' || this.state === 'PRODUCING') {
      this.state = 'WAITING';
      this.waitingReason = 'Simulation Paused';
    }
  }

  public resume() {
    this.isPaused = false;
    if (this.state === 'WAITING' && this.waitingReason === 'Simulation Paused') {
      this.state = 'ACTIVE';
      this.waitingReason = '';
    }
  }

  public stop() {
    this.isRunning = false;
    this.state = 'IDLE';
    this.currentAction = 'Stopped';
    this.waitingReason = '';
    if (this.delayResolver) {
      this.delayResolver();
      this.delayResolver = null;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      this.delayResolver = resolve;
      const timer = setTimeout(() => {
        this.delayResolver = null;
        resolve();
      }, ms);
    });
  }
}
