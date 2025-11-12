+++
date = '2024-08-11T20:10:31-08:00'
draft = false
title = 'ARM GIC Interrupt Toggle Guide'
toc = true
tocBorder = true
+++
## GICD_ISENABLER and GICD_ICENABLER
The ARM Generic Interrupt Controller architecture specification describes two
sets of registers meant for enabling and disabling the forwarding
of interrupts at the GIC Distributor.
- Interrupt Set-Enable Registers: GICD_ISENABLER<n>
- Interrupt Clear-Enable Registers: GICD_ICENABLER<n>

For INTID `m`, when DIV and MOD are the integer division and modulo operati=
ons:
- The corresponding ENABLER<n> number, `n`, is given by:
> n = m DIV 32
- The offset of the required I<u>S</u>ENABLER<n> (Enable) is:
> (0x100 + (4*n))
- The offset of the required I<u>C</u>ENABLER<n> (Disable) is:
> (0x180 + (4*n))
- The bit number of the required group modifier bit in this register is:
> m = MOD 32

NOTE: Writing a 1 to a GICD_ICENABLER<n> bit only disables the forwarding of the
corresponding interrupt from the Distributor to any CPU interface. It does not
prevent the interrupt from changing state, for example becoming pending or
active and pending if it is already active

## APU GIC Base Address
The Zynq Ultrascale+ Devices Register Reference (UG1087) contains information on
the APU GIC Interrupt Controller and its registers.

|   Register Name   |    Offset    |
| :-----------------: | :------------: |
| GICD_ISENABLER0   | 0x0000010100 |
| GICD_ISENABLER1   | 0x0000010104 |
| GICD_ISENABLER2   | 0x0000010108 |
| GICD_ISENABLER3   | 0x000001010C |
| GICD_ISENABLER4   | 0x0000010110 |
| GICD_ISENABLER5   | 0x0000010114 |
| GICD_ICENABLER0   | 0x0000010180 |
| GICD_ICENABLER1   | 0x0000010184 |
| GICD_ICENABLER2   | 0x0000010188 |
| GICD_ICENABLER3   | 0x000001018C |
| GICD_ICENABLER4   | 0x0000010190 |
| GICD_ICENABLER5   | 0x0000010194 |

NOTE: Base address of the APU GIC Interrupt for Zynq Ultrascale+ Devices is
`0xF9000000` but the offsets start at `0x10000` giving us `0xF9010000`
as our base address.

## Determining the Interrupt ID (INTID)
The Zynq UltraScale+ TRM (UG1085) Table 13-1 lists all system interrupts and
their corresponding GIC number. PL_PS_Group 0 and 1 corresponds to interrupts
from the PL which enter the PS at the GIC. You can stipulate the GIC number of
your interrupt signal from this.

|    Name       |  GIC #  |           Description              |
| ------------- | ------- | ---------------------------------- |
| PL_PS_Group0  | 121:128 | PL to PS interrupt signals 0 to 7  |
| PL_PS_Group1  | 136:143 | PL to PS interrupt signals 8 to 15 |

> Example: I routed a UART interrupt to pin 0 of the GIC, therefore my GIC#/INTID is 121

You can also determine the INTID on target with:
```bash
$ cat /proc/interrupts
...
  22:          0          0     GIC  35 Level     arm-pmu
  23:          0          0     GIC  37 Level     cdns-i2c
  24:         42          0     GIC  38 Level     cdns-i2c
 138:       1254          0     GIC 138 Level     ptp_sync
 139:          0          0     GIC 139 Level     xilinx-dpdma
 140:          0          0     GIC 140 Level     xilinx-display
```
*INTID is the value after GIC (35, 37, etc)*
## C Example
NOTE: When modifying GIC registers in a multi-core system, ensure proper
synchronization and use appropriate memory barriers. This prevents race
conditions and ensures that changes are visible across all cores.
This example is <u>NOT</u> a final product.
```c
#define GIC_ENABLER_BASE_ADDR                     0xF9010000U
#define IC_ENABLER_OFFSET(n)                (0x180 + (4 * n))
#define IS_ENABLER_OFFSET(n)                (0x100 + (4 * n))

#define BITS_PER_REGISTER                                  32
#define REG_INDEX(int_num)      (int_num / BITS_PER_REGISTER)
#define BIT_POSITION(int_num)   (int_num % BITS_PER_REGISTER)

const uint32_t INTID = 138; // arbitrary #

// Calculate the register index and bit position for the interrupt
uint32_t reg_index = REG_INDEX(INTID);
uint32_t bit_position = BIT_POSITION(INTID);

// Calculate the memory offset for the clear-enable register
uint32_t clear_enable_offset = IC_ENABLER_OFFSET(reg_index);

// Get a pointer to the clear-enable register
volatile uint32_t* enabler_offset = (volatile uint32_t*)((uint8_t*)mapped_base + clear_enable_offset);

// Set the bit to disable the interrupt
*enabler_offset |= (1 << bit_position);
```

## References
- ARM Generic Interrupt Controller Architecture Specification (12.9.7, 12.9.26)
- Zynq UltraScale+ Device TRM (UG1085) (Table 13-1)
- Zynq UltraScale+ Devices Register Reference (UG1087) (GIC400 Module)