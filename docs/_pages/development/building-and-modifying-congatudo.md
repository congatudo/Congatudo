---
title: Building and Modifying Congatudo
category: Development
order: 41
---
# Building and Modifying Valetudo

These are instructions for quickly setting up an environment where you can build
and modify Congatudo according to your needs.

Please note that working with Congatudo requires at least NPM v7 and Nodejs v15.

### 1. Clone the repository

```
cd ~
git clone https://github.com/congatudo/Congatudo.git
```

### 2. Install dependencies

```
cd Congatudo
npm install
```

### 3. Create default configuration by running Congatudo

```
npm run start:dev --workspace=backend
CTRL + C
```

On first launch, Congatudo will generate a default config file at the location set in the `VALETUDO_CONFIG_PATH`
environment variable and automatically shut down, because it won't be able to autodetect the robot it is running on.

The `start:dev` script chooses `./local/valetudo_config.json`, relative to the root of the project, as the config location.

You need to edit the newly created file in order to be able to talk with your robot from your dev host:
```json
{
  "embedded": false,
  "robot": {
    "implementation": "CecotecCongaRobot",
    "implementationSpecificConfig": {
      "ip": "0.0.0.0",
    }
  }
}
```

Setting embedded to `false` disables all functionality that assumes that Congatudo runs on the robot such as some file-system related things.

For a list of possible values for `implementation` consult the robot implementations in
[https://github.com/congatudo/Congatudo/tree/master/backend/lib/robots](https://github.com/congatudo/Congatudo/tree/master/backend/lib/robots).
Congatudo is also capable of running without a real robot. The `MockRobot` implementation provides a virtual robot
that has a few basic capabilities. It requires no further implementation specific configuration.

The config key `robot` specifies the CecotecCongaRobot implementation Congatudo should use as well as some implementation-specific configuration parameters.
When running on the robot itself, these are usually detected automatically.

Please note that Congatudo will replace the configuration with a default one if it fails to parse it correctly.

The logfile is also configured via an environment variable: `VALETUDO_LOG_PATH` and defaults to `os.tmpdir()` if unset. <br/>
To just use stdout in your dev setup, you'll need

`VALETUDO_LOG_PATH=/dev/null` for linux/osx and

`VALETUDO_LOG_PATH=\\\\.\\NUL` for windows hosts.<br/>
That's `four backslash dot two backslash NUL` if it's not displayed correctly due to escaping issues.

### 4. Verify configuration and run
```
npm run start:dev --workspace=backend
```

If your configuration is correct, Congatudo should now be working on your development host.

### 5. Code!

Modify the source code according to your needs, and restart the server as needed -- you can always run it as:

```
npm run start:dev --workspace=backend
```

### 6. Build and install on the device

When you're done with your modifications, here's how to build the executable for the robot:

```
npm run build
```

The output file `valetudo` is a binary file that you can copy to the device:

```
scp ./build/armv7/valetudo root@vacuum:/usr/local/bin/
```

Once you're that far, you hopefully don't need any further advice.
