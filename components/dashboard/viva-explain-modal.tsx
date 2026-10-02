'use client';

import React from 'react';
import { X, BookOpen, HelpCircle, CheckCircle2, Code2, Lock, Binary, Warehouse } from 'lucide-react';

interface VivaExplainModalProps {
  conceptKey: string | null;
  onClose: () => void;
}

interface ConceptDetail {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  definition: string;
  analogy: string;
  whyItMatters: string;
  codeSnippet: string;
  vivaQuestions: { q: string; a: string }[];
}

const CONCEPTS: Record<string, ConceptDetail> = {
  producer_consumer: {
    title: 'Producer–Consumer Problem',
    subtitle: 'Classic Process Synchronization Challenge',
    icon: Warehouse,
    definition:
      'A classic multi-process synchronization problem where one set of processes (producers) generates data items into a shared buffer, while another set (consumers) removes and processes them.',
    analogy:
      'ParcelHub Warehouse: E-commerce merchants (Producers) drop parcels into storage slots, while Delivery Fleet Agents (Consumers) pick parcels up for shipping.',
    whyItMatters:
      'Prevents race conditions, buffer overflow (producers overfilling storage), and buffer underflow (consumers trying to pick from an empty warehouse).',
    codeSnippet: `// POSIX C Core Logic:
sem_wait(&empty_slots); // Wait for free slot
pthread_mutex_lock(&mutex); // Acquire critical section lock
insert_parcel(buffer, parcel);
pthread_mutex_unlock(&mutex); // Release lock
sem_post(&full_slots); // Signal parcel available`,
    vivaQuestions: [
      {
        q: 'Why is synchronization required between producers and consumers?',
        a: 'Because both read and modify shared buffer state (pointers, count, array slots) concurrently. Without synchronization, race conditions cause data corruption, lost items, or overwrites.',
      },
      {
        q: 'What are the three synchronization primitives used?',
        a: '1. Mutex lock (for mutual exclusion in critical section)\n2. Empty Counting Semaphore (initialized to buffer capacity)\n3. Full Counting Semaphore (initialized to 0)',
      },
    ],
  },
  mutex: {
    title: 'Mutex (Mutual Exclusion Lock)',
    subtitle: 'Critical Section Lock',
    icon: Lock,
    definition:
      'A Mutex is a locking mechanism used to synchronize access to a resource. Only one thread can acquire the lock and enter the critical section at any given moment.',
    analogy:
      'Only one worker (producer or consumer) is allowed inside the warehouse inventory room at a time to prevent two workers from grabbing the same slot.',
    whyItMatters:
      'Guarantees atomic operations when modifying shared pointers (head, tail, count) so data integrity remains 100%.',
    codeSnippet: `pthread_mutex_t mutex;
pthread_mutex_init(&mutex, NULL);

pthread_mutex_lock(&mutex);   // Acquire Lock
// CRITICAL SECTION ACCESS
pthread_mutex_unlock(&mutex); // Release Lock`,
    vivaQuestions: [
      {
        q: 'What is the difference between a Mutex and a Binary Semaphore?',
        a: 'A Mutex has ownership semantics: only the thread that locked it can unlock it. A semaphore can be signaled by any thread.',
      },
    ],
  },
  semaphores: {
    title: 'Counting Semaphores (EMPTY & FULL)',
    subtitle: 'Resource Tracking Primitives',
    icon: Binary,
    definition:
      'Semaphores are integer variables used to solve synchronization problems. Operations: wait() (P) decrements or blocks if 0; signal() (V) increments or wakes a waiting process.',
    analogy:
      'EMPTY semaphore tracks free warehouse slots. FULL semaphore tracks ready parcels in stock.',
    whyItMatters:
      'Eliminates busy-waiting (spinlocks) by putting blocked threads to sleep until resources become available.',
    codeSnippet: `sem_t empty_slots; // Initialized to BUFFER_CAPACITY (e.g., 8)
sem_t full_slots;  // Initialized to 0

sem_wait(&empty_slots); // Decrement empty count, block if 0
sem_post(&full_slots);  // Increment full count, wake consumer if waiting`,
    vivaQuestions: [
      {
        q: 'What happens when sem_wait() is called when semaphore value is 0?',
        a: 'The calling process/thread is placed into the semaphore waiting queue and suspended (blocked) until another thread calls sem_post().',
      },
    ],
  },
  bounded_buffer: {
    title: 'Bounded Buffer (Circular Queue)',
    subtitle: 'Shared Fixed-Capacity Storage',
    icon: Warehouse,
    definition:
      'A bounded buffer is a fixed-size memory array accessed in a First-In-First-Out (FIFO) manner using head (remove) and tail (insert) modulo pointers.',
    analogy:
      'A warehouse storage rack with 8 numbered slots. Tail pointer tracks where the next incoming parcel goes; Head pointer tracks the next outgoing parcel.',
    whyItMatters:
      'Prevents unbounded memory growth and allows continuous reuse of memory buffer space.',
    codeSnippet: `// Circular Queue Pointers:
tail = (tail + 1) % CAPACITY; // Producer insertion pointer
head = (head + 1) % CAPACITY; // Consumer removal pointer`,
    vivaQuestions: [
      {
        q: 'How does modulo arithmetic help in a circular buffer?',
        a: 'It wraps the index back to 0 when it reaches capacity, allowing continuous reuse of fixed memory slots without reallocating arrays.',
      },
    ],
  },
  race_condition: {
    title: 'Race Condition & Critical Section',
    subtitle: 'Concurrency Hazard Prevention',
    icon: BookOpen,
    definition:
      'A race condition occurs when two or more processes access shared data concurrently and the outcome depends on the non-deterministic timing of execution.',
    analogy:
      'Two producers try to place a parcel into Slot #3 simultaneously without locking: Producer 2 overwrites Producer 1 parcel, causing Producer 1 data to be lost.',
    whyItMatters:
      'Understanding race conditions is essential for writing safe multithreaded systems, operating systems, and web servers.',
    codeSnippet: `// WITHOUT MUTEX (RACE CONDITION HAZARD):
slot = tail;          // Producer A reads tail = 2
slot = tail;          // Producer B reads tail = 2
buffer[2] = parcelA;  // Producer A writes
buffer[2] = parcelB;  // Producer B overwrites parcelA! (CORRUPTION)`,
    vivaQuestions: [
      {
        q: 'What are the four necessary conditions for critical section solutions?',
        a: '1. Mutual Exclusion\n2. Progress\n3. Bounded Waiting\n4. No assumption about relative CPU speeds',
      },
    ],
  },
};

