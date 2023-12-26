---
title: Empower your Conga voice
category: Misc
order: 35
---
## Goal

Conga 4090 is able to talk instead of just beep to us, so here it is a guide to get it

## Requirements
- A rooted conga

_At writing time, we just test in 4090 conga model, in other model some people already experimented some trouble. Please, do it just if you know what are you doing._

## Steps

It is a good practice to do a back up if all the files we are going to handle, so:

1. Access to the robot
    ```
    ssh root@<Conga IP> 
    ```

2. Perform a config file backup
    ``` 
    root@TinaLinux:~# cd /mnt/UDISK/config
    root@TinaLinux:~# cp device_config.ini device_config.ini_bak
    ```

3. Edit customer_firm_id=1003 in device_config.ini to 1002 via the vi editor
    ```
    root@TinaLinux:~# vi device_config.ini
    ```
    _Editing with vi is not easy to explain in just a few words, but the basics for this exampel could be:_

    1. Press `Insert` button
    2. Move with the cursor to the character we want to edit
    3. Change it
    4. Press `Esc` and then `:wq` to save and exit
4. Now we are able to stop the services and proceses
    ```
    root@TinaLinux:~# /etc/init.d/robotManager stop
    root@TinaLinux:~#  kill -9 $(pidof Monitor)
    root@TinaLinux:~#  kill -9 $(pidof RobotApp)
    root@TinaLinux:~#  kill -9 $(pidof log-server)
    root@TinaLinux:~#  kill -9 $(pidof everest-server)
    root@TinaLinux:~#  kill -9 $(pidof AuxCtrl)
    ```
5. Finally, we restart  the service
    ```
    root@TinaLinux:~# /etc/init.d/robotManager start
    ```

## Learning chinese

By default the robot will speak in english, but it is able to "magically learn" mandarin just editing the property `sound_type` from 2 to 1 in the same file `device_config.ini`

## Other models
This steps should be similar in all the 3XXX and 4XXX robots but, as you may think, it depends on how works Robotapp in those models.

If you want to try for the model **3090**, you need to update `deviceFirmsID=1003` to `1002` in both files:
    
-  /etc/sysconf/sysConfig.ini
- /mnt/UDISK/config/sysConfig.ini