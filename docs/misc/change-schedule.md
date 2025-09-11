---
title: Change schedule
category: Misc
order: 51
---

# Change schedule

If your Conga robot starts cleaning unexpectedly after disconnecting from the Conga Cloud, it's likely due to a previously configured schedule that remains active on the device.

To resolve this, you have two options:
- **Disable Congatudo and turn off the schedule using the mobile app.**
- **Manually edit the schedule configuration file on the robot.**

The schedule configuration file is located at `/mnt/UDISK/config/booking_list_config.ini`. You can access and modify it via [SSH](https://congatudo.cloud/pages/installation/robot-setup.html).

⚠️ If you need to reset or recover the root password, refer to the [root password recovery guide](https://congatudo.cloud/pages/misc/recovery-root-password.html).

Below is an example configuration file from a Conga 4090:

```
[Booking_Size]
size=1


[order_task_0]
order_enable=1
order_id=1588517833
clean_flag=0
weekday=36
repeat=1
daytime=1140
mapid=1611924380
planid=1
cleanmode=1
windpower=2
waterlevel=12
twiceclean=0
room_id_list_size=0
```

This example contains only one schedule, which is controled with the flag `order_enable`. If you want to disable all schedule, change all `order_enable=1` to `order_enable=0`

## Information about the config

> ⚠️ **Note:** The details below are based on observations and may not be fully accurate for all models or firmware versions. Use this information with caution and verify changes before applying them to your device.

```
[Booking_Size]
# Total number of scheduled tasks installed
size=1

# The index is reversed compared to what is shown in the app; it goes from 0 to n from bottom to top
[order_task_0]

# 1 = enabled, 0 = disabled
order_enable=1

# Random?
order_id=1588517833

clean_flag=0

# Days of the week, represented as powers of 2 and summed: Sun=1, Mon=2, Tue=4, Wed=8, Thu=16, Fri=32, Sat=64
# Example: Monday and Wednesday: 2+8 = 10
weekday=36

repeat=1

# Start time, in seconds since 00:00 (24h format)
daytime=1140

# Map. The source of this value is unclear
mapid=1611924380

# Plan. 1 = Full cleaning, 2 = Default (uncertain if there are more options)
planid=1

# Mode. 1 = Auto, 3 = Edges, 4 = Mopping
cleanmode=1

# Suction power. 0 = OFF, 1 = Eco, 2 = Normal, 3 = Turbo
windpower=2

# Water level. 10 = OFF, 11 = Low, 12 = Medium, 13 = High
waterlevel=12

# Twice mode, 1 = ON, 0 = OFF
twiceclean=0

room_id_list_size=0
```
