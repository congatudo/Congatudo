---
title: Standalone installation
category: Installation
order: 3
---

# Standalone installation

This page shall help you start using Congatudo with a standalone installation.

## Get the binary from the releases
Go to congatudo releases page to download [valetudo-armv7](https://github.com/congatudo/Congatudo/releases) and named only 'valetudo'

## Prepare a valid configuration file
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

## Copy the binary and its configuration to your robot
After that, you are able to copy the binary to your conga
```shell
$ ssh root@<robot-ip>
$> mkdir /mnt/UDISK/valetudo
$> exit
$ scp ./build/armv7/valetudo root@<your robot ip>:</mnt/UDISK/valetudo/valetudo>
$ scp ./default_config.json root@<your robot ip>:</mnt/UDISK/valetudo/valetudo_config.json>
```
## Create a script file to export the enviroment variable and run the server at boot in your robot
```shell
ssh root@<your conga ip>
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

Make the init file executable:
```shell
$> chmod +x /etc/init.d/valetudo
```

## Enable Congatudo server at boot and reboot the robot
```shell
$ ssh root@<conga ip>
$> /etc/init.d/valetudo enable
$> reboot
```
## Finally
:tada: With theses steps, you may see your Congatudo server running under <http://ip-robot>