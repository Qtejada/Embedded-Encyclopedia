---
title: Sequential Logic and VHDL
sidebar_position: 28
---

# Sequential Logic and VHDL

## 1. Describe hardware behavior

**VHDL** means VHSIC Hardware Description Language. VHSIC means Very High Speed Integrated Circuit.

A VHDL **entity** defines ports and parameters. An **architecture** describes the implementation.

Concurrent statements describe hardware that operates together. Statements inside a process execute sequentially when that process resumes.

Statement order does not imply one clock cycle per statement. Registers appear from the described storage behavior.

**Register-transfer level (RTL)** describes registers and the logic between them. Synthesis converts suitable RTL into a hardware implementation.

## 2. Clocked and combinational processes

A clocked process can describe edge-triggered registers. In a combinational process, assign each output on every possible path.

An incomplete combinational assignment can infer a latch. An omitted assignment in a clocked process can describe a register enable.

VHDL-2008 permits `process(all)` for a combinational process. Earlier language versions require an explicit sensitivity list.

A **signal assignment** schedules a signal update. A **variable assignment** immediately changes the variable within that process execution.

In a clocked process, `a <= b` followed by `c <= a` gives c the previous value of a. Both registers update after the process suspends.

A **delta cycle** advances simulation scheduling without advancing physical simulation time. It does not represent a hardware clock cycle.

## 3. State, transitions, and outputs

A **finite-state machine (FSM)** stores its current state in registers. Combinational logic computes the next state and outputs.

A **Moore output** depends on state. A **Mealy output** also depends on the current input.

The existing [state-machine experiment](<./DigitalGeneral.md#state-machine-experiment>) compares these output rules. An asynchronous input must first satisfy the required synchronization protocol.

### Worked example: detect 101

Assume one synchronous input bit arrives on each rising clock edge. Detect overlapping occurrences of 101.

| State | Meaning | Input 0: next state | Input 1: next state |
| --- | --- | --- | --- |
| Empty | No useful suffix | Empty | Saw1 |
| Saw1 | Last useful suffix is 1 | Saw10 | Saw1 |
| Saw10 | Last useful suffix is 10 | Empty | Saw1, with detection |

After detection, retain the last 1 as the start of another match. The stream 10101 has matches ending at bits three and five.

This implementation registers the detection output. The output describes the bit sampled at the latest edge and remains stable between edges.

```vhdl
library ieee;
use ieee.std_logic_1164.all;

entity detect_101 is
  port (
    clk, reset, bit_in : in std_logic;
    match : out std_logic
  );
end entity;

architecture rtl of detect_101 is
  type state_t is (Empty, Saw1, Saw10);
  signal state : state_t;
begin
  process(clk)
  begin
    if rising_edge(clk) then
      if reset = '1' then
        state <= Empty;
        match <= '0';
      else
        match <= '0';
        case state is
          when Empty =>
            if bit_in = '1' then
              state <= Saw1;
            end if;
          when Saw1 =>
            if bit_in = '0' then
              state <= Saw10;
            end if;
          when Saw10 =>
            if bit_in = '1' then
              state <= Saw1;
              match <= '1';
            else
              state <= Empty;
            end if;
        end case;
      end if;
    end if;
  end process;
end architecture;
```

Apply reset across a rising edge before using the detector. Reset is synchronous and active high.

The example assumes bit_in is either zero or one at each sampling edge. It does not define a recovery policy for unknown simulation values.

### Verification sequence

After reset, apply 1, 0, 1, 0, 1 before five successive edges. The corresponding match values after those edges must be 0, 0, 1, 0, 1.

Also test repeated zeros, repeated ones, reset during a partial match, and two matches separated by zeros. Check outputs after scheduled signal updates.

## 4. State encoding

Binary encoding uses enough bits to identify every state. Three states require at least two bits.

One-hot encoding uses one bit per state, with one active bit. It can simplify transition logic but uses more registers.

Synthesis can change an enumerated state's encoding. Inspect the implementation when encoding affects timing, power, or fault recovery.

An unused binary pattern does not automatically have a safe recovery path. Check tool support and the required fault response.

## 5. Simulation and synthesis limits

An `after` delay can model simulation timing. It does not generally create a corresponding physical delay element during synthesis.

**Inertial delay** can reject short pulses in simulation. **Transport delay** schedules every modeled transition.

Neither model replaces static timing analysis. Real pulse propagation depends on the cells, loads, and routing.

Use clock enables instead of ordinary logic gates on a clock path. Dedicated clock-control resources require their specified connection and timing rules.

Check [setup and hold constraints](<./CMOS-Design.md#7-register-timing-and-clock-skew>) after implementation. A correct functional simulation does not establish timing closure.

## 6. Control and datapath

A **datapath** contains registers, arithmetic units, and selectors. A **controller** selects operations and register updates.

Hardwired control uses logic and state transitions directly. Microprogrammed control reads control words from a control store.

Both methods must define memory waits, reset behavior, and exceptional conditions. A control diagram alone does not specify every timing detail.

In a processor, control bits must follow the correct instruction through [pipeline registers](<./RISC-V-Pipeline.md#data-and-control-must-remain-together>). A stall or flush must affect control and data consistently.

## References

* [AMD Vivado synthesis guide: sequential assignments](https://docs.amd.com/r/en-US/ug901-vivado-synthesis/Sequential-Assignments)
* [AMD Vivado synthesis guide](https://docs.amd.com/r/2024.2-English/ug901-vivado-synthesis)
