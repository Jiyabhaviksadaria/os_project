import {
  Parcel,
  BufferSlot,
  ParcelPriority,
  ParcelType,
  ParcelSender,
  ParcelDestination
} from './types';

const SENDERS: ParcelSender[] = ['Amazon', 'Flipkart', 'Myntra', 'Local Store', 'Pharmacy'];
const DESTINATIONS: ParcelDestination[] = ['Ahmedabad', 'Anand', 'Vadodara', 'Surat', 'Rajkot'];
const TYPES: ParcelType[] = ['Electronics', 'Clothing', 'Food', 'Medicine', 'Documents'];
const PRIORITIES: ParcelPriority[] = ['NORMAL', 'NORMAL', 'NORMAL', 'HIGH', 'EXPRESS'];

export class CircularBoundedBuffer {
  private capacity: number;
  private slots: (Parcel | null)[];
  private head: number = 0; // Read pointer (remove)
  private tail: number = 0; // Write pointer (insert)
  private count: number = 0;

  constructor(capacity: number = 8) {
    this.capacity = capacity;
    this.slots = new Array(capacity).fill(null);
  }

  public insert(parcel: Parcel): { slotIndex: number; parcel: Parcel } {
    if (this.isFull()) {
      throw new Error(`Buffer Overflow: Capacity of ${this.capacity} reached`);
    }

    const slotIndex = this.tail;
    const parcelWithSlot = { ...parcel, slotIndex };
    this.slots[slotIndex] = parcelWithSlot;

    this.tail = (this.tail + 1) % this.capacity;
    this.count++;

    return { slotIndex, parcel: parcelWithSlot };
  }

  public remove(): { slotIndex: number; parcel: Parcel } {
    if (this.isEmpty()) {
      throw new Error('Buffer Underflow: Buffer is empty');
    }

    const slotIndex = this.head;
    const parcel = this.slots[slotIndex];

    if (!parcel) {
      throw new Error(`Inconsistent buffer state: slot ${slotIndex} is empty`);
    }

    this.slots[slotIndex] = null;
    this.head = (this.head + 1) % this.capacity;
    this.count--;

    return { slotIndex, parcel };
  }

  public peek(): Parcel | null {
    if (this.isEmpty()) return null;
    return this.slots[this.head];
  }

  public isFull(): boolean {
    return this.count >= this.capacity;
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }

  public size(): number {
    return this.count;
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public getHead(): number {
    return this.head;
  }

  public getTail(): number {
    return this.tail;
  }

  public getSlots(): BufferSlot[] {
    return this.slots.map((parcel, idx) => ({
      slotIndex: idx,
      parcel,
      state: parcel ? 'OCCUPIED' : 'EMPTY',
    }));
  }

  public clear(): void {
    this.slots = new Array(this.capacity).fill(null);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  public resize(newCapacity: number): void {
    const existingParcels: Parcel[] = [];
    let current = this.head;
    for (let i = 0; i < this.count; i++) {
      if (this.slots[current]) {
        existingParcels.push(this.slots[current]!);
      }
      current = (current + 1) % this.capacity;
    }

    this.capacity = newCapacity;
    this.slots = new Array(newCapacity).fill(null);
    this.head = 0;
    this.tail = 0;
    this.count = 0;

    // Re-insert up to new capacity
    for (let i = 0; i < Math.min(existingParcels.length, newCapacity); i++) {
      this.insert(existingParcels[i]);
    }
  }
}

/**
 * Helper to generate a realistic Parcel object.
 */
let globalParcelSequence = 100;

export function generateParcel(idOverride?: number): Parcel {
  const id = idOverride || ++globalParcelSequence;
  const sender = SENDERS[Math.floor(Math.random() * SENDERS.length)];
  const destination = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
  const weight = parseFloat((Math.random() * 4.5 + 0.5).toFixed(1));
  const trackingNumber = `PCL-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const createdAt = now.toTimeString().split(' ')[0];

  return {
    id,
    trackingNumber,
    sender,
    destination,
    weight,
    priority,
    type,
    createdAt,
  };
}

export function resetParcelSequence(): void {
  globalParcelSequence = 100;
}
