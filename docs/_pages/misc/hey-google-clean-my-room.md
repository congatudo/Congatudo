---
title: Hey Google Clean My Room
category: Misc
order: 37
---

# Goal

Say "Hey Google, clean my room" to trigger your conga to clean that room


## Requirements
- Congatudo integrated into Home assistant
- Defined zones in Congatudo (or segments)
- Google assistant integrated in home assistant
- Vacuum domain exposed from home assistant to Google assistant

## Steps

1. Once you already know your zone IDs (under info button in zone section from Congatudo), yoy may have to create a script in home assistant to trigger that action in Congatudo.

    The MQTT topic to use is `ZoneCleaningCapability`, but for segments should be similar using `MapSegmentationCapability`
    ```yaml
    alias: Clean my room
    sequence:
    - service: mqtt.publish
        data:
            topic: valetudo/robot/ZoneCleaningCapability/start/set
            payload: 0e053bed-22b6-4b50-8a8f-b6fed99ec0ed
    mode: single
    icon: hass:sofa
    ```
    Where the topic is `<TOPIC PREFIX>/<IDENTIFIER>/ZoneCleaningCapability/start/` is the pone who trigger the action using `robot` as the name of the conga robot, you can get your identifier by going through settings/MQTT/identity/indetifier in Congatudo. The topic prefix is under the same menu in Customization/Topic Prefix, by default should be "valetudo"

    Save your changes in the script you have just created

2. The logic for this automation is already done and you are able to test and try it by pressing ▶ for this script.
3. In your home assistant configuration, be sure you exposed the vacuum domain and scripts
    ```yaml   
    google_assistant: 
        project_id: home-assistant-a6f6f
        service_account: !include SERVICE_ACCOUNT.JSON 
        report_state: true
        exposed_domains: 
            - vacuum
            - input_boolean
            - script
            - climate
        entity_config: !include googleHomeDevices.yaml
    ```
4. After that, just reboot your home assistant to force google assistant get the updates. Now, you are able to get a home assistant script from google home by going under scenes in a routine creation. Create a google home routine to run the home assistant routine, trigger the routine by "clean my room"