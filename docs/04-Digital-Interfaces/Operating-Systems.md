---
title: Operating Systems and Shared Resources
sidebar_position: 26
---

# Operating Systems and Shared Resources

## 1. Processes and threads

An **operating system (OS)** manages processor time, memory, and access to devices. Its kernel runs operations that ordinary programs cannot perform directly and applies the protection rules supported by the system.

A **process** is a running program together with its resources and current execution state. In an OS with memory protection, each process usually has its own virtual address space.

A **thread** is an execution sequence within a process. Threads in one process share memory and many resources, but each has its own execution state.

A thread normally has its own stack and saved registers. Shared memory permits efficient communication but also permits accidental interference.

A **context switch** saves the state of one running thread or process and restores another so it can continue. Switching between threads in the same process does not necessarily change the address space.

Small embedded systems can run without an OS. An embedded scheduler may use tasks that share one address space without process isolation.

Do not assume that a desktop process model applies to every microcontroller or real-time operating system.

## 2. Process creation and communication

The **Portable Operating System Interface (POSIX)** specifies common system interfaces. On POSIX systems, **fork** creates a child process. It returns a child identifier in the parent and zero in the child when successful.

The child initially has equivalent memory contents. Ordinary writes in one process do not change the other's private memory.

An **exec** operation replaces the calling process's program image. It does not create a second process by itself.

A parent uses a wait operation to collect a child's termination status. Handle creation failures and unsuccessful child exits.

### Pipes and byte streams

A **pipe** carries bytes between a write end and a read end. A read can return fewer bytes than requested.

An empty pipe with active writers can block a reader. End-of-file happens after all write ends close and buffered data has been read.

Each process should close the pipe ends it does not use. If any process accidentally leaves a write end open, the reader may keep waiting because it has not received an end-of-file indication.

For two-way communication, use two pipes or a suitable socket. Define message lengths or separators: a stream of bytes does not automatically preserve the boundaries between your messages.

With **Transmission Control Protocol (TCP)** sockets, a single send may be received in several pieces, or combined with other sends. Reassemble complete messages and handle partial transfers and disconnects.

## 3. Shared updates and critical sections

A **critical section** accesses shared state that needs coordinated access. A **mutex** allows one thread at a time to enter a protected region.

Consider two threads that each increment a shared counter once. The counter starts at zero.

| Step | Thread A | Thread B | Shared counter |
| --- | --- | --- | --- |
| 1 | Reads 0 | | 0 |
| 2 | | Reads 0 | 0 |
| 3 | Writes 1 | | 1 |
| 4 | | Writes 1 | 1 |

The intended result is two, but one update is lost. In C, unsynchronized conflicting ordinary accesses can also cause undefined behavior.

Protect the entire read-modify-write sequence with a mutex or use an appropriate atomic operation. Protect all participating access paths consistently.

