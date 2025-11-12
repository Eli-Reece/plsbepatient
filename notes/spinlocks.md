### Goal
Protection of a shared resource (often a data structure) from concurrent access

### Primitive & Alternative

```c
// Global,statically defined/initialized at compile time
static DEFINE_SPINLOCK(xxx_lock);

// Usage
unsigned long flags;

spin_lock_isrqsave(&xxx_lock, flags);
/* critical section */
spin_unlock_irqrestore(&xxx_lock, flags);
```
```c
spinlock_t xxx_lock;

// __init, dynamically initialized at runtime
spin_lock_init(&xxx_lock);

// Usage
unsigned long flags;

spin_lock_irqsave(&xxx_lock, flags);
/* critical section */
spin_unlock_irqrestore(&xxx_lock, flags);
```

### Reader-Writer

For a shared resource in which the resource is mostly read from, a `read-writer 
lock` can be useful since multiple readers can be in the same critical region
at the same time.
```c
rwlock_t xxx_lock = __RW_LOCK_UNLOCKED(xxx_lock);

// Usage
unsigned long flags;

read_lock_irqsave(&xxx_lock, flags);
/* critical section that only reads the info */
read_unlock_irqrestore(&xxx_lock, flags);

write_lock_irqsave(&xxx_lock, flags);
/* read and write exclusive access to the info */
write_unlock_irqrestore(&xxx_lock, flags);
```

!!! info "Note:"
    `reader-writer locks` require more atomic operations than simple spinlocks
    so only use if the reader critical section is long

Useful for complex data structures like linked lists, where you need to search 
for an entry without changing the lock itself

### Non-Interrupt Handler Spinlocks

IFF you know that the spinlocks are never used in interrupt handlers, you can
use the non-irq versions
```c
spin_lock(&lock)
/* critical section */
spin_unlock(&lock)
```
