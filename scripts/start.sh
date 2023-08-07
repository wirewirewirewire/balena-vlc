#!/bin/bash

# Allow VLC to run as root
sed -i 's/geteuid/getppid/' /usr/bin/vlc || true 
sed -i 's/geteuid/getppid/' /usr/local/bin/vlc || true 

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

while [ ! -e /tmp/.X11-unix/X${DISPLAY#*:} ]; do sleep 0.5; done

if [[ -n "$VLC_TEST" ]]
  then
  echo "VLC_TEST is set, start vlc"
    DISPLAY=:0 cvlc --loop -f --no-osd --no-audio --control dbus test.mp4
    balena-idle
fi

balena-idle

#chromium --no-sandbox --enable-zero-copy --num-raster-threads=4 --ignore-gpu-blacklist --enable-gpu-rasterization --disable-features=Translate --window-size=1920,1080 https://www.smarthome-agentur.de/wp-content/download/a3.mp4
