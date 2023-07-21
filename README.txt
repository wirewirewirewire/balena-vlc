mbpoll 127.0.0.1 -a 0:4 -r 1 -c2 -m tcp -t 0
balena-engine exec -t -i 69ab5344b20a /bin/bash


Define DT overlays "vc4-kms-v3d","i2c-rtc","mcp7941x","neuron-spi","neuronee"