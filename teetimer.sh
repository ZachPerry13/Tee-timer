#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
cd ~/Tee-timer
npx playwright test > ~/logs/$DATE.log