The [volatile qualifier](<./Firmware.md#volatile-and-shared-data>) does not provide this synchronization.

### Conditions and queues

A **condition variable** lets a thread wait for a shared condition. Check the condition while holding its associated mutex.

Wait in a loop because a wakeup does not guarantee that the condition is true. The wait operation releases the mutex and reacquires it before returning.

A producer-consumer queue with a fixed capacity commonly waits on two conditions: space for a producer to add data, and data for a consumer to remove. Protect the indices and define who owns each element while it moves through the queue.

A **semaphore** maintains a count of available permits. Its ownership rules differ from a mutex, so the two objects are not interchangeable in every design.

## 4. Deadlock and lock ordering

**Deadlock** happens when blocked participants each need an event that another blocked participant must cause.

For example, thread A holds lock R and waits for lock S. Thread B holds S and waits for R.

Neither can finish its protected operation. A faster processor does not remove this dependency cycle.

This deadlock pattern needs exclusive access to resources, threads holding one resource while waiting for another, no forced removal of held resources, and a circular chain of waiting. Preventing any one of those conditions breaks the pattern.

Assign a global lock order and require every path to follow it. For example, acquire R before S in both threads.

Release locks on every error path. Include callbacks and nested function calls when checking lock order.

A cycle proves deadlock in a resource graph with one instance of each resource type. Multiple instances require additional analysis.

**Starvation** means a participant repeatedly fails to obtain service. **Livelock** means participants keep changing state without useful progress. Neither needs the same blocked cycle.

## 5. Virtual pages and physical frames

A **virtual page** is a fixed-size block in the address space a program uses. A **physical frame** is a block of the corresponding size in physical memory, where that page can be stored.

A page table records mappings and access permissions. A **translation lookaside buffer (TLB)** caches recent translations.

A TLB miss does not necessarily mean that data is absent from memory. It can require a page-table lookup while the page remains resident.

For an assumed 4096-byte page, the low 12 address bits form the page offset. Translation changes the page number while preserving that offset.

For virtual address 0x12345, the virtual page number is 0x12 and the offset is 0x345.

If the page maps to physical frame 0xAB, the physical address is 0xAB345. This example excludes address-space identifiers and other architecture-specific fields.

### Page faults

A **page fault** transfers control to the OS because the translation or access cannot complete normally.

The OS checks whether the access is valid. It can provide a missing page, perform copy-on-write, or reject an invalid access.

Not every page fault needs a storage-device read. A new zero-filled page or a resident shared page can be handled without one.

To recover and resume correctly, the processor and OS must keep enough information about what failed. A device operation may already be partly complete, so retry it only according to its documented restart rules.

### Working sets and replacement

A **working set** is the group of pages a process actively uses during a period of time. If too few of them fit in physical memory, the system can spend its time repeatedly moving pages instead of doing useful work. This is **thrashing**.

When a page must be replaced, local replacement chooses one from the process that caused the fault. Global replacement can choose one from a wider pool, including pages used by other processes.

Global policies can adapt allocation across processes. They can also let one workload disturb another workload's resident pages.

Smaller pages reduce wasted space within partly used pages. Larger pages can reduce page-table overhead and increase TLB coverage.

The processor supports specific page sizes. The OS can choose among those sizes, but it cannot use any size it likes.

## 6. Shared pages, dirty pages, and device transfers

Processes can share read-only code pages. They can also explicitly share writable data pages when their synchronization rules permit it.

**Copy-on-write** delays a private copy until a process writes a shared page that needs private modifications.

A **dirty page** contains changes that its backing copy does not contain. A clean file-backed page can often be discarded and read again later.

Preserving a dirty page can require a write to its backing file or swap storage. Not all systems support swapping.

Device transfers need stable buffer mappings for their duration. Drivers can pin pages or use suitable kernel buffers, according to the OS interface.

Pinning keeps a buffer's memory in place, but does not automatically keep caches consistent, give a device permission to access it, or order memory operations correctly. Use the platform's direct-memory-access mapping interface for those requirements.

## 7. Files, directories, and metadata

A **file system** maps names and logical file positions to stored data. It also tracks allocation, permissions, and other metadata.

A directory maps names to file objects. In an inode-based system, an **inode** records metadata and how to locate file data.

Some file systems locate data with direct block pointers and additional layers of indirect pointers. Others use contiguous block ranges called extents, or tree structures. The choice depends on the file-system implementation.

A pathname lookup resolves each directory component. Access checks and symbolic links can affect the result.

An open file descriptor identifies an open resource within a process. It is different from the file's permanent name.

## 8. Power loss and file-system consistency

Updating a file can require several data and metadata writes. Power loss between them can leave inconsistent allocation or directory information.

**Journaling** records selected updates before applying them to their final locations. Recovery can replay committed transactions according to the file system's rules.

Metadata journaling helps recover file-system structure, but does not guarantee that every recently written data byte survives. Applications also depend on synchronization calls, write ordering, and what the storage device guarantees about completed writes.

A successful buffered write does not necessarily mean that data reached nonvolatile media. Test the complete storage stack under interrupted writes.

A **log-structured file system** writes new versions into log segments and later reclaims obsolete space. A journal and a log-structured layout serve different roles.

For embedded configuration records, preserve the previous valid version until the replacement is complete. See the [memory power-loss checks](<./Memory.md#4-endurance-and-power-loss>).

## References

The junior notes supply paging, file-system, pipe, thread, and deadlock topics. The counter and address calculations are original examples.

* [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/) gives the authors' chapters on virtualization, concurrency, and persistence.
* [University of Wisconsin: deadlock](https://pages.cs.wisc.edu/~solomon/cs537/html/deadlock.html) explains resource graphs and prevention.
