---
title: Robot setup
category: Installation
order: 1
---

# Robot setup
It is needed for the robot to know wich server it has to attend so then, it should be connected to your local network and point it to the Congatudo server. This is the purpose of the following steps

## Connect the robot to your local network
First, you need to have your robot connected througth your wifi to get shell access. If you already have it, you can jumpthis section, otherwise, you can use the **[agnoc tool](https://github.com/congatudo/agnoc)** form your computer to establish the connection.
```shellell
$> npm install -g @agnoc/cli 
$> agnoc wlan <wifissid> <pass>
```

## Get root access in your Conga
1. Check that you have SSH installed and working in your computer (Linux/MacOS by default, use **[Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/)** in Windows)
2. You have to find out the IP address of your Conga (see **[this guide](https://techwiser.com/find-ip-address-of-any-device/)** on how to)
3. Open an SSH connection to your Conga. Replace `192.168.x.x` with your Conga's actual IP address:
	```shellell
	$> ssh root@192.168.x.x
	```
	and when you get the login prompt, type `root` and then the password depending on your model:
	 - for 3090: `3irobotics`[^1]
	 - for 3x90, 4090 & 5490: `@3I#sc$RD%xm^2S&`[^2]
4. You should see something like this:
![Tina-Linux](https://github.com/congatudo/stuff/blob/master/docs/assets/tina-linux.png)
5. Now, it would be a good practice to:
   - Change the password (to something non-default and secure 🙏)
   - Add certificates (ssh key-pair) to **[access via ssh without passwords](https://congatudo.cloud/pages/misc/add-ssh-key.html)**

## Choose your installation method
Now you need to choose how to install Congatudo on your server. You can use one of the following methods:
- **[Home Assistant Add-on](https://congatudo.cloud/pages/installation/home-assistant-installation.html):** Recommended if you are running Home Assistant. This method provides seamless integration and easy updates.
- **[Docker](https://congatudo.cloud/pages/installation/docker-installation.html):** Suitable for most environments. Use this if you want a containerized setup.
- **[Standalone](https://congatudo.cloud/pages/installation/standalone-installation.html):** For users who prefer manual installation and full control.

Follow the link for your preferred method to continue with the installation.

## Notes
[^1]: Model 3090 original password hash `$1$ZnE1NgOT$oWafIj8xgsknzdJmRZM9N/` == `3irobotics`
[^2]: Model 3x90 original password hash `$1$trVg0hig$L.xDOM91z4d/.8FZRnr.h1` == `@3I#sc$RD%xm^2S&`