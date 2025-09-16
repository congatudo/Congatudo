<div align="center">
  <img src="https://raw.githubusercontent.com/congatudo/Congatudo/master/frontend/src/assets/icons/congatudo_logo_with_name.svg" alt="congatudo">
  <h2>Free your vacuum from the cloud</h2>
</div>

Congatudo is a cloud replacement for vacuum robots enabling local-only operation. It is not a custom firmware.
That means that it cannot change anything about how the robot operates.

Congatudo provides control over your vacuum robot via a **responsive web interface** that works on all of your devices.
It can be used on phones, tablets as well as your desktop computer.

Based on **[Valetudo](https://valetudo.cloud/)**. Please, consider donating to the **[Valetudo project](https://github.com/sponsors/Hypfer)**.

| Brand   | Serie | Models tested and supported                                   |
|---------|-------|---------------------------------------------------------------|
| Cecotec | Conga | 3XXX (except for 3890), 4XXX (except for 4690), 5090 and 5490 |

These pages guide you through the installation steps for Cecotec Conga robots.
Support is still somewhat experimental, everything in this guide is under your responsibility.

- The default settings here will be for running Congatudo on the robot itself, **[Standalone installation](https://congatudo.cloud/installation/standalone-installation/)**.
- It could run on a server using Docker, **[Docker installation](https://congatudo.cloud/installation/docker-installation/)**.
- Or use the **[Home Assistant addon](https://congatudo.cloud/installation/home-assistant-installation/)**.
- If you want to develop as well, check out the **[Local Development guide](https://congatudo.cloud/pages/development/building-and-modifying-congatudo.html)**.

Any of the ways to get Valetudo running for the robot needs root access to your Conga, so here it will be explained too: **[Robot Setup](#robot-setup)**.

Please give it a try and **[file any issues that you encounter here](https://github.com/congatudo/Congatudo/issues)**.

- [Summary](#)
  - [Robot setup](#robot-setup)
  - [Standalone installation](#standalone-installation)
  - [Docker installation](#docker-installation)
  - [Home Assistant addon](#home-assistant-addon-installation)
  - [FAQ](#faq)
  - [Join the discussion](#join-the-Discussion)
  - [License](#license)

## Robot setup
Follow the **[Robot Setup guide](https://congatudo.cloud/pages/installation/robot-setup.html)** for instructions on preparing your Cecotec Conga robot. This includes gaining root access and configuring your device to work with Congatudo.

## Standalone installation
For running Congatudo directly on your robot, refer to the **[Standalone Installation guide](https://congatudo.cloud/installation/standalone-installation/)**. This guide covers all steps required to install and configure Congatudo for local-only operation.

## Docker installation
If you prefer to run Congatudo on a server or another device, check the **[Docker Installation guide](https://congatudo.cloud/installation/docker-installation/)**. This guide explains how to set up Congatudo using Docker for easier management and updates.

## Home Assistant addon installation
If you want to integrate Congatudo into your Home Assistant installation, check the **[Home Assistant Installation guide](https://congatudo.cloud/installation/home-assistant-installation/)**.

## FAQ
1. I have Congatudo up and running but no robot is found
```
Check if hosts file in the robot is already edited.
Ping to a one of the cecotec cloud server instances to check if it reaches the conga ip, i.e.:
ping cecotec.das.3irobotix.net
```
2. I try to run a dockerized Valetudo server in my Raspberry server with Raspbian, but I got an error
```
Check https://github.com/Koenkk/zigbee2mqtt/issues/7662
```
3. Valetudo doesn't save the map, it is always remapping and it didn't save my segments.
```
Check the notifications and accept the new map generated
```
4. Congatudo can't initialize and log says:
```shell
[2023-03-15T19:42:03.531Z] [WARN] WifiConfigurationCapabilityRouter: Error while handling route "/" {

  body: {},

  message: "Cannot read properties of null (reading 'toString')"
```
```
Check the embedded property of your configuration file, you may try to run Congatudo in a server but embedded option set as true.
```

## Join the Discussion
* **[Congatudo Telegram group](https://t.me/congatudo)**
* **[Congatudo Web](https://congatudo.cloud)**

## LICENSE
This work is licensed under the **[Apache License 2.0](https://github.com/congatudo/Congatudo/blob/master/LICENSE)**. All media and data files that are not source code are licensed under the **[Creative Commons Attribution 4.0 BY-SA license](https://creativecommons.org/licenses/by/4.0/)**.

More information about licenses in **[Opensource licenses](https://opensource.org/licenses/)** and **[Creative Commons licenses](https://creativecommons.org/licenses/)**.
