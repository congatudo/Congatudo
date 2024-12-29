---
title: Docker installation
category: Installation
order: 2
---

# Docker installation

This page shall help you start using Congatudo with a Docker installation.

## Configuration file
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

## Use the prepared image
Then, you are able to just run the docker image
```shell
docker run -p 8080:8080 -p 4010:4010 -p 4030:4030 -p 4050:4050 -v $(pwd)/valetudo.json:/etc/valetudo/config.json --name congatudo ghcr.io/congatudo/Congatudo:alpine-latest
```
## Finally
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