export function VivaExplainModal({ conceptKey, onClose }: VivaExplainModalProps) {
  if (!conceptKey) return null;

  const concept = CONCEPTS[conceptKey] || CONCEPTS['producer_consumer'];
  const Icon = concept.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden font-sans text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-navy-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">{concept.title}</h3>
              <p className="text-xs text-amber-400 font-medium">{concept.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
            <h4 className="font-bold text-amber-400 font-mono mb-1 uppercase">Definition:</h4>
            <p className="text-slate-300 leading-relaxed">{concept.definition}</p>
          </div>

          <div className="p-3 bg-navy-950 rounded-xl border border-blue-500/30">
            <h4 className="font-bold text-blue-400 font-mono mb-1 uppercase">ParcelHub Analogy:</h4>
            <p className="text-slate-300 leading-relaxed">{concept.analogy}</p>
          </div>

          <div className="p-3 bg-navy-950 rounded-xl border border-emerald-500/30">
            <h4 className="font-bold text-emerald-400 font-mono mb-1 uppercase">Why It Matters in OS:</h4>
            <p className="text-slate-300 leading-relaxed">{concept.whyItMatters}</p>
          </div>

          {/* Code Snippet */}
          <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 font-mono">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-navy-800 pb-2 mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Code2 className="w-3.5 h-3.5" />
                POSIX C Implementation Code:
              </span>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
              {concept.codeSnippet}
            </pre>
          </div>

          {/* Viva Q&A */}
          <div className="p-3.5 bg-navy-950 rounded-xl border border-amber-500/30">
            <h4 className="font-bold text-amber-400 font-mono mb-2 flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              EXPECTED VIVA EXAM QUESTIONS & ANSWERS:
            </h4>
            <div className="space-y-2.5">
              {concept.vivaQuestions.map((qa, idx) => (
                <div key={idx} className="border-b border-navy-800/80 pb-2 last:border-0">
                  <p className="font-bold text-slate-200">Q: {qa.q}</p>
                  <p className="text-slate-400 mt-0.5 whitespace-pre-wrap">A: {qa.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-navy-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold rounded-xl text-xs transition"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
