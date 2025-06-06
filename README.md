<div align="center">
    <img src="https://raw.githubusercontent.com/congatudo/Congatudo/master/frontend/src/assets/icons/congatudo_logo_with_name.svg" alt="congatudo">
    <p align="center"><h2>Free your vacuum from the cloud</h2></p>
</div>

Congatudo is a cloud replacement for vacuum robots enabling local-only operation. It is not a custom firmware.
That means that it cannot change anything about how the robot operates.

Congatudo provides control over your vacuum robot via a **responsive webinterface** that works on all of your devices.
It can be used on phones, tablets as well as your desktop computer.

Based on [Valetudo](https://valetudo.cloud/). Please, consider donate to [Valetudo project](https://github.com/sponsors/Hypfer).

| Brand   | Serie | Models tested and supported                                   |
|---------|-------|---------------------------------------------------------------|
| Cecotec | Conga | 3XXX (except for 3890), 4XXX (except for 4690), 5090 and 5490 |

These pages guide you through the installation steps for Cecotec Conga robots.
Support is still somewhat experimental, everything in this guide is under your responsability.

- The default settings here will be for running Congatudo on the robot itself, [standalone installation](#standalone-installation).
- It could run in a server using Docker, [docker installation](#docker-installation).
- If you want to develop as well, check out the [Local Development guide](https://congatudo.cloud/pages/development/building-and-modifying-congatudo.html).

Any of the ways to get Valetudo running for the robot needs root access to your Conga, so here it will be explained too [Robot Setup](#robot-setup).

Please give it a try and [file any issues that you encounter there](https://github.com/congatudo/Congatudo/issues).

- [Summary](#)
  - [Robot setup](#robot-setup)
    - [Connect the robot to your local network](#connect-the-robot-to-your-local-network)
    - [Get root access in your Conga](#get-root-access-in-your-conga)
    - [Point your Conga robot to Congatudo Server](#point-your-conga-robot-to-congatudo-server)
  - [Standalone installation](#standalone-installation)
    - [Get the binary from the releases](#get-the-binary-from-the-releases)
    - [Prepare a valid configuration file](#prepare-a-valid-configuration-file)
    - [Copy the binary and its configuration to your robot](#copy-the-binary-and-its-configuration-to-your-robot)
    - [Create a script file to export the enviroment variable and run the server at boot in your robot](#create-a-script-file-to-export-the-enviroment-variable-and-run-the-server-at-boot-in-your-robot)
    - [Enable Congatudo server at boot and reboot the robot](#enable-congatudo-server-at-boot-and-reboot-the-robot)
    - [Finally](#finally)
  - [Docker installation](#docker-installation)
    - [Configuration file](#configuration-file)
    - [Use the prepared image](#use-the-prepared-image)
    - [Finally](#finally-1)
  - [Docker-Compose installation](#docker-compose-installation)
  - [Home Assistant addon](#home-assistant-addon-installation)
  - [Uninstall Congatudo](#uninstall-congatudo)
  - [Blog](#blog)
  - [FAQ](#faq)
  - [Join the discussion](#join-the-Discussion)
  - [License](LICENSE)
  - [Notes](#notes)

## Robot setup
It is needed for the robot to know wich server it has to attend so then, it should be connected to your local network and point it to the Congatudo server. This is the purpose of the following steps

### Connect the robot to your local network
First, you need to have your robot connected througth your wifi to get shell access. If you already have it, you can jumpthis section, otherwise, you can use the [agnoc tool](https://github.com/congatudo/agnoc) form your computer to establish the connection.
```shell
$ npm install -g @agnoc/cli 
$ agnoc wlan <wifissid> <pass>
```

### Get root access in your Conga
1. Check that you have SSH installed and working in your computer (Linux/MacOS by default, use [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/) in Windows)
2. You have to find out the IP address of your Conga (see [this guide](https://techwiser.com/find-ip-address-of-any-device/) on how to)
3. Open an ssh connection to your Conga (change the 192.168.x.x for your Conga's IP address):
	```bash
	PC:~ $ ssh root@192.168.x.x
	```

	and when you get the login prompt, type `root` and then the password depending on your model:

	 - for 3090: `3irobotics`[^1]
	 - for 3x90, 4090 & 5490: `@3I#sc$RD%xm^2S&`[^2]
4. You should see something like this:
![Tina-Linux](https://github.com/congatudo/stuff/blob/master/docs/assets/tina-linux.png)
1. Now, it would be a good practice to:
   - Change the password (to something non-default and secure 🙏)
   - Add certificates (ssh key-pair) to [access via ssh without passwords](https://congatudo.cloud/pages/misc/add-ssh-key.html)
  
### Point your Conga robot to Congatudo Server
Open a ssh terminal to your robot and edit the hosts file, your server:
*Server IP for standalone installation: 127.0.0.1*
```shell
$ ssh root@<your-robot-ip>
$> echo "<your-server-ip> cecotec.das.3irobotix.net cecotec.download.3irobotix.net cecotec.log.3irobotix.net cecotec.ota.3irobotix.net eu.das.3irobotics.net eu.log.3irobotics.net eu.ota.3irobotics.net cecotec-das.3irobotix.net cecotec-log.3irobotix.net cecotec-upgrade.3irobotix.net cecotec-download.3irobotix.net" >> /etc/hosts
$> /etc/init.d/valetudo enable
$> reboot
```
## Standalone installation
### Get the binary from the releases
Go to congatudo releases page to download [valetudo-armv7](https://github.com/congatudo/Congatudo/releases) and name it 'valetudo'

### Prepare a valid configuration file
In your machine, get a valid valetudo config file in from: https://raw.githubusercontent.com/congatudo/Congatudo/master/backend/lib/res/default_config.json

Once you have already downloaded it and named as valetudo_config.json, edit the implementation of the Congatudo robot to CecotecCongaRobot and teh embebed property aswell:
```json
{
  "embedded": true,
  "robot": {
    "implementation": "CecotecCongaRobot",
    ...
}
```

### Copy the binary and its configuration to your robot
After that, you are able to copy the binary to your conga
```shell
$ ssh root@<your-robot-ip>
$> mkdir /mnt/UDISK/valetudo
$> exit
$ scp ./valetudo root@<your-robot-ip>:/mnt/UDISK/valetudo/valetudo
$ scp ./valetudo_config.json root@<your-robot-ip>:/mnt/UDISK/valetudo/valetudo_config.json
```
### Create a script file to export the enviroment variable and run the server at boot in your robot
```shell
ssh root@<your-robot-ip>
$> vi /etc/init.d/valetudo
```

add this script:
```bash
#!/bin/sh /etc/rc.common                                                                                                    
# File: /etc/init.d/valetudo
# Usage help: /etc/init.d/valetudo
# Example: /etc/init.d/valetudo start
START=85
STOP=99                                     
USE_PROCD=1                                                                                                                
PROG=/mnt/UDISK/valetudo/valetudo
CONFIG=/mnt/UDISK/valetudo/valetudo_config.json                                     
start_service() {                     
  procd_open_instance                 
  procd_set_param env VALETUDO_CONFIG_PATH=$CONFIG
  procd_set_param command $PROG    

  procd_set_param respawn ${respawn_threshold:-3600} ${respawn_timeout:-10} ${respawn_retry:-5}
  procd_close_instance                
}                                                                                                                          
shutdown() {                                                                                                            
  echo shutdown                                                                                                   
}
```

Make the init file and binary executable:
```shell
$> chmod +x /etc/init.d/valetudo
$> chmod +x /mnt/UDISK/valetudo/valetudo
```

### Enable Congatudo server at boot and reboot the robot
```shell
$ ssh root@<your-robot-ip>
$> /etc/init.d/valetudo enable
$> reboot
```
### Finally
:tada: With theses steps, you may see your Congatudo server running under <http://your-robot-ip>

## Docker installation
### Configuration file
Firstly, get a valid valetudo config file in https://raw.githubusercontent.com/congatudo/Congatudo/master/backend/lib/res/default_config.json

Once you have already downloaded it and named as "valetudo.json", edit the implementation of the Valetudo robot to CecotecCongaRobot and take care about the embebed propety being set as false:
```json
{
  "embedded": false,
  "robot": {
    "implementation": "CecotecCongaRobot",
    ...
    },
    "webserver": {
      "port": 8080,
      ...
    }
}
```

### Use the prepared image
Then, you are able to just run the dockerhub image
```shell
docker run -p 8080:8080 -p 4010:4010 -p 4030:4030 -p 4050:4050 -v $(pwd)/valetudo.json:/etc/valetudo/config.json --name congatudo ghcr.io/congatudo/congatudo:alpine-latest
```
### Finally
:tada: With theses steps, you may see your Congatudo server running under <http://ip-server:8080>

## Docker-Compose installation
The basic service to run congatudo with docker-compose, please download a valid configuration file for congatudo and renamed like valetudo.json from  https://raw.githubusercontent.com/congatudo/Congatudo/master/backend/lib/res/default_config.json. edit the implementation of the Valetudo robot to CecotecCongaRobot and take care about the embebed propety being set as false:
```json
{
  "embedded": false,
  "robot": {
    "implementation": "CecotecCongaRobot",
    ...
    },
    "webserver": {
      "port": 8080,
      ...
    }
}
```
Once you have this configuration file stored and already setup, add this service to your docker-compose:
```yaml
version: '3.8'
services:
  congatudo:
    container_name: congatudo
    image: ghcr.io/congatudo/congatudo:alpine-latest
    restart: unless-stopped
    volumes:
     - <path-to-file>/valetudo.json:/etc/valetudo/config.json
    ports:
      - 80:8080 #Change port 80 to whatever port you want to expose the web GUi
      - 4010:4010
      - 4030:4030
      - 4050:4050
    environment:
      - TZ=Etc/UTC
      - LUID=1000 #Optional
      - LGUI=1000 #Optional
```
Taking care about the path-to-file you need to point to your configuration file (i.e. /home/pi/valetudo.json)

## Home Assistant addon installation
Just follow the [read me.](https://github.com/congatudo/congatudo-add-on)

## Uninstall Congatudo

This will remove Congatudo, free the diskspace and re-enable the cloud interface in case of a standalone installation.

```shell
ssh root@<your-robot-ip>
$> /etc/init.d/valetudo stop
$> rm /etc/init.d/valetudo /mnt/UDISK/valetudo
$> sed -i '/cecotec.das.3irobotix.net/d' /etc/hosts
```

## Misc
### Hey Google clean my room
An article to be able to integrate google with congatudo and take advance of the automations Home Assistant provide us [Link](https://congatudo.cloud/pages/misc/hey-google-clean-my-room.html)

### Time and Tank Virtual Sensors
In case your Conga robot doesn't have the time and bin fill sensor, you can create virtual ones in Home assistant [Link](https://congatudo.cloud/pages/misc/time-and-tank-virtual-sensors.html)

### Clean me
A Home assistant automation to send the robot to a position (usually near to the bin) once the tank fill sensor reach some threshold [Link](https://congatudo.cloud/pages/misc/clean-me.html)

### Empower your conga voice
A hack to be able to free the voice the conga play by its speaker [Link](https://congatudo.cloud/pages/misc/empower-your-conga-voice.html)


### Get area and time in Home Assistant from Congatudo
[Deprecated] A way to get the area and time sensor provide by Congatudo available on home asistant [Link](https://congatudo.cloud/pages/misc/get-area-and-time-in-ha-from-congatudo.html)

## FAQ
1. I have Congatudo up and running but no robot is found
```
Check if hosts file in the robot is already edited.
Ping to a one of the cecotec cloud server instances to check if it reaches the conga ip, i.e.:
ping cecotec.das.3irobotix.net
```
2. I try to run a dockerize Valetudo server in my Raspberry server with Raspbian, but I got an error
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
Check the emebebed property of your configuration file, you may try to run congatudo in a server but embebed option set as true.
```

## Join the Discussion
* [Congatudo Telegram group](https://t.me/congatudo)
* [Congatudo Web](https://congatudo.cloud)

## LICENSE

This work is licensed under the [Apache License 2.0](https://github.com/congatudo/Congatudo/blob/master/LICENSE). All media and data files that are not source code are licensed under the [Creative Commons Attribution 4.0 BY-SA license](https://creativecommons.org/licenses/by/4.0/).

More information about licenses in [Opensource licenses](https://opensource.org/licenses/) and [Creative Commons licenses](https://creativecommons.org/licenses/).


## Notes
[1]: Model 3090 original password hash `$1$ZnE1NgOT$oWafIj8xgsknzdJmRZM9N/` == `3irobotics`

[2]: Model 3x90 original password hash `$1$trVg0hig$L.xDOM91z4d/.8FZRnr.h1` == `@3I#sc$RD%xm^2S&`
