---
title: Conga, Files to backup
category: Misc
order: 33
---

## Important Conga Stuff

These is a list of important files on the robot.

---

#### List of files/folder

Zones + Spots configuration, mqtt + other config

`/mnt/data/valetudo/valetudo_config.json`

Status to keep map

`/mnt/UDISK/log`

---

## How to Backup and Restore Map Information from Conga Robot

Follow these steps to backup and restore the mapping information of your Conga robot using SCP (Secure Copy Protocol).

---

### 1. Backup Map Information

#### **For Mac/Linux Users:**

Use the following SCP command to copy map data from your Conga robot to your local computer:

```shell
scp -rp -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa -O 'root@<CONGA_IP_ADDRESS>:/mnt/UDISK/log/' '/path/to/local/backup/'
```

Note: "-O" Option may error if you have an old ssh client, remove it if it does.

Replace:

- `<CONGA_IP_ADDRESS>` with your robot's IP address (e.g., `192.168.xxx.xxx`).
- `/path/to/local/backup/` with the local folder path where you want to store the backup (e.g., `/Users/yourusername/Documents/CongaBackup`).

#### **For Windows Users:**

Use an SCP-compatible tool such as **WinSCP** or **PuTTY's PSCP**.

Example using PSCP in Windows Command Prompt:

```cmd
pscp -r -scp -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa root@<CONGA_IP_ADDRESS>:/mnt/UDISK/log/ C:\path\to\local\backup\
```

Replace:

- `<CONGA_IP_ADDRESS>` with your robot's IP address.
- `C:\path\to\local\backup\` with your preferred Windows backup location.

---

### 2. Restore Map Information

#### **For Mac/Linux Users:**

To restore previously backed-up map data to your Conga robot, run:

```shell
scp -rp -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa /path/to/local/backup/* -O 'root@<CONGA_IP_ADDRESS>:/mnt/UDISK/log/'
```

Replace:

- `/path/to/local/backup/*` with the path to your backup folder (e.g., `/Users/yourusername/Documents/CongaBackup/*`).
- `<CONGA_IP_ADDRESS>` with your robot's IP address.

#### **For Windows Users:**

Example using PSCP:

```cmd
pscp -r -scp -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa C:\path\to\local\backup\* root@<CONGA_IP_ADDRESS>:/mnt/UDISK/log/
```

Replace:

- `C:\path\to\local\backup\*` with your local backup folder location.
- `<CONGA_IP_ADDRESS>` with your robot's IP address.

---

### Notes:

- Ensure your Conga robot and computer are on the same local network.
- You will be prompted to enter your robot's root password during SCP operations.
- Most Conga Robots don't support sftp protocol and some scp implementations use sftp. you need to use option -O to force scp instead of sftp
- Always make sure you have backups before restoring data, as this operation can overwrite existing robot map information.
