---
title: Home Assistant Installation
category: Installation
order: 2
---

# Home Assistant Installation

## Prerequisites

- Familiarity with the Congatudo project.
- Root access to your Conga robot via [SSH or ADB](https://congatudo.cloud/pages/installation/robot-setup.html).
- An MQTT server (preferably the Mosquitto broker add-on) installed and running. If you already use MQTT in Home Assistant, the add-on will auto-configure it.
- Basic Linux knowledge.

## Overview

- The Congatudo add-on integrates Conga robots with Home Assistant by generating a `valetudo.json` file in `/config`.
- Each add-on instance manages one robot, so you can control multiple robots by installing multiple instances (main and beta).
- Add-ons run independently, allowing separate configuration and operation for each robot.

## Installation Steps

1. Add the [Congatudo repository](https://github.com/congatudo/congatudo-add-on/) to your Home Assistant Add-on Store.
2. Find and select the "Congatudo" add-on.
3. Click **Install**.
4. After installation, click **Start** and then **Open Web UI** to verify the add-on is running.
5. Enter your robot's credentials and network settings as prompted.

## Connecting Your Robot

To link your Conga robot with the Congatudo add-on:

1. **Connect to WiFi:**  
    Ensure your robot is [connected to your WiFi](https://congatudo.cloud/pages/installation/robot-setup.html).

2. **Access via SSH:**  
    Connect to your robot using SSH. If you need to reset or recover the root password, refer to the [root password recovery guide](https://congatudo.cloud/pages/misc/recovery-root-password.html).

3. **Edit the Hosts File:**  
    Update `/etc/hosts` on your robot to point required domains to your Home Assistant IP.  
    > ⚠️ Replace `YOUR_HOMEASSISTANT_IP` with your actual IP (e.g., `192.168.1.10`).

    ```shell
    echo "YOUR_HOMEASSISTANT_IP cecotec.das.3irobotix.net cecotec.download.3irobotix.net cecotec.log.3irobotix.net cecotec.ota.3irobotix.net eu.das.3irobotics.net eu.log.3irobotics.net eu.ota.3irobotics.net cecotec-das.3irobotix.net cecotec-log.3irobotix.net cecotec-upgrade.3irobotix.net cecotec-download.3irobotix.net" >> /etc/hosts
    ```

4. **Restart the Robot:**  
    ```shell
    reboot
    ```

5. **Verify Connection:**  
    - Check Congatudo add-on logs in Home Assistant to confirm registration.
    - Enable **Show in sidebar** and click **Start** to launch the add-on.

6. **Setup Complete:**  
    🎉 Your Conga robot is now connected to Home Assistant via Congatudo!

## Multi-Robot Support (Beta Add-on)

To control multiple robots, install the Congatudo Beta add-on. Each instance manages a separate robot for seamless integration.

### Beta Add-on Installation

1. Search for **Congatudo Beta** in the Add-on Store.
2. Install the beta add-on.
3. Configure with your second robot’s parameters:
    - `server_cmd_port=4011`
    - `server_map_port=4031`
    - `server_sync_time_port=4051`
4. In the **Info** tab:
    - Enable **Show in sidebar**.
    - Click **Start**.

### Robot Configuration for Beta Add-on

Update your robot’s configuration before using the beta add-on.

#### Quick SSH Configuration

1. **Connect via SSH:**  
    Use PuTTY or another SSH client.

2. **Backup Configuration:**  
    ```shell
    cp /etc/config/sysConfig.ini /etc/config/sysConfig.ini.bak
    ```

3. **Review Current Settings:**  
    ```shell
    cat /etc/config/sysConfig.ini
    ```
    Example:
    ```ini
    [Sys_Config]
    server_cmd_address=cecotec.das.3irobotix.net
    server_map_address=cecotec.das.3irobotix.net
    server_log_address=cecotec.log.3irobotix.net
    server_ota_address=cecotec.ota.3irobotix.net
    server_down_address=cecotec.download.3irobotix.net
    server_cmd_port=4010
    server_map_port=4030
    server_sync_time_port=4050
    ...
    ```

4. **Update Addresses and Ports:**  
    Replace `YOUR_HOMEASSISTANT_IP` with your actual IP:

    ```shell
    sed -i \
     -e 's/^server_cmd_address=.*/server_cmd_address=YOUR_HOMEASSISTANT_IP/' \
     -e 's/^server_map_address=.*/server_map_address=YOUR_HOMEASSISTANT_IP/' \
     -e 's/^server_log_address=.*/server_log_address=YOUR_HOMEASSISTANT_IP/' \
     -e 's/^server_ota_address=.*/server_ota_address=YOUR_HOMEASSISTANT_IP/' \
     -e 's/^server_down_address=.*/server_down_address=YOUR_HOMEASSISTANT_IP/' \
     -e 's/^server_cmd_port=.*/server_cmd_port=4011/' \
     -e 's/^server_map_port=.*/server_map_port=4031/' \
     -e 's/^server_sync_time_port=.*/server_sync_time_port=4051/' \
     /etc/config/sysConfig.ini
    ```

5. **Restart the Robot:**  
    ```shell
    reboot
    ```

6. **Verify Changes (Optional):**  
    After reboot, reconnect and check:
    ```shell
    cat /etc/config/sysConfig.ini
    ```

### Expected Add-on Logs

If setup is correct, logs should show:
```text
[INFO] Webserver running on port 8080
[INFO] Connected successfully to MQTT broker
[INFO] MQTT configured
[INFO] Added new robot with id 'xxxxx'
```

### Managing Multiple Robots

Each add-on instance appears as a separate entity in Home Assistant:
- **Congatudo Add-on:** Controls Robot **A**
- **Congatudo (Beta) Add-on:** Controls Robot **B**

## Credits

Special thanks to [Nismonx](https://github.com/Nismonx/conga-multiple-robots) for their foundational guide, which inspired and informed this integration process.