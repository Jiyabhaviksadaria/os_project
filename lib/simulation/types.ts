export type ParcelPriority = 'NORMAL' | 'HIGH' | 'EXPRESS';
export type ParcelType = 'Electronics' | 'Clothing' | 'Food' | 'Medicine' | 'Documents';
export type ParcelSender = 'Amazon' | 'Flipkart' | 'Myntra' | 'Local Store' | 'Pharmacy';
export type ParcelDestination = 'Ahmedabad' | 'Anand' | 'Vadodara' | 'Surat' | 'Rajkot';

export interface Parcel {
  id: number;
  trackingNumber: string;
  sender: ParcelSender;
  destination: ParcelDestination;
  weight: number; // in kg e.g. 1.4
  priority: ParcelPriority;
  type: ParcelType;
  createdAt: string;
  slotIndex?: number;
}

export type WorkerState =
  | 'IDLE'
  | 'ACTIVE'
  | 'PRODUCING'
  | 'WAITING'
  | 'BLOCKED'
  | 'PROCESSING'
  | 'DELIVERING';

export interface WorkerInfo {
  id: string;
  name: string;
  type: 'PRODUCER' | 'CONSUMER';
  state: WorkerState;
  count: number;
  currentParcel?: Parcel | null;
  currentAction: string;
  waitingReason?: string;
}

export interface BufferSlot {
  slotIndex: number;
  parcel: Parcel | null;
  state: 'EMPTY' | 'OCCUPIED' | 'INSERTING' | 'REMOVING';
}

export type LogCategory =
  | 'PRODUCER'
  | 'CONSUMER'
  | 'BUFFER'
  | 'MUTEX'
  | 'SEMAPHORE'
  | 'SYSTEM'
  | 'WARNING'
  | 'ERROR';

export interface LogEntry {
  id: string;
  timestamp: string;
  category: LogCategory;
  message: string;
  details?: string;
  workerId?: string;
  parcelId?: number;
}

export type SimulationStatus = 'RUNNING' | 'PAUSED' | 'STOPPED';

export interface SimulationConfig {
  capacity: number;           // 4 - 16
  producerCount: number;      // 1 - 6
  consumerCount: number;      // 1 - 6
  productionDelayMs: number;  // 500 - 5000ms
  consumptionDelayMs: number; // 500 - 5000ms
  isDemoMode: boolean;
}

export interface SemaphoreState {
  name: 'EMPTY' | 'FULL';
  value: number;
  initialCapacity: number;
  waitingCount: number;
  waitingQueue: string[];
}

export interface MutexState {
  isLocked: boolean;
  ownerId: string | null;
  ownerName: string | null;
  waitingCount: number;
  waitingQueue: { workerId: string; workerName: string }[];
}

export interface SimulationStats {
  totalProduced: number;
  totalConsumed: number;
  bufferCapacity: number;
  occupiedSlots: number;
  emptySlotsCount: number;
  activeProducers: number;
  activeConsumers: number;
  emptySemaphoreValue: number;
  fullSemaphoreValue: number;
  mutexLocked: boolean;
  mutexOwner: string | null;
  mutexWaitingCount: number;
  producerWaitCount: number;
  consumerWaitCount: number;
  mutexContentionCount: number;
  throughput: number; // parcels per minute
  averageProcessingTimeMs: number;
  averageWaitTimeMs: number;
}

export interface AnalyticsPoint {
  timestamp: string;
  timeSec: number;
  produced: number;
  consumed: number;
  occupancy: number;
  emptySlots: number;
  mutexContention: number;
  producerWaiters: number;
  consumerWaiters: number;
}

export interface RaceConditionLog {
  id: string;
  timestamp: string;
  worker: string;
  slotIndex: number;
  action: 'READ' | 'WRITE' | 'CONFLICT' | 'LOCKED_WRITE';
  valueWritten: number;
  conflictDetected: boolean;
  description: string;
}
