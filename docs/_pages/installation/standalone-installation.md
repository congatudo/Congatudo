---
title: Standalone installation
category: Installation
order: 4
---

# Standalone installation

This page shall help you start using Congatudo with a standalone installation.

## Get the binary from the releases
Go to congatudo releases page to download [valetudo-armv7](https://github.com/congatudo/Congatudo/releases) and named only 'valetudo'

## Prepare a valid configuration file
In your machine, get a valid valetudo config file in from [here](https://raw.githubusercontent.com/congatudo/Congatudo/master/backend/lib/res/default_config.json).

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
```shellell
$> ssh root@<robot-ip>
$> mkdir /mnt/UDISK/valetudo
$> exit
$> scp ./build/armv7/valetudo root@<your robot ip>:</mnt/UDISK/valetudo/valetudo>
$> scp ./default_config.json root@<your robot ip>:</mnt/UDISK/valetudo/valetudo_config.json>
```
## Create a script file to export the enviroment variable and run the server at boot in your robot
```shellell
$> vi /etc/init.d/valetudo
```

Add this script:
```shell
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

Make the init script and the binary executable:
```shellell
$> chmod +x /etc/init.d/valetudo
$> chmod +x /mnt/UDISK/valetudo/valetudo
```

## Point your Conga robot to Congatudo Server
Edit the `/etc/hosts` file to redirect all 3irobotix network domains to `127.0.0.1`:
```shellell
$> echo "127.0.0.1 cecotec.das.3irobotix.net cecotec.download.3irobotix.net cecotec.log.3irobotix.net cecotec.ota.3irobotix.net eu.das.3irobotics.net eu.log.3irobotics.net eu.ota.3irobotics.net cecotec-das.3irobotix.net cecotec-log.3irobotix.net cecotec-upgrade.3irobotix.net cecotec-download.3irobotix.net" >> /etc/hosts
```

## Enable Congatudo server at boot and reboot the robot
```shellell
$> /etc/init.d/valetudo enable
$> reboot
```
## Finally
🎉 After completing these steps, your Congatudo server should be accessible at <http://robot-ip>

# Uninstall Congatudo

This will remove Congatudo, free the diskspace and re-enable the cloud interface in case of a standalone installation.

```shellell
ssh root@<robot-ip>
$> /etc/init.d/valetudo stop
$> rm /etc/init.d/valetudo /mnt/UDISK/valetudo/valetudo /mnt/UDISK/valetudo/valetudo_config.json  
$> sed -i '/cecotec.das.3irobotix.net/d' /etc/hosts
$> reboot now
```