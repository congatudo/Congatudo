---
title: MQTT
category: Integrations
order: 20
---

# MQTT integration

To make your robot talk to your MQTT broker and integrate with home automation software, such as but not limited to
Home Assistant, openHAB and Node-RED, configure MQTT via Congatudo's web interface (Settings → MQTT).

## Autodiscovery

See the specific integration pages for instructions on how to set up autodiscovery for your home automation software
platform:

- [Home Assistant](https://congatudo.cloud/pages/integrations/home-assistant-integration.html)
- [openHAB](https://congatudo.cloud/pages/integrations/openhab-integration.html)
- [Node-RED](https://congatudo.cloud/pages/integrations/node-red.html)

Other home automation software that follows the [Homie convention](https://homieiot.github.io/) should also be able to
automatically discover your Congatudo instance.

[![Works with Homie](./img/works-with-homie.svg)](https://homieiot.github.io)

## Map

Note that, in order to view the map provided over MQTT, you additionally need
[I Can't Believe It's Not Valetudo](../companion_apps/i_cant_believe_its_not_valetudo.md) to generate PNG maps.
You can then configure it to serve the PNG map over HTTP for openHAB and other software, or install the
[Lovelace Valetudo Card Map](../companion_apps/lovelace_valetudo_map_card.md) for Home Assistant. 

## Custom integrations

If you're planning to use one of the home automation platforms listed above, this is all you need to know to get started.

If you're instead planning to do something more custom, in this document you will find a reference to all MQTT topics
provided by this software. Values such as `<TOPIC PREFIX>` and `<IDENTIFIER>` are those configured in the MQTT
settings page.

{% include alert.html type="tip" content="It is recommended to leave Homie autodiscovery enabled, even if you're not planning to use it, if you want to develop
custom integrations or access the MQTT topics directly: the Homie protocol is very readable and self-documenting.
It will provide additional context and information on how to use specific APIs.


Homie autodiscovery info is best viewed with something like [MQTT Explorer](https://mqtt-explorer.com/).
" %}

### Table of contents

 - [Robot](#robot)
   - [Capabilities](#capabilities)
     - [Basic control (`BasicControlCapability`)](#basiccontrolbasiccontrolcapability)
       - [Operation (`operation`)](#operationoperation)
     - [Consumables monitoring (`ConsumableMonitoringCapability`)](#consumablesmonitoringconsumablemonitoringcapability)
       - [Consumable (minutes) (`<CONSUMABLE-MINUTES>`)](#consumableminutesconsumable-minutes)
       - [Consumable (percent) (`<CONSUMABLE-PERCENT>`)](#consumablepercentconsumable-percent)
     - [Current Statistics (`CurrentStatisticsCapability`)](#currentstatisticscurrentstatisticscapability)
       - [Current Statistics Area (`area`)](#currentstatisticsareaarea)
       - [Current Statistics Time (`time`)](#currentstatisticstimetime)
       - [Refresh current statistics (`refresh`)](#refreshcurrentstatisticsrefresh)
     - [Fan control (`FanSpeedControlCapability`)](#fancontrolfanspeedcontrolcapability)
       - [Fan (`preset`)](#fanpreset)
     - [Go to location (`GoToLocationCapability`)](#gotolocationgotolocationcapability)
       - [Go to location (`go`)](#gotolocationgo)
     - [Locate (`LocateCapability`)](#locatelocatecapability)
       - [Locate (`locate`)](#locatelocate)
     - [Segment cleaning (`MapSegmentationCapability`)](#segmentcleaningmapsegmentationcapability)
       - [Clean segments (`clean`)](#cleansegmentsclean)
     - [Speaker volume control (`SpeakerVolumeControlCapability`)](#speakervolumecontrolspeakervolumecontrolcapability)
       - [Speaker volume (`value`)](#speakervolumevalue)
     - [Water control (`WaterUsageControlCapability`)](#watercontrolwaterusagecontrolcapability)
       - [Water (`preset`)](#waterpreset)
     - [Wi-Fi configuration (`WifiConfigurationCapability`)](#wi-ficonfigurationwificonfigurationcapability)
       - [Frequency (`frequency`)](#frequencyfrequency)
       - [IP addresses (`ips`)](#ipaddressesips)
       - [Refresh configuration (`refresh`)](#refreshconfigurationrefresh)
       - [Signal (`signal`)](#signalsignal)
       - [Wireless network (`ssid`)](#wirelessnetworkssid)
     - [Zone cleaning (`ZoneCleaningCapability`)](#zonecleaningzonecleaningcapability)
       - [Start zoned cleaning (`start`)](#startzonedcleaningstart)
   - [Map data](#mapdata)
     - [Map (`map`)](#mapmap)
     - [Map segments (`segments`)](#mapsegmentssegments)
     - [Raw map data (`map-data`)](#rawmapdatamap-data)
     - [Raw map data for Home Assistant (`map-data-hass`)](#rawmapdataforhomeassistantmap-data-hass)
   - [Status](#status)
     - [Attachment state (`AttachmentStateAttribute`)](#attachmentstateattachmentstateattribute)
       - [Dust bin (`dustbin`)](#dustbindustbin)
       - [Mop (`mop`)](#mopmop)
       - [Water tank (`watertank`)](#watertankwatertank)
     - [Battery state (`BatteryStateAttribute`)](#batterystatebatterystateattribute)
       - [Battery level (`level`)](#batterylevellevel)
       - [Battery status (`status`)](#batterystatusstatus)
     - [Vacuum status (`StatusStateAttribute`)](#vacuumstatusstatusstateattribute)
       - [Error description (`error_description`)](#errordescriptionerrordescription)
       - [Robot Error (`error`)](#roboterrorerror)
       - [Status (`status`)](#statusstatus)
       - [Status flag (`flag`)](#statusflagflag)


### State attributes index

- [AttachmentStateAttribute](#attachmentstateattachmentstateattribute)
- [BatteryStateAttribute](#batterystatebatterystateattribute)
- [ConsumableStateAttribute](#consumablesmonitoringconsumablemonitoringcapability)
- [PresetSelectionStateAttribute](#watercontrolwaterusagecontrolcapability)
- [StatusStateAttribute](#vacuumstatusstatusstateattribute)


### Home Assistant components index

- [Battery level (`sensor.mqtt`)](#batterylevellevel)
- [Consumable (minutes) (`sensor.mqtt`)](#consumableminutesconsumable-minutes)
- [Consumable (percent) (`sensor.mqtt`)](#consumablepercentconsumable-percent)
- [Current Statistics Area (`sensor.mqtt`)](#currentstatisticsareaarea)
- [Current Statistics Time (`sensor.mqtt`)](#currentstatisticstimetime)
- [Dust bin attachment (`binary_sensor.mqtt`)](#dustbindustbin)
- [Error (`sensor.mqtt`)](#vacuumstatusstatusstateattribute)
- [Map data (`camera.mqtt`)](#rawmapdataforhomeassistantmap-data-hass)
- [Map segments (`sensor.mqtt`)](#mapsegmentssegments)
- [Mop attachment (`binary_sensor.mqtt`)](#mopmop)
- [Speaker volume (`number.mqtt`)](#speakervolumevalue)
- [Status Flag (`sensor.mqtt`)](#statusflagflag)
- [Vacuum (`vacuum.mqtt`)](#robot)
- [Water (`select.mqtt`)](#waterpreset)
- [Water tank attachment (`binary_sensor.mqtt`)](#watertankwatertank)
- [Wi-Fi configuration (`sensor.mqtt`)](#wi-ficonfigurationwificonfigurationcapability)


# MQTT API reference

## Robot <a id="robot" />

*Device*

Home Assistant components controlled by this device:

- Vacuum ([`vacuum.mqtt`](https://www.home-assistant.io/integrations/vacuum.mqtt/))



### Capabilities <a id="capabilities" />

#### Basic control (`BasicControlCapability`) <a id="basiccontrolbasiccontrolcapability" />

*Node, capability: [BasicControlCapability](../usage/capabilities-overview.md#basiccontrolcapability)*

##### Operation (`operation`) <a id="operationoperation" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/BasicControlCapability/operation/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/BasicControlCapability/operation`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `START`, `STOP`, `PAUSE`, `HOME`)


#### Consumables monitoring (`ConsumableMonitoringCapability`) <a id="consumablesmonitoringconsumablemonitoringcapability" />

*Node, capability: [ConsumableMonitoringCapability](../usage/capabilities-overview.md#consumablemonitoringcapability)*

{% include alert.html type="warning" content="Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

|------+--------|
| What | Reason |
|------|--------|
| Properties | Consumables depend on the robot model. |
| Property datatype and units | Some robots send consumables as remaining time, others send them as endurance percent remaining. |
|------+--------|

" %}

Status attributes managed by this node:

- ConsumableStateAttribute

##### Consumable (minutes) (`<CONSUMABLE-MINUTES>`) <a id="consumableminutesconsumable-minutes" />

*Property, readable, retained*

This handle returns the consumable remaining endurance time as an int representing seconds remaining.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/ConsumableMonitoringCapability/<CONSUMABLE-MINUTES>`
- Data type: [integer](https://homieiot.github.io/specification/#integer)

Sample value:

```json
29520
```

Home Assistant components controlled by this property:

- Consumable (minutes) ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))



##### Consumable (percent) (`<CONSUMABLE-PERCENT>`) <a id="consumablepercentconsumable-percent" />

*Property, readable, retained*

This handle returns the consumable remaining endurance percentage.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/ConsumableMonitoringCapability/<CONSUMABLE-PERCENT>`
- Data type: [integer percentage](https://homieiot.github.io/specification/#percent) (range: 0 to 100, unit: %)

Sample value:

```json
59
```

Home Assistant components controlled by this property:

- Consumable (percent) ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))





#### Current Statistics (`CurrentStatisticsCapability`) <a id="currentstatisticscurrentstatisticscapability" />

*Node, capability: [CurrentStatisticsCapability](../usage/capabilities-overview.md#currentstatisticscapability)*

##### Current Statistics Area (`area`) <a id="currentstatisticsareaarea" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/CurrentStatisticsCapability/area`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: cm²)

Sample value:

```json
630000
```

Home Assistant components controlled by this property:

- Current Statistics Area ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))



##### Refresh current statistics (`refresh`) <a id="refreshcurrentstatisticsrefresh" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/CurrentStatisticsCapability/refresh/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/CurrentStatisticsCapability/refresh`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `PERFORM`)



##### Current Statistics Time (`time`) <a id="currentstatisticstimetime" />

*Property, readable, retained*

This handle returns the current statistics time in seconds

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/CurrentStatisticsCapability/time`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: seconds)

Sample value:

```json
1440
```

Home Assistant components controlled by this property:

- Current Statistics Time ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))





#### Fan control (`FanSpeedControlCapability`) <a id="fancontrolfanspeedcontrolcapability" />

*Node, capability: [FanSpeedControlCapability](../usage/capabilities-overview.md#fanspeedcontrolcapability)*

Status attributes managed by this node:

- PresetSelectionStateAttribute

##### Fan (`preset`) <a id="fanpreset" />

*Property, readable, settable, retained*

This handle allows setting the fan. It accepts the preset payloads specified in `$format` or in the HAss json attributes.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/FanSpeedControlCapability/preset`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/FanSpeedControlCapability/preset/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `off`, `min`, `low`, `medium`, `high`, `turbo`, `max`)

{% include alert.html type="warning" content="Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

|------+--------|
| What | Reason |
|------|--------|
| Enum payloads | Different robot models have different fan presets. Always check `$format`/`json_attributes` during startup. |
|------+--------|

" %}

Sample value:

```
max
```





#### Go to location (`GoToLocationCapability`) <a id="gotolocationgotolocationcapability" />

*Node, capability: [GoToLocationCapability](../usage/capabilities-overview.md#gotolocationcapability)*

##### Go to location (`go`) <a id="gotolocationgo" />

*Property, command, not retained*

This handle accepts a JSON object identical to the one used by the REST API.

Please refer to the "General Help" section in Valetudo for more information.

Sample payload:

```json
{
  "coordinates": {
    "x": 50,
    "y": 50
  }
}
```

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/GoToLocationCapability/go/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/GoToLocationCapability/go`
- Data type: [string](https://homieiot.github.io/specification/#string) (format: `same json as the REST interface`)





#### Locate (`LocateCapability`) <a id="locatelocatecapability" />

*Node, capability: [LocateCapability](../usage/capabilities-overview.md#locatecapability)*

##### Locate (`locate`) <a id="locatelocate" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/LocateCapability/locate/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/LocateCapability/locate`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `PERFORM`)





#### Segment cleaning (`MapSegmentationCapability`) <a id="segmentcleaningmapsegmentationcapability" />

*Node, capability: [MapSegmentationCapability](../usage/capabilities-overview.md#mapsegmentationcapability)*

##### Clean segments (`clean`) <a id="cleansegmentsclean" />

*Property, command, not retained*

This handle accepts a JSON object identical to the one used by the REST API.

Please refer to the "General Help" section in Valetudo for more information.

Sample payload:

```json
{
  "segment_ids": [
    "20",
    "18",
    "16"
  ],
  "iterations": 2,
  "customOrder": true
}
```

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapSegmentationCapability/clean/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapSegmentationCapability/clean`
- Data type: [string](https://homieiot.github.io/specification/#string) (format: `same json as the REST interface`)





#### Speaker volume control (`SpeakerVolumeControlCapability`) <a id="speakervolumecontrolspeakervolumecontrolcapability" />

*Node, capability: [SpeakerVolumeControlCapability](../usage/capabilities-overview.md#speakervolumecontrolcapability)*

**Note:** This is an optional exposed capability handle and thus will only be available via MQTT if enabled in the Congatudo configuration.

##### Speaker volume (`value`) <a id="speakervolumevalue" />

*Property, readable, settable, retained*

This handle returns the current speaker volume

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/SpeakerVolumeControlCapability/value`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/SpeakerVolumeControlCapability/value/set`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (range: 0 to 100)

Sample value:

```json
80
```

Home Assistant components controlled by this property:

- Speaker volume ([`number.mqtt`](https://www.home-assistant.io/integrations/number.mqtt/))





#### Water control (`WaterUsageControlCapability`) <a id="watercontrolwaterusagecontrolcapability" />

*Node, capability: [WaterUsageControlCapability](../usage/capabilities-overview.md#waterusagecontrolcapability)*

Status attributes managed by this node:

- PresetSelectionStateAttribute

##### Water (`preset`) <a id="waterpreset" />

*Property, readable, settable, retained*

This handle allows setting the water. It accepts the preset payloads specified in `$format` or in the HAss json attributes.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WaterUsageControlCapability/preset`
- Set topic: `<TOPIC PREFIX>/<IDENTIFIER>/WaterUsageControlCapability/preset/set`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `off`, `min`, `low`, `medium`, `high`, `turbo`, `max`)

{% include alert.html type="warning" content="Some information contained in this document may not be exactly what is sent or expected by actual robots, since different vendors have different implementations. Refer to the table below.

|------+--------|
| What | Reason |
|------|--------|
| Enum payloads | Different robot models have different water presets. Always check `$format`/`json_attributes` during startup. |
|------+--------|

" %}

Sample value:

```
min
```

Home Assistant components controlled by this property:

- Water ([`select.mqtt`](https://www.home-assistant.io/integrations/select.mqtt/))





#### Wi-Fi configuration (`WifiConfigurationCapability`) <a id="wi-ficonfigurationwificonfigurationcapability" />

*Node, capability: [WifiConfigurationCapability](../usage/capabilities-overview.md#wificonfigurationcapability)*

Home Assistant components controlled by this node:

- Wi-Fi configuration ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))

##### Frequency (`frequency`) <a id="frequencyfrequency" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/frequency`
- Data type: [string](https://homieiot.github.io/specification/#string)

Sample value:

```
2.4ghz
```



##### IP addresses (`ips`) <a id="ipaddressesips" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/ips`
- Data type: [string](https://homieiot.github.io/specification/#string)

Sample value:

```
192.168.100.100,fe80::1ff:fe23:4567:890a,fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff
```



##### Refresh configuration (`refresh`) <a id="refreshconfigurationrefresh" />

*Property, command, not retained*

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/refresh/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/refresh`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `PERFORM`)



##### Signal (`signal`) <a id="signalsignal" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/signal`
- Data type: [integer](https://homieiot.github.io/specification/#integer) (unit: dBm)

Sample value:

```json
-26
```



##### Wireless network (`ssid`) <a id="wirelessnetworkssid" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/WifiConfigurationCapability/ssid`
- Data type: [string](https://homieiot.github.io/specification/#string)

Sample value:

```
Valetudo Wi-Fi
```





#### Zone cleaning (`ZoneCleaningCapability`) <a id="zonecleaningzonecleaningcapability" />

*Node, capability: [ZoneCleaningCapability](../usage/capabilities-overview.md#zonecleaningcapability)*

##### Start zoned cleaning (`start`) <a id="startzonedcleaningstart" />

*Property, command, not retained*

This handle accepts a JSON object identical to the one used by the REST API.

Please refer to the "General Help" section in Valetudo for more information.

Sample payload:

```json
{
  "zones": [
    {
      "points": {
        "pA": {
          "x": 50,
          "y": 50
        },
        "pB": {
          "x": 100,
          "y": 50
        },
        "pC": {
          "x": 100,
          "y": 100
        },
        "pD": {
          "x": 50,
          "y": 100
        }
      }
    }
  ],
  "iterations": 1
}
```

- Command topic: `<TOPIC PREFIX>/<IDENTIFIER>/ZoneCleaningCapability/start/set`
- Command response topic: `<TOPIC PREFIX>/<IDENTIFIER>/ZoneCleaningCapability/start`
- Data type: [string](https://homieiot.github.io/specification/#string) (format: `same json as the REST interface`)





### Map data <a id="mapdata" />

*Node*

This handle groups access to map data. It is only enabled if `provideMapData` is enabled in the MQTT config.

#### Map (`map`) <a id="mapmap" />

*Property, readable, retained*

This handle is only enabled if `interfaces.homie.addICBINVMapProperty` is enabled in the config. It does not actually provide map data, it only adds a Homie autodiscovery property so that 'I Can't Believe It's Not Valetudo' can publish its map within the robot's topics and be autodetected by clients.

ICBINV should be configured so that it publishes the map to this topic.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapData/map`
- Data type: [string](https://homieiot.github.io/specification/#string)



#### Raw map data (`map-data`) <a id="rawmapdatamap-data" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapData/map-data`
- Data type: [string](https://homieiot.github.io/specification/#string)



#### Raw map data for Home Assistant (`map-data-hass`) <a id="rawmapdataforhomeassistantmap-data-hass" />

*Property, readable, retained*

This handle is added automatically if Home Assistant autodiscovery is enabled. It provides a map embedded in a PNG image that recommends installing the Valetudo Lovelace card.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapData/map-data-hass`
- Data type: [string](https://homieiot.github.io/specification/#string)

Home Assistant components controlled by this property:

- Map data ([`camera.mqtt`](https://www.home-assistant.io/integrations/camera.mqtt/))



#### Map segments (`segments`) <a id="mapsegmentssegments" />

*Property, readable, retained*

This property contains a JSON mapping of segment IDs to segment names.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/MapData/segments`
- Data type: [string](https://homieiot.github.io/specification/#string) (JSON)

Sample value:

```json
{
  "16": "Hallway",
  "18": "Bathroom",
  "20": "Kitchen"
}
```

Home Assistant components controlled by this property:

- Map segments ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))





### Status <a id="status" />

#### Attachment state (`AttachmentStateAttribute`) <a id="attachmentstateattachmentstateattribute" />

*Node*

Status attributes managed by this node:

- AttachmentStateAttribute

##### Dust bin (`dustbin`) <a id="dustbindustbin" />

*Property, readable, retained*

This handle reports whether the dust bin attachment is installed.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/AttachmentStateAttribute/dustbin`
- Data type: [boolean](https://homieiot.github.io/specification/#boolean)

Sample value:

```json
true
```

Home Assistant components controlled by this property:

- Dust bin attachment ([`binary_sensor.mqtt`](https://www.home-assistant.io/integrations/binary_sensor.mqtt/))



##### Mop (`mop`) <a id="mopmop" />

*Property, readable, retained*

This handle reports whether the mop attachment is installed.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/AttachmentStateAttribute/mop`
- Data type: [boolean](https://homieiot.github.io/specification/#boolean)

Sample value:

```json
false
```

Home Assistant components controlled by this property:

- Mop attachment ([`binary_sensor.mqtt`](https://www.home-assistant.io/integrations/binary_sensor.mqtt/))



##### Water tank (`watertank`) <a id="watertankwatertank" />

*Property, readable, retained*

This handle reports whether the water tank attachment is installed.

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/AttachmentStateAttribute/watertank`
- Data type: [boolean](https://homieiot.github.io/specification/#boolean)

Sample value:

```json
true
```

Home Assistant components controlled by this property:

- Water tank attachment ([`binary_sensor.mqtt`](https://www.home-assistant.io/integrations/binary_sensor.mqtt/))





#### Battery state (`BatteryStateAttribute`) <a id="batterystatebatterystateattribute" />

*Node*

Status attributes managed by this node:

- BatteryStateAttribute

##### Battery level (`level`) <a id="batterylevellevel" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/BatteryStateAttribute/level`
- Data type: [integer percentage](https://homieiot.github.io/specification/#percent) (unit: %)

Sample value:

```json
42
```

Home Assistant components controlled by this property:

- Battery level ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))



##### Battery status (`status`) <a id="batterystatusstatus" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/BatteryStateAttribute/status`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `none`, `charging`, `discharging`, `charged`)

Sample value:

```
charging
```





#### Vacuum status (`StatusStateAttribute`) <a id="vacuumstatusstatusstateattribute" />

*Node*

Status attributes managed by this node:

- StatusStateAttribute

Home Assistant components controlled by this node:

- Error ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))

##### Robot Error (`error`) <a id="roboterrorerror" />

*Property, readable, retained*

This property contains the current ValetudoRobotError (if any)

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/StatusStateAttribute/error`
- Data type: [string](https://homieiot.github.io/specification/#string) (JSON)

Sample value:

```json
{
  "severity": {
    "kind": "none",
    "level": "none"
  },
  "subsystem": "none",
  "message": ""
}
```



##### Error description (`error_description`) <a id="errordescriptionerrordescription" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/StatusStateAttribute/error_description`
- Data type: [string](https://homieiot.github.io/specification/#string)

Sample value:

```
No error
```



##### Status flag (`flag`) <a id="statusflagflag" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/StatusStateAttribute/flag`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `none`, `zone`, `segment`, `spot`, `target`, `resumable`, `mapping`)

Sample value:

```
segment
```

Home Assistant components controlled by this property:

- Status Flag ([`sensor.mqtt`](https://www.home-assistant.io/integrations/sensor.mqtt/))



##### Status (`status`) <a id="statusstatus" />

*Property, readable, retained*

- Read topic: `<TOPIC PREFIX>/<IDENTIFIER>/StatusStateAttribute/status`
- Data type: [enum](https://homieiot.github.io/specification/#enum) (allowed payloads: `error`, `docked`, `idle`, `returning`, `cleaning`, `paused`, `manual_control`, `moving`)

Sample value:

```
cleaning
```





