# BJTs

[TOC]

- Small base current used to control a large current flowing from collector to emitter

- base-emitter and base-collector are like diodes. Rules of operation:

  $V_C > V_B$ and $V_{BE} = 0.7v$, then you are in active mode

  $V_{BE} > 0.7$ and $V_B > V_C$, saturation mode

  $V_{BE} < 0.7v$, cutoff

When looking at transistors, you got 2 methods, general rule and ebers-moll. Use the general rule most of the time for simple analysis

The following is done under general analysis:

- $I_C = I_B * beta$  
  Your circuit designs should not rely on beta. Its a funky parameter that can very wildly. You should not rely on it ever.

- $V_B$ is about equal to $V_E + 0.7v$  
  This will hold true when always when the transistor is conducting (general analysis). If this is false, then the transistor is in cutoff.

- The transistor is a device which allows a small current (base current) to control a larger current (collector). So as the bass current increases, so does the collector current flowing. As there's more bass current, the transistor can end up like a short between collector and emitter. As there's less current, it acts like an open among terminals.

## Active mode:

- Occurs when: $V_B > V_E$ by $0.7v$ and $V_C > V_B$

- You can balance/bias your transistor at a certain point. The point you choose is the quiescent point where your circuit is based off of

### Dual supply biasing vs voltage divider biasing: 

- when using a voltage divider, with a coupling cap, you couple the AC source to ride the dc voltage of divider, and it can swing presumably from mid rail voltage as a starting point to rail voltage and ground

- when using dual supply, both base and signal biased at 0v, the signal can swing from VCC and VEE freely. LTSPICE model below to help visualize

## Understanding Saturation: 

- Occurs when $I_B * beta$ is greater than the possible current suppliable by $I_C$. $I_B * beta > I_C$

- Because $I_C = I_B * beta$, Collector will try to pull more current than what's possible.

- More and more voltage will drop across the collector resistor leaving no voltage left for the collector to drop. So collector voltage is near 0 in saturation.

- The base-collector diode is now conducting.

### What it means:
- $V_{CE}$ goes as close to ground as it can.
- The transistor now acts like a switch. all the possible current from $I_C$ flows into $I_E$

### Uses:

- You can use a transistor as a switch by saturating it. 
- What you want to make sure is that when you are forcing $I_B * beta > I_C$, DO NOT RELY ON BETA. Make the base current high so that even a low ball base current can saturate it. Some LTSpice examples below

## Understanding Cutoff:

- Occurs when $V_{BE}$ is not forward biased, or $I_B$ is 0.
- Possible by grounding base, or making $V_E > V_B$

### What it means:

- Collector current wont flow for physics reasoning.
- All terminals for themselves.

## Using a PNP

- If you want a load to start off grounded then switching into a positive supply, you'd need a PNP
because if not, the emitter side would need the voltage source and then $V_{BE}$ cant be > $0.7v$. 

- Can use a PNP cascaded with an emitter follower to remove that $0.7v$ offset produced by $V_{BE}$ on NPN

## KVL with BJTs:

When you're getting the voltage at the base or trying to find the current, remember that the base and emitter are "tied" as in don't forget the $0.7v$ drop at the appropriate junction (NPN: Base emitter, PNP: $+0.7$ Emitter-base)

## Emitter follower:

Another Use for transistors:
- Emitter follower has a high input impedance but a very low output impedance

- This means you can drive a higher impedance load with a relatively low impedance signal without the fear of it getting loaded down. 

- $R_{in} = (beta + 1) R$, R is the load impedance/output impedance

- There's no collector resistor because u don't want to saturate it. 

## Current Source:

- Transistors can be used as a current source by adding a load to the collector. 

- An example of a current source is a voltage applied to a very large source resistance. In that case, any load attached to it, as long as $R_{source} >> R_{load}$, will not incur more current draw. The current draw is constant regardless of the load

- Using resistors in this case is bad because they use a lot of power

- BJTS can fulfil this role with a collector resistor as follows:  
  Given $V_E = V_B - 0.7v$,  
  $I_E = V_E/R_E = (V_B - 0.7)/R_E$  
  $I_E$ is about equal to $I_C$ for high beta  
  $I_C = (V_B - 0.7)/R_E$  
  Regardless of what $V_C$ as long as its not saturated, $I_C$ stays the same.

- You can provide that base voltage with a voltage divider, as long as the impedance of it is $< beta * R_E$. 
- The only requirement for this is that the transistor stays in the active region. You can produce as the same amount of current regardless of the load connected to the collector.

- By varying $V_B$ you get a voltage controlled current source

## Common emitter amplifier:

Another use is the common emitter amplifier.

$V_{out} = V_{CC} - I_C R_C$  
output gain =  $-R_C/R_E$

- You should be able to perform basic voltage analysis to see why this is.

The output is 180 degrees out of phase of the input.

## Unity phase splitter LTSpice simulation:

- Considered a transconductance amplifier, meaning that the ratio of changes is current/voltage = 1/resistance  
A change in current at the base results in a change in voltage at the collector

If $R_E$ is not there what happens? Not do-able with general analysis. Need to use Ebers-moll model.

