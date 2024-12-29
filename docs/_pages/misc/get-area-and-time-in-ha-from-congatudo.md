---
title: Get area and time in Home Assistant from Congatudo
category: Misc
order: 38
---

# Goal

Get Home Assistant sensors from Congatudo to measure time and area last cleaning

## Requirements

- Congatudo integrated into Home assistant
- Api Swagger available (For congatudo, just add a valid port for webui in the addon configuration)
- Congatudo should have a fixed IP

## Steps

In configuration.yaml add the code below to get sensors build from the Congatudo api every 5 seconds

```yaml
    rest:
        - scan_interval: 5
            resource: "http://<congatudo_or_ha_ip>:<congatudo_port>/api/v2/robot/state/attributes"
            sensor:
            - name: "Vacuum last clean area"
                value_template: "{{ value_json[4]['value'] }}"
                state_class: "measurement"
                json_attributes_path: "$[4]"
                json_attributes:
                - __class
                - metadata
                - type
                - value
            - name: "Vacuum last clean duration"
                value_template: "{{ value_json[3]['value'] }}"
                device_class: "timestamp"
                state_class: "total"
                json_attributes_path: "$[3]"
                json_attributes:
                - __class
                - metadata
                - type
                - value
```

Now, you have sensors for both time and area measures but just in default units, so in order to get them in human readable units, you are able to build virtual templated sensors. 

```yaml
    sensor:
        - platform: template
          sensors:
          vacuum_last_clean_duration_time:
            friendly_name: "Vacuum last clean duration time"
            value_template: >-
                {% set uptime = states.sensor.vacuum_last_clean_duration.state | int %}
                {% set days = (uptime / 86400) | int %}
                {%- if days > 0 -%}
                    {{ days }} days, {{ (uptime - (days * 86400)) | int | timestamp_custom('%H:%M:%S', false) }}
                {%- else -%}
                    {{ uptime | int | timestamp_custom('%H:%M:%S', false) }}
                {%- endif -%}
          vacuum_last_clean_area_m2:
            friendly_name: "Vacuum last clean area m2"
            value_template: "{{ ( states('sensor.vacuum_last_clean_area')|float / (10000)|float )  }}"
```

Restarting Home Assistant you'll find those sensors (sensor.vacuum_last_clean_duration_time and sensor.vacuum_last_clean_area_m2) available to use as you wish. Cheers