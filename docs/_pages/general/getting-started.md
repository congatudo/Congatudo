---
title: Getting Started
category: General
order: 1
---

# Getting Started

This page shall help you start using Congatudo.

You may also want to read the [Why Congatudo?](https://congatudo.cloud/pages/general/why-congatudo.html) and [Congatudo vs Valetudo?](https://congatudo.cloud/pages/general/congatudo-vs-valetudo.html) pages before continuing with this guide.

## Table of Contents
0. [Choosing a robot](#choosing_a_robot)
1. [Connect the robot to your local network](#connect_robot)
2. [Get root access in your Conga](#root_access)
3. [Choose an install method](#choose_install_method)

## Choosing a robot<a id='choosing_a_robot'></a>

First, you'll need to acquire a supported robot. There are many ways to do that, but usually they involve you paying money.
To not waste all that hard-earned money, please make sure to thoroughly read the [buying supported robots](https://congatudo.cloud/pages/general/supported-robots.html)
docs page. 
There's also the [supported robots](https://congatudo.cloud/pages/general/supported-robots.html) page, which features
remarks for each device to further help you decide on what to buy.

Please refrain from buying any random robot just to then ask how we can make Congatudo on that thing happen.

## Connect the robot to your local network<a id='connect_robot'></a>

First, you need to have your robot connected througth your wifi to get shell access. If you already have it, you can jumpthis section, otherwise, you can use the [agnoc tool](https://github.com/congatudo/agnoc) form your computer to establish the connection.

```shell
$ npm install -g @agnoc/cli 
$ agnoc wlan <wifissid> <pass>
```

Another option that we do **NOT recommend** is to use the Cecotec app to connect it.

## Get root access in your Conga<a id='root_access'></a>

1. Check that you have SSH installed and working in your computer (Linux/MacOS by default, use [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/) in Windows)
2. You have to find out the IP address of your Conga (see [this guide](https://techwiser.com/find-ip-address-of-any-device/) on how to)
3. Open an ssh connection to your Conga (change the 192.168.x.x for your Conga's IP address):
	```bash
	PC:~ $ ssh root@192.168.x.x
	```
	and when you get the login prompt, type `root` and then the password depending on your model:

	 - for 3090: `3irobotics`
	 - for 3x90, 4090 & 5490: `@3I#sc$RD%xm^2S&`
4. You should see something like this:
![Tina-Linux](https://github.com/congatudo/stuff/blob/master/docs/assets/tina-linux.png)
1. Now, it would be a good practice to:
   - Change the password (to something non-default and secure 🙏)
   - Add certificates (ssh key-pair) to [access via ssh without passwords](https://congatudo.cloud/pages/misc/add-ssh-key.html)
  
## Choose an install method<a id='choose_install_method'></a>

Now, depending on your needs, you can choose between the [Home Assistant addon](https://congatudo.cloud/pages/installation/home-assistant-installation.html), [Docker](https://congatudo.cloud/pages/installation/docker-installation.html) or [Standalone](https://congatudo.cloud/pages/installation/standalone-installation.html) installation method.