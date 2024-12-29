---
title: Clean me
category: Misc
order: 39
---

# Goal

Get your vacuum close to your bin once the tank is full

## Requirements

- Congatudo integrated into Home assistant
- Tank percentage sensor available (i.e. with [this tuto](../time-and-tank-virtual-sensor/index.html))
- A defined spot in Congatudo

## Steps

Once the tank percentage sensor is available, this automation is easy just taking care about the actions you may need. We are going to trigger this action every time the vacuum is in the dock for more than 1h, but it will trigger just in case of the tank percentage sensor above of 100.

- Decrease the power mode to be less noisy
- Send to clean the defined spot in Congatudo
- Wait till the robot reaches the spot
- Stop the vacuum robot
- Increace again the power mode to leave it in your default mode (mine medium)
- Send some notification to my phone
- Reset the sensor

So, to get this, one possible solution could be the one below

```yaml
        alias: '[CONGA] Limpiame'
        description: ''
        trigger:
        - platform: state
            entity_id: vacuum.conga
            to: docked
            for:
            hours: 1
            minutes: 0
            seconds: 0
            milliseconds: 0
        condition:
        - condition: numeric_state
            entity_id: sensor.conga_tank_percentage
            above: '100'
        action:
        - service: mqtt.publish
            data:
            payload: a9663a44-7e23-4134-80ca-afcfce4ad368
            topic: valetudo/robot/GoToLocationCapability/go/set
        - service: mqtt.publish
            data:
            topic: valetudo/robot/FanSpeedControlCapability/preset/set
            payload: low
        - delay:
            hours: 0
            minutes: 1
            seconds: 30
            milliseconds: 0
        - service: vacuum.stop
            target:
            device_id: 4a640c13ca7d207aeb6fa02ca933825f
        - service: mqtt.publish
            data:
            topic: valetudo/robot/FanSpeedControlCapability/preset/set
            payload: medium
        - service: notify.mobile_app_sm_g781b
            data:
            message: I am dirty, please... empty me.
        - service: input_datetime.set_datetime
            data:
            datetime: '{{ now().strftime(''%Y-%m-%d %H:%M:%S'') }}'
            target:
            entity_id: input_datetime.robotstartcleaningtime
        mode: single
```

Take special care with the vacuum id you have and the topic you may point for your case. MQTT topic prefix and identifier