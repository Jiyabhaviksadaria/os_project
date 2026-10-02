# 📬 ParcelHub — POSIX C Implementation

This directory contains the native POSIX C implementation of the **Producer–Consumer Operating System Synchronization** problem.

## 📁 Files Included
- `parcelhub.c` — Complete multi-threaded C source code using `pthread`, `sem_t`, and `pthread_mutex_t`.
- `Makefile` — Build script for Linux / macOS / MinGW / WSL.
- `README.md` — Technical documentation & compilation instructions.

---

## 🛠️ Compilation Instructions

### Linux / macOS / WSL
Open a terminal in `c-implementation/` directory and run:

```bash
# Using Makefile:
make

# Or directly with GCC:
gcc -pthread parcelhub.c -o parcelhub
```

### Windows (MinGW GCC)
```powershell
gcc -pthread parcelhub.c -o parcelhub.exe
```

---

## 🚀 Running the Simulator

Run with default arguments (8 buffer slots, 3 producers, 3 consumers):

```bash
./parcelhub
```

Custom argument syntax:
```bash
./parcelhub [buffer_capacity] [num_producers] [num_consumers]
```

Examples:
```bash
# 4 slots, 2 producers, 2 consumers
./parcelhub 4 2 2

# 16 slots, 5 producers, 5 consumers
./parcelhub 16 5 5
```

---

## 🔬 Core Operating System Concepts Demonstrated

1. **`sem_t empty_slots`** — Initialized to `BUFFER_CAPACITY`. Decremented via `sem_wait(&empty_slots)` by producers before writing.
2. **`sem_t full_slots`** — Initialized to `0`. Incremented via `sem_post(&full_slots)` by producers after inserting.
3. **`pthread_mutex_t buffer_mutex`** — Ensures mutual exclusion inside the critical section where `buffer.items[tail]` or `head` is modified.
4. **Circular Queue** — Modulo arithmetic `(index + 1) % capacity` for FIFO buffer reuse.