---

# BJTs

- Small base current used to control a large current flowing from collector to emitter

- base-emitter and base-collector are like diodes. Rules of operation:

  $V_C > V_B$ and $V_{BE} = 0.7v$, then you are in active mode

  $V_{BE} > 0.7$ and $V_B > V_C$, saturation mode

  $V_{BE} < 0.7v$, cutoff

When looking at transistors, you got 2 methods, general rule and ebers-moll. Use the general rule most of the time for simple analysis

The following is done under general analysis:

- $I_C = I_B * beta$  
  Your circuit designs should not rely on beta. Its a funky parameter that can very wildly. You should not rely on it ever.

- $V_B$ is about equal to $V_E + 0.7v$  
  This will hold true when always when the transistor is conducting (general analysis). If this is false, then the transistor is in cutoff.

- The transistor is a device which allows a small current (base current) to control a larger current (collector). So as the bass current increases, so does the collector current flowing. As there's more bass current, the transistor can end up like a short between collector and emitter. As there's less current, it acts like an open among terminals.

## Active mode:

- Occurs when: $V_B > V_E$ by $0.7v$ and $V_C > V_B$

- You can balance/bias your transistor at a certain point. The point you choose is the quiescent point where your circuit is based off of

### Dual supply biasing vs voltage divider biasing: 

- when using a voltage divider, with a coupling cap, you couple the AC source to ride the dc voltage of divider, and it can swing presumably from mid rail voltage as a starting point to rail voltage and ground

- when using dual supply, both base and signal biased at 0v, the signal can swing from VCC and VEE freely. LTSPICE model below to help visualize

## Understanding Saturation: 

- Occurs when $I_B * beta$ is greater than the possible current suppliable by $I_C$. $I_B*beta > I_C$

- Because $I_C = I_B * beta$, Collector will try to pull more current than what's possible.

- More and more voltage will drop across the collector resistor leaving no voltage left for the collector to drop. So collector voltage is near 0 in saturation.

- The base-collector diode is now conducting.

### What it means:
- $V_{CE}$ goes as close to ground as it can.
- The transistor now acts like a switch. all the possible current from $I_C$ flows into $I_E$

### Uses:

-  You can use a transistor as a switch by saturating it. 
-  What you want to make sure is that when you are forcing $I_B * beta > I_C$, DO NOT RELY ON BETA. Make the base current high so that even a low ball base current can saturate it. Some LTSpice examples below

## Understanding Cutoff:

- Occurs when $V_{BE}$ is not forward biased, or $I_B$ is 0.
- Possible by grounding base, or making $V_E > V_B$

### What it means:

- Collector current wont flow for physics reasoning.
- All terminals for themselves.

## Using a PNP

- If you want a load to start off grounded then switching into a positive supply, you'd need a PNP
because if not, the emitter side would need the voltage source and then $V_{BE}$ cant be > $0.7v$. 

- Can use a PNP cascaded with an emitter follower to remove that $0.7v$ offset produced by $V_{BE}$ on NPN

## KVL with BJTs:

When you're getting the voltage at the base or trying to find the current, remember that the base and emitter are "tied" as in don't forget the $0.7v$ drop at the appropriate junction (NPN: Base emitter, PNP: $+0.7$ Emitter-base)

## Emitter follower:

Another Use for transistors:
- Emitter follower has a high input impedance but a very low output impedance

- This means you can drive a higher impedance load with a relatively low impedance signal without the fear of it getting loaded down. 

- $R_{in} = (beta +1)R$, R is the load impedance/output impedance

- There's no collector resistor because u don't want to saturate it. 

## Current Source:

- Transistors can be used as a current source by adding a load to the collector. 

- An example of a current source is a voltage applied to a very large source resistance. In that case, any load attached to it, as long as $R_{source} >> R_{load}$, will not incur more current draw. The current draw is constant regardless of the load

- Using resistors in this case is bad because they use a lot of power

- BJTS can fulfil this role with a collector resistor as follows:  
  Given $V_E = V_B - 0.7v$,  
  $I_E = V_E/R_E = (V_B - 0.7)/R_E$  
  $I_E$ is about equal to $I_C$ for high beta  
  $I_C = (V_B - 0.7)/R_E$  
  Regardless of what $V_C$ as long as its not saturated, $I_C$ stays the same.

- You can provide that base voltage with a voltage divider, as long as the impedance of it is $< beta * R_E$. 
- The only requirement for this is that the transistor stays in the active region. You can produce as the same amount of current regardless of the load connected to the collector.

- By varying $V_B$ you get a voltage controlled current source

## Common emitter amplifier:

Another use is the common emitter amplifier.

$V_{out} = V_{CC} - I_C R_C$  
output gain =  $-R_C/R_E$

- You should be able to perform basic voltage analysis to see why this is.

The output is 180 degrees out of phase of the input.

## Unity phase splitter LTSpice simulation:

- Considered a transconductance amplifier, meaning that the ratio of changes is current/voltage = 1/resistance  
A change in current at the base results in a change in voltage at the collector

If $R_E$ is not there what happens? Not do-able with general analysis. Need to use Ebers-moll model.
