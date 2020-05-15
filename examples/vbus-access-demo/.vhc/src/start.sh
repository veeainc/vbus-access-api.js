#!/bin/sh

# Mark the start of this platform container
logger "Starting [vbus access] platform service [$$]"


# Start vbus server
logger "Starting vBus access"
vbus-access --config /app/config.yaml
