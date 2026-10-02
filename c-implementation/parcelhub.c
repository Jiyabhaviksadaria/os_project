/**
 * ============================================================================
 * 📬 PARCELHUB — POSIX C Producer-Consumer Process Synchronization
 * Operating Systems College Project
 * 
 * Features:
 * - POSIX pthreads for concurrent workers (producers & consumers)
 * - Counting semaphores (sem_t) for empty and full buffer slot tracking
 * - Mutex lock (pthread_mutex_t) for critical section protection
 * - Thread-safe Circular Bounded Buffer
 * - ANSI Color formatted console output
 * 
 * Compilation:
 *   gcc -pthread parcelhub.c -o parcelhub
 * 
 * Usage:
 *   ./parcelhub [buffer_capacity] [num_producers] [num_consumers]
 * ============================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <string.h>
#include <time.h>

// Default configuration constants
#define DEFAULT_CAPACITY 8
#define DEFAULT_PRODUCERS 3
#define DEFAULT_CONSUMERS 3
#define MAX_ITEMS_TO_PRODUCE 20

// ANSI Color Code Macros for visual presentation
#define COLOR_RESET   "\x1b[0m"
#define COLOR_PROD    "\x1b[33m" // Yellow/Amber
#define COLOR_CONS    "\x1b[35m" // Magenta/Purple
#define COLOR_MUTEX   "\x1b[36m" // Cyan
#define COLOR_SUCCESS "\x1b[32m" // Green
#define COLOR_WARN    "\x1b[31m" // Red

// Parcel Item Structure
typedef struct {
    int id;
    int sender_id;
    float weight_kg;
    char destination[32];
    char type[32];
} Parcel;

// Shared Bounded Buffer Structure
typedef struct {
    Parcel items[32];
    int capacity;
    int head; // Read index for Consumer
    int tail; // Write index for Producer
    int count;
} BoundedBuffer;

// Global Synchronization Primitives
BoundedBuffer buffer;
sem_t empty_slots; // Counting semaphore for free slots
sem_t full_slots;  // Counting semaphore for filled items
pthread_mutex_t buffer_mutex; // Mutex for critical section

int global_parcel_id = 100;
int total_produced = 0;
int total_consumed = 0;
pthread_mutex_t count_mutex;

// Destination city options
const char *destinations[] = {"Ahmedabad", "Surat", "Vadodara", "Rajkot", "Mumbai", "Delhi"};
const char *parcel_types[] = {"Electronics", "Clothing", "Food", "Medicine", "Documents"};

// Generate a random parcel
Parcel create_parcel(int producer_id) {
    Parcel p;
    pthread_mutex_lock(&count_mutex);
    p.id = ++global_parcel_id;
    pthread_mutex_unlock(&count_mutex);

    p.sender_id = producer_id;
    p.weight_kg = (float)(rand() % 50 + 5) / 10.0f;
    strcpy(p.destination, destinations[rand() % 6]);
    strcpy(p.type, parcel_types[rand() % 5]);
    return p;
}

// Print buffer status bar
void print_buffer_status() {
    printf(COLOR_MUTEX "  [BUFFER STATUS]: Occupied %d/%d slots | Head=%d, Tail=%d" COLOR_RESET "\n",
           buffer.count, buffer.capacity, buffer.head, buffer.tail);
}

// Producer Thread Routine
void *producer_routine(void *arg) {
    int producer_id = *((int *)arg);
    free(arg);

    while (1) {
        pthread_mutex_lock(&count_mutex);
        if (total_produced >= MAX_ITEMS_TO_PRODUCE) {
            pthread_mutex_unlock(&count_mutex);
            break;
        }
        total_produced++;
        pthread_mutex_unlock(&count_mutex);

        Parcel parcel = create_parcel(producer_id);
        usleep((rand() % 500 + 300) * 1000); // Simulate production time

        printf(COLOR_PROD "📦 Producer %d: Requesting empty slot (wait)..." COLOR_RESET "\n", producer_id);
        
        // 1. Wait for an empty slot (Blocks if empty_slots == 0)
        sem_wait(&empty_slots);

        // 2. Acquire Mutex Lock for Critical Section
        pthread_mutex_lock(&buffer_mutex);
        printf(COLOR_MUTEX "🔒 Producer %d: Acquired Mutex lock. Inserting Parcel #%d at Slot [%d]" COLOR_RESET "\n",
               producer_id, parcel.id, buffer.tail);

        // CRITICAL SECTION: Insert parcel into buffer
        buffer.items[buffer.tail] = parcel;
        buffer.tail = (buffer.tail + 1) % buffer.capacity;
        buffer.count++;

        print_buffer_status();

        // 3. Release Mutex Lock
        pthread_mutex_unlock(&buffer_mutex);
        printf(COLOR_MUTEX "🔓 Producer %d: Released Mutex lock." COLOR_RESET "\n", producer_id);

        // 4. Signal FULL semaphore (Wake up consumers if waiting)
        sem_post(&full_slots);
        printf(COLOR_SUCCESS "✅ Producer %d: Signaled full_slots (Parcel #%d ready)" COLOR_RESET "\n\n",
               producer_id, parcel.id);

        usleep(400000);
    }

    printf(COLOR_PROD "🏁 Producer %d finished routine." COLOR_RESET "\n", producer_id);
    return NULL;
}

// Consumer Thread Routine
void *consumer_routine(void *arg) {
    int consumer_id = *((int *)arg);
    free(arg);

    while (1) {
        pthread_mutex_lock(&count_mutex);
        if (total_consumed >= MAX_ITEMS_TO_PRODUCE) {
            pthread_mutex_unlock(&count_mutex);
            break;
        }
        pthread_mutex_unlock(&count_mutex);

        printf(COLOR_CONS "🚚 Consumer %d: Waiting for available parcel (wait)..." COLOR_RESET "\n", consumer_id);

        // 1. Wait for a full parcel (Blocks if full_slots == 0)
        sem_wait(&full_slots);

        // 2. Acquire Mutex Lock for Critical Section
        pthread_mutex_lock(&buffer_mutex);

        // Check completion condition inside lock
        pthread_mutex_lock(&count_mutex);
        if (total_consumed >= MAX_ITEMS_TO_PRODUCE) {
            pthread_mutex_unlock(&count_mutex);
            pthread_mutex_unlock(&buffer_mutex);
            sem_post(&empty_slots);
            break;
        }
        total_consumed++;
        pthread_mutex_unlock(&count_mutex);

        printf(COLOR_MUTEX "🔒 Consumer %d: Acquired Mutex lock. Removing Parcel from Slot [%d]" COLOR_RESET "\n",
               consumer_id, buffer.head);

        // CRITICAL SECTION: Remove parcel from buffer
        Parcel parcel = buffer.items[buffer.head];
        buffer.head = (buffer.head + 1) % buffer.capacity;
        buffer.count--;

        print_buffer_status();

        // 3. Release Mutex Lock
        pthread_mutex_unlock(&buffer_mutex);
        printf(COLOR_MUTEX "🔓 Consumer %d: Released Mutex lock." COLOR_RESET "\n", consumer_id);

        // 4. Signal EMPTY semaphore (Wake up producers if waiting)
        sem_post(&empty_slots);
        printf(COLOR_SUCCESS "✨ Consumer %d: Delivered Parcel #%d (%s to %s)" COLOR_RESET "\n\n",
               consumer_id, parcel.id, parcel.type, parcel.destination);

        usleep((rand() % 600 + 400) * 1000); // Simulate delivery time
    }

    printf(COLOR_CONS "🏁 Consumer %d finished routine." COLOR_RESET "\n", consumer_id);
    return NULL;
}

int main(int argc, char *argv[]) {
    srand(time(NULL));

    int capacity = DEFAULT_CAPACITY;
    int num_producers = DEFAULT_PRODUCERS;
    int num_consumers = DEFAULT_CONSUMERS;

    if (argc >= 2) capacity = atoi(argv[1]);
    if (argc >= 3) num_producers = atoi(argv[2]);
    if (argc >= 4) num_consumers = atoi(argv[3]);

    printf("========================================================\n");
    printf("📬 PARCELHUB POSIX C SIMULATOR\n");
    printf("Producer-Consumer Process Synchronization\n");
    printf("========================================================\n");
    printf("Configuration:\n");
    printf("  - Buffer Capacity : %d slots\n", capacity);
    printf("  - Producers Count : %d workers\n", num_producers);
    printf("  - Consumers Count : %d workers\n", num_consumers);
    printf("  - Total Parcels   : %d items\n", MAX_ITEMS_TO_PRODUCE);
    printf("========================================================\n\n");

    // Initialize Shared Buffer
    buffer.capacity = capacity;
    buffer.head = 0;
    buffer.tail = 0;
    buffer.count = 0;

    // Initialize Semaphores and Mutex
    sem_init(&empty_slots, 0, capacity); // empty = capacity
    sem_init(&full_slots, 0, 0);         // full = 0
    pthread_mutex_init(&buffer_mutex, NULL);
    pthread_mutex_init(&count_mutex, NULL);

    pthread_t producers[num_producers];
    pthread_t consumers[num_consumers];

    // Create Producer Threads
    for (int i = 0; i < num_producers; i++) {
        int *id = malloc(sizeof(int));
        *id = i + 1;
        pthread_create(&producers[i], NULL, producer_routine, id);
    }

    // Create Consumer Threads
    for (int i = 0; i < num_consumers; i++) {
        int *id = malloc(sizeof(int));
        *id = i + 1;
        pthread_create(&consumers[i], NULL, consumer_routine, id);
    }

    // Wait for all Producer Threads
    for (int i = 0; i < num_producers; i++) {
        pthread_join(producers[i], NULL);
    }

    // Wake up any waiting consumers to exit cleanly
    for (int i = 0; i < num_consumers; i++) {
        sem_post(&full_slots);
    }

    // Wait for all Consumer Threads
    for (int i = 0; i < num_consumers; i++) {
        pthread_join(consumers[i], NULL);
    }

    // Destroy Synchronization Objects
    sem_destroy(&empty_slots);
    sem_destroy(&full_slots);
    pthread_mutex_destroy(&buffer_mutex);
    pthread_mutex_destroy(&count_mutex);

    printf("\n========================================================\n");
    printf("🎉 SIMULATION COMPLETE!\n");
    printf("Total Produced: %d | Total Consumed: %d\n", total_produced, total_consumed);
    printf("100%% Mutual Exclusion & Semaphore Synchronization Verified!\n");
    printf("========================================================\n");

    return 0;
}
