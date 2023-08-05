#!/bin/bash

# Allow VLC to run as root
sed -i 's/geteuid/getppid/' /usr/bin/vlc || true 
sed -i 's/geteuid/getppid/' /usr/local/bin/vlc || true 

# Remove the X server lock file so ours starts cleanly
rm /tmp/.X0-lock &>/dev/null || true

# Set the display to use
export DISPLAY=:0

# Set the DBUS address for sending around system messages
export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

#some x configs
cat <<EOF > /etc/X11/xorg.conf.d/50-composite-off.conf
Section "Extensions"
        Option  "Composite" "false"
EndSection
EOF

cat <<EOF > /etc/X11/xorg.conf.d/10-monitor.conf
Section "Monitor"
    Identifier "LVDS0"
    Option "DPMS" "false"
EndSection

Section "ServerFlags"
    Option "StandbyTime" "0"
    Option "SuspendTime" "0"
    Option "OffTime" "0"
    Option "BlankTime" "0"
EndSection

Section "ServerLayout"
    Identifier "ServerLayout0"
EndSection
EOF

echo > /etc/X11/xorg.conf.d/20-amdgpu.conf <<EOF
Section "Device"
   Identifier  "AMD Graphics"
   Driver      "amdgpu"
   Option      "TearFree"  "true"
EndSection
EOF

sed -i '/@lxpanel --profile LXDE-pi/ s/./#&/' /etc/xdg/lxsession/LXDE-pi/autostart

# Start the desktop manager
echo "STARTING X"
if [[ -n "$CURSOR" ]]
  then
    startx -- :0 &
  else
    startx -- :0 -nocursor &
fi

# TODO: work out how to detect X has started
sleep 5

xrandr -display :0 --output DisplayPort-0 --set TearFree on || true 
xrandr -display :0 --output DisplayPort-1 --set TearFree on || true 
xrandr -display :0 --output DisplayPort-2 --set TearFree on || true 

# Hide the cursor
#unclutter -display :0 -idle 0.1 &

#start tests
if [[ -n "$CHROME_TEST" ]]
then
  echo "CHROME_TEST is set, start browser"
  DISPLAY=:0 chromium-browser --no-sandbox --enable-zero-copy --num-raster-threads=4 --ignore-gpu-blacklist --enable-gpu-rasterization --kiosk --start-fullscreen --disable-features=Translate --window-size=1920,1080 file:///code/test.mp4
  balena-idle
fi

if [[ -n "$VLC_TEST" ]]
  then
  echo "VLC_TEST is set, start vlc"
    DISPLAY=:0 cvlc --loop -f --no-osd --no-audio test.mp4
    balena-idle
fi

balena-idle

#DISPLAY=:0 cvlc --loop -f --no-osd test.mp4
#DISPLAY=:3 cvlc --loop -f --no-osd test.mp4
#DISPLAY=:1 cvlc --loop -f --no-osd test.mp4
#sudo apt install libgles2-mesa libgles2-mesa-dev xorg-dev
#DISPLAY=:0 chromium-browser --no-sandbox --enable-zero-copy --num-raster-threads=4 --ignore-gpu-blocklist --enable-gpu-rasterization --enable-features=VaapiVideoDecoder
#DISPLAY=:0 chromium-browser --no-sandbox --enable-accelerated-video-decode https://www.smarthome-agentur.de/wp-content/download/a3.mp4 
#DISPLAY=:0 chromium-browser --no-sandbox --app=https://www.smarthome-agentur.de/wp-content/download/a3.mp4  --start-fullscreen
#DISPLAY=:0 chromium-browser --no-sandbox --kiosk google.com --disable-features=Translate
#DISPLAY=:2 chromium-browser --no-sandbox --enable-zero-copy --num-raster-threads=4 --ignore-gpu-blacklist --enable-gpu-rasterization --kiosk --start-fullscreen --disable-features=Translate file:///code/test.mp4
#DISPLAY=:0 chromium-browser --no-sandbox --enable-zero-copy --num-raster-threads=4 --ignore-gpu-blacklist --enable-gpu-rasterization --kiosk --start-fullscreen --disable-features=Translate file:///code/test.mp4
#DISPLAY=:0 chromium-browser --no-sandbox --start-fullscreen --window-size=1920,1080 file:///code/test.mp4