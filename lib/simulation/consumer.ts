import { WorkerInfo, Parcel } from './types';
import { AsyncSemaphore } from './semaphore';
import { AsyncMutex } from './mutex';
import { CircularBoundedBuffer } from './buffer';

export class ConsumerWorker {
  public id: string;
  public name: string;
  public state: WorkerInfo['state'] = 'IDLE';
  public parcelsConsumed: number = 0;
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
      type: 'CONSUMER',
      state: this.state,
      count: this.parcelsConsumed,
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
    this.currentAction = 'Started consumer loop';
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

      // 1. WAIT(fullSlots) - Check if buffer has parcels available
      if (fullSlots.getValue() === 0) {
        this.state = 'WAITING';
        this.currentAction = 'Waiting on Semaphore';
        this.waitingReason = 'Buffer Empty (0 parcels available)';
        onLog('SEMAPHORE', `${this.name} WAITING on FULL semaphore (Buffer Empty)`);
        onStateChange();
      }

      await fullSlots.wait(this.id, this.name);
      if (!this.isRunning) break;

      // 2. Acquire MUTEX
      this.state = 'WAITING';
      this.currentAction = 'Acquiring Mutex Lock';
      this.waitingReason = 'Waiting for Critical Section Mutex';
      if (mutex.isLocked()) {
        onLog('MUTEX', `${this.name} waiting to acquire Mutex (locked by ${mutex.getOwnerName()})`);
      }
      onStateChange();

      await mutex.acquire(this.id, this.name);
      if (!this.isRunning) break;

      // 3. CRITICAL SECTION - Remove from buffer
      this.state = 'PROCESSING';
      this.currentAction = 'Inside Critical Section';
      this.waitingReason = '';
      onLog('MUTEX', `🔒 ${this.name} acquired Mutex lock`);
      onStateChange();

      const { slotIndex, parcel } = buffer.remove();
      this.currentParcel = parcel;
      this.parcelsConsumed++;
      this.currentAction = `Removed Parcel #${parcel.id} from Slot ${slotIndex}`;
      onLog('BUFFER', `🚚 ${this.name} picked up Parcel #${parcel.id} from Slot ${slotIndex}`, `Buffer count: ${buffer.size()}/${buffer.getCapacity()}`, parcel.id);
      onStateChange();

      await this.sleep(150);

      // 4. RELEASE MUTEX
      mutex.release(this.id);
      onLog('MUTEX', `🔓 ${this.name} released Mutex lock`);
      onStateChange();

      // 5. SIGNAL(emptySlots)
      emptySlots.signal();
      onLog('SEMAPHORE', `🟢 ${this.name} signaled EMPTY semaphore (+1 slot freed)`);
      onStateChange();

      // 6. Delivery Processing
      this.state = 'DELIVERING';
      this.currentAction = `Delivering Parcel #${parcel.id} to ${parcel.destination}`;
      onLog('CONSUMER', `🚚 ${this.name} delivering Parcel #${parcel.id} (${parcel.priority} priority) to ${parcel.destination}`);
      onStateChange();

      await this.sleep(getDelayMs());

      onLog('CONSUMER', `✅ ${this.name} successfully delivered Parcel #${parcel.id} to ${parcel.destination}`);
      this.state = 'IDLE';
      this.currentParcel = null;
      this.currentAction = 'Ready for next order';
      onStateChange();
    }
  }

  public pause() {
    this.isPaused = true;
    if (this.state === 'IDLE' || this.state === 'DELIVERING') {
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
