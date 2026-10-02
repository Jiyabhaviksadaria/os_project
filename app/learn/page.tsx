'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Code2, HelpCircle, CheckCircle2, Lock, Binary, Warehouse, Cpu, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function LearnPage() {
  const concepts = [
    {
      id: 'producer_consumer',
      title: '1. Producer–Consumer Problem',
      icon: Warehouse,
      definition: 'A fundamental multi-process synchronization problem where producers write items to a shared buffer and consumers read items.',
      analogy: 'E-commerce sellers dropping packages at the warehouse; delivery agents picking them up.',
      cCode: `sem_wait(&empty);
pthread_mutex_lock(&mutex);
// Insert item into buffer
pthread_mutex_unlock(&mutex);
sem_post(&full);`,
    },
    {
      id: 'bounded_buffer',
      title: '2. Bounded Buffer (Circular Queue)',
      icon: Warehouse,
      definition: 'A fixed-size array using modulo arithmetic (index % capacity) for continuous FIFO reuse without memory leaks.',
      analogy: 'Warehouse rack with N fixed shelves numbered 0 to N-1.',
      cCode: `tail = (tail + 1) % CAPACITY; // Producer insertion
head = (head + 1) % CAPACITY; // Consumer removal`,
    },
    {
      id: 'mutex',
      title: '3. Mutex Lock (Mutual Exclusion)',
      icon: Lock,
      definition: 'A binary lock ensuring that only one thread can execute inside the critical section at a time.',
      analogy: 'Single keycard required to open the warehouse inventory office door.',
      cCode: `pthread_mutex_t mutex;
pthread_mutex_lock(&mutex);
// Critical Section
pthread_mutex_unlock(&mutex);`,
    },
    {
      id: 'semaphores',
      title: '4. Counting Semaphores',
      icon: Binary,
      definition: 'Integer counters initialized to a given capacity. Operates via atomic wait() (P) and signal() (V) operations.',
      analogy: 'Digital occupancy display tracking how many parking spots or shelf slots are open.',
      cCode: `sem_t sem;
sem_init(&sem, 0, capacity);
sem_wait(&sem); // Decrement or block
sem_post(&sem); // Increment or unblock`,
    },
    {
      id: 'empty_semaphore',
      title: '5. EMPTY Semaphore',
      icon: Binary,
      definition: 'Initialized to buffer capacity (e.g. 8). Decremented by producers before insertion; incremented by consumers after removal.',
      analogy: 'Count of available empty slots for incoming parcels.',
      cCode: `sem_init(&empty, 0, BUFFER_SIZE);
sem_wait(&empty); // Producer waits if 0 empty slots`,
    },
    {
      id: 'full_semaphore',
      title: '6. FULL Semaphore',
      icon: Binary,
      definition: 'Initialized to 0. Incremented by producers after inserting a parcel; decremented by consumers before taking a parcel.',
      analogy: 'Count of packages currently ready in stock.',
      cCode: `sem_init(&full, 0, 0);
sem_wait(&full); // Consumer waits if 0 full parcels`,
    },
    {
      id: 'critical_section',
      title: '7. Critical Section',
      icon: Cpu,
      definition: 'The segment of code that accesses shared memory (buffer array, head/tail pointers, count).',
      analogy: 'The physical shelf slot where a parcel is placed or removed.',
      cCode: `buffer[tail] = parcel;
count++;
tail = (tail + 1) % CAPACITY;`,
    },
    {
      id: 'race_condition',
      title: '8. Race Condition',
      icon: AlertTriangle,
      definition: 'An undesirable scenario where output depends on non-deterministic timing of concurrent thread execution.',
      analogy: 'Two workers attempting to put two different packages onto the exact same shelf at the same second.',
      cCode: `// Race Condition: No mutex used!
buffer[tail] = p1; // Thread 1 write
buffer[tail] = p2; // Thread 2 overwrites Thread 1!`,
    },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        status="STOPPED"
        isPresentationMode={false}
        onTogglePresentationMode={() => {}}
        onOpenVivaModal={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-navy-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
            <span>/</span>
            <span>Operating Systems Educational Guide</span>
          </div>

          <h1 className="text-3xl font-black text-white font-mono flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-500" />
            Operating Systems Learning & Viva Guide
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Complete theoretical breakdown, algorithm flowcharts, and POSIX C implementation patterns for college examinations.
          </p>
        </div>

        {/* Algorithm Flowchart Section */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-6 mb-10 shadow-xl font-mono">
          <h2 className="text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Producer & Consumer Synchronization Flowcharts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Producer Algorithm */}
            <div className="p-4 bg-navy-950 rounded-xl border border-amber-500/30">
              <h3 className="font-bold text-amber-400 mb-3 uppercase">PRODUCER ROUTINE:</h3>
              <div className="space-y-2">
                <div className="p-2 bg-navy-900 rounded border border-navy-800">1. Generate Parcel Data Item</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-amber-400 rotate-90" /></div>
                <div className="p-2 bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold">2. sem_wait(&empty) → Block if 0 empty slots</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-amber-400 rotate-90" /></div>
                <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold">3. pthread_mutex_lock(&mutex) → Enter Critical Section</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-amber-400 rotate-90" /></div>
                <div className="p-2 bg-navy-900 rounded border border-navy-800">4. Insert Parcel at Buffer[tail] & Increment tail</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-amber-400 rotate-90" /></div>
                <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold">5. pthread_mutex_unlock(&mutex) → Leave Critical Section</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-amber-400 rotate-90" /></div>
                <div className="p-2 bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold">6. sem_post(&full) → Signal 1 parcel available</div>
              </div>
            </div>

            {/* Consumer Algorithm */}
            <div className="p-4 bg-navy-950 rounded-xl border border-purple-500/30">
              <h3 className="font-bold text-purple-400 mb-3 uppercase">CONSUMER ROUTINE:</h3>
              <div className="space-y-2">
                <div className="p-2 bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold">1. sem_wait(&full) → Block if 0 parcels in buffer</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-purple-400 rotate-90" /></div>
                <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold">2. pthread_mutex_lock(&mutex) → Enter Critical Section</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-purple-400 rotate-90" /></div>
                <div className="p-2 bg-navy-900 rounded border border-navy-800">3. Remove Parcel from Buffer[head] & Increment head</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-purple-400 rotate-90" /></div>
                <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold">4. pthread_mutex_unlock(&mutex) → Leave Critical Section</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-purple-400 rotate-90" /></div>
                <div className="p-2 bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold">5. sem_post(&empty) → Signal 1 empty slot available</div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-purple-400 rotate-90" /></div>
                <div className="p-2 bg-navy-900 rounded border border-navy-800">6. Deliver Parcel to Destination</div>
              </div>
            </div>
          </div>
        </div>

        {/* Concept Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {concepts.map((concept) => {
            const Icon = concept.icon;
            return (
              <div
                key={concept.id}
                className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 shadow-lg hover:border-amber-500/40 transition"
              >
                <div className="flex items-center gap-3 border-b border-navy-800 pb-3 mb-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">{concept.title}</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-amber-400 font-mono">Definition:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{concept.definition}</p>
                  </div>

                  <div>
                    <span className="font-bold text-blue-400 font-mono">ParcelHub Analogy:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{concept.analogy}</p>
                  </div>

                  <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 font-mono">
                    <span className="text-[10px] text-slate-500 block mb-1">POSIX C Code Snippet:</span>
                    <pre className="text-[11px] text-amber-200 overflow-x-auto">{concept.cCode}</pre>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
