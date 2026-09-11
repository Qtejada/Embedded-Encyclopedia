---
title: Processor Caches and Memory Access
sidebar_position: 24
---

import LearningEquation from '@site/src/components/LearningEquation';

# Processor Caches and Memory Access

## 1. Locality and cache lines

A **cache** keeps copies of selected memory blocks near the processor. A matching resident block gives a hit. An absent block gives a miss.

**Temporal locality** means recently used data is likely to be used again. **Spatial locality** means nearby addresses are likely to be used.

A **cache line** holds a block of neighboring bytes. It also needs identification and state information.

Sequential array access often uses several bytes from each fetched line. A large stride can use only one element before moving to another line.

The [five-stage processor](<./RISC-V-Pipeline.md#teaching-model-assumptions>) assumes one-cycle memory. Cache misses can add stalls that its simple timing model excludes.

## 2. Placement and associativity

| Organization | Permitted placement for a memory block |
| --- | --- |
| Direct mapped | One cache line selected by the index. |
| Set associative | Any way within one selected set. |
| Fully associative | Any line in the cache. |

A **way** is one possible line position within a set. A two-way cache has two positions per set.

More ways can reduce conflicts between blocks that share an index. They also require more comparisons and a replacement decision.

Capacity, associativity, line size, and access time are separate design choices. More associativity does not guarantee a faster complete processor.

## 3. Split the address

Assume byte addressing and power-of-two line and set counts. Split the address into **tag**, **set index**, and **byte offset**.

The offset selects a byte within a line. The index selects a set. The tag distinguishes memory blocks that map to the same set.

<LearningEquation tex={String.raw`S=\frac{C}{BW},\qquad b=\log_2B,\qquad i=\log_2S,\qquad t=A-b-i`} />

Here, C is data capacity in bytes, B is bytes per line, W is ways, and S is sets. A is address width in bits.

The bit counts b, i, and t describe the offset, index, and tag. This capacity excludes tags, valid bits, and replacement metadata.

### Worked example: a 4-kibibyte cache

Assume 32-bit addresses, 4096 data bytes, 16-byte lines, and two ways. The cache has 128 sets.

The offset uses 4 bits. The index uses 7 bits. The tag uses the remaining 21 bits.

For address 0x1234, the offset is 4, the set index is 35, and the tag is 2.

Reconstruction verifies the split: ((2 times 128) + 35) times 16 + 4 = 4660, which equals hexadecimal 1234.

Addresses 0x1234 and 0x123C share one line. Address 0x1A34 uses the same set with a different tag.

A valid bit distinguishes real content from an unused line. Matching a tag alone is insufficient when the valid bit is clear.

## 4. Conflict trace

Assume a cold 64-byte direct-mapped cache with 16-byte lines. It has four sets. Read byte addresses 0, 64, 0, and 64.

| Access | Set | Tag | Result |
| --- | --- | --- | --- |
| 0 | 0 | 0 | Miss. Install tag 0. |
| 64 | 0 | 1 | Miss. Replace tag 0. |
| 0 | 0 | 0 | Miss. Replace tag 1. |
| 64 | 0 | 1 | Miss. Replace tag 0. |

Both blocks compete for set zero. Most of the cache remains unused, but every access misses.

With the same data capacity and two ways, the cache has two sets. Both blocks can remain in set zero.

The first two reads miss and the next two hit. This example isolates a placement conflict rather than a capacity shortage.

## 5. Miss classes and replacement

A **compulsory miss** occurs on the first access to a block. A **capacity miss** occurs because the active data exceeds available cache capacity.

A **conflict miss** results from placement restrictions. A fully associative cache of the same capacity can avoid such placement conflicts under an appropriate comparison policy.

Replacement policies include least recently used, approximations to that policy, and random selection. A direct-mapped cache has no choice of victim within its set.

Larger lines can exploit spatial locality. They also transfer more unused bytes and leave fewer lines for a fixed data capacity.

## 6. Write policies

**Write-through** sends a cache write toward the next memory level. A write buffer can delay completion at that lower level.

**Write-back** changes the resident cache line and marks it dirty. Eviction or an explicit maintenance operation later transfers the changed data.

Write-hit policy and write-miss allocation are different decisions.

| Write miss policy | Action |
| --- | --- |
| Write allocate | Bring the block into the cache, then update it according to the write policy. |
| No write allocate | Send the write onward without installing that block in this cache. |

A write-back cache must preserve dirty data before reusing its line. A clean line can be discarded without a writeback.

Device registers can require uncached or specially ordered accesses. Do not treat a peripheral register like ordinary cached RAM.

## 7. Average access time

For a simple serial lookup model:

<LearningEquation tex={String.raw`T_{avg}=T_{hit}+r_{miss}P_{miss}`} />

The miss penalty is additional time after the initial cache lookup. Avoid counting that lookup twice.

Assume a 1-nanosecond hit time, a 5-percent miss rate, and a 40-nanosecond additional miss penalty.

The average access time is 1 + 0.05 times 40 = 3 nanoseconds.

For two levels, use the second-level miss rate conditional on a first-level miss when evaluating the nested penalty.

<LearningEquation tex={String.raw`T_{avg}=T_1+r_1(T_2+r_2P_{memory})`} />

This simplified model excludes overlapping misses, prefetches, write-buffer stalls, and contention. Real execution time can differ substantially.

## 8. Cache coherence and shared buffers

Two processors can hold copies of the same memory line. A coherence protocol coordinates which copies may supply or modify data.

**False sharing** occurs when independent variables occupy one line and different processors modify them. Ownership traffic can slow otherwise independent operations.

Some direct-memory-access devices do not participate in processor cache coherence. Drivers must use the platform's documented buffer mapping and maintenance rules.

Before a device reads a buffer, dirty processor data may need cleaning. Before the processor consumes device-written data, stale cache content may need invalidation.

Do not invalidate dirty unrelated data accidentally. Cache-line alignment, ownership, and the correct operation order all matter.

Coherence does not replace synchronization. Use the required atomic operations, locks, and memory barriers for shared software state.

See [virtual pages and physical frames](<./Operating-Systems.md#5-virtual-pages-and-physical-frames>) for address translation. A cache line and a virtual page serve different purposes.

## References

The junior architecture notes supply locality, cache mapping, write policies, and performance topics. Address and conflict traces use original assumed cache configurations.

* [Cornell CS 3410: caches](https://www.cs.cornell.edu/courses/cs3410/2025fa/notes/caches.html).
