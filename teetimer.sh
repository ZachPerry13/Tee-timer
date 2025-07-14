#/bin/bash

export HOME=/home/zach
export PATH=$PATH:/usr/bin:/bin:/usr/local/bin

DATE=$(date +"%Y-%m-%d")
cd /home/zach/Tee-timer || echo "Failed to cd into Tee-timer" >> /home/zach/logs/cron_debug.log

npx playwright test > /home/zach/logs/$DATE.log 2>&1