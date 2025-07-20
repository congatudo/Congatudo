---
title: Time and Tank Virtual Sensors
category: Misc
order: 40
---

# Goal

Congatudo is so great, but its home assistant integration miss out some good sensors like the time, area and tank fill percentage.

With this guide, you are going to learn how to create virtual sensor to get the cleaning time and tank percentage based on this time.

## Requirements
- Congatudo integrated into Home assistant

## Steps

1. Create one input date time helper. In this example the helper will be called RobotStartCleaningTime, being an date and time helper, so the id of this helper will be: `input_datetime.robotstartcleaningtime`

2. In the configuration file, we are going to create three sensors
   1. All history cleaning time
{% raw %}
      ```yaml
      - platform: history_stats
        name: Conga Cleaning
        entity_id: vacuum.conga
        state: 'cleaning'
        type: time
        start: "{{ state_attr('input_datetime.robotstartcleaningtime', 'timestamp') }}"
        end: '{{ now() }}'
      ```
{% endraw %}
        With the entity_id for you vacuum robot and the helper you created before

   2. Tank virtual sensor, based on the cleaning time stats and conga cleaning in time
{% raw %}
      ```yaml
      - platform: template
        sensors:
          conga_cleaning_time:
            friendly_name: "Conga Cleaning Time"
            value_template: "{{ state_attr('sensor.conga_cleaning', 'value') }}"
          conga_tank_percentage:
            friendly_name: "Conga Tank Percentage"
            value_template: "{{ ( states('sensor.conga_cleaning')|float * (100)|float / (10)|float ) | round(0)  }}"
      ```
{% endraw %}
        This conga_tank_percentage is valid for my tank based on rule how many minutes cleaning the tank needs to be full . Do the maths for your needs

   3. Now, you are able to use this sensor in some card or even better, to trigger some automation
