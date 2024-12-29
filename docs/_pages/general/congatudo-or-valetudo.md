---
title: Congatudo or Valetudo
category: General
order: 3
---

# Congatudo or Valetudo

Valetudo and Congatudo are both open-source projects designed to enable local-only operation of robotic vacuum cleaners, eliminating the need for cloud-based services. However, they cater to different brands and employ distinct approaches:

## Valetudo:

- Supported Devices: Primarily supports vacuum robots from brands like Xiaomi, Roborock and Dreame. You can check the list of supported devices on [Valetudo website](https://valetudo.cloud/pages/general/supported-robots.html).
- Implementation: Valetudo is installed directly on the robot as a replacement for the manufacturer's firmware. This setup requires rooting the device to gain the necessary access for installation.

## Congatudo

- Supported Devices: Specifically designed for Cecotec Conga vacuum robots. You can check the list of supported devices [here](https://congatudo.cloud/pages/general/supported-robots.html)
- Implementation: Unlike Valetudo, Congatudo is not a custom firmware and does not require rooting the robot. Instead, it acts as a cloud replacement by redirecting the robot's communication from the manufacturer's servers to a local server. This approach maintains the robot's original firmware while enabling local control.

## Key Differences:

- Device Compatibility: Valetudo supports a range of devices from multiple manufacturers, while Congatudo is tailored specifically for Cecotec Conga robots.
- Installation Method: Valetudo requires rooting the robot to replace cloud services directly on the device. Congatudo does not modify the robot's firmware; instead, it redirects communication to a local server, avoiding the need for rooting.

In summary, while both projects aim to provide local control over robotic vacuum cleaners, Valetudo and Congatudo differ in their device compatibility and implementation methods, each tailored to the specific requirements of the robots they support.