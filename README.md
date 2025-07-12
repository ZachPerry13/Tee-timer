# Tee-timer

This will need to be tweaked to work for you, most importantly, creating a .env file and populating it with your username and PW, and Golf Course's sign in page

1. Clone the Repo onto a linux server that runs 24/7
`git clone https://github.com/ZachPerry13/Tee-timer`


2. Create .env file in root of Project. 
Format is as follows: 
------
USERNAME=zachs@email.edu
PASSWORD=BingBangBongExamplePW
URL=https://lebaronhills.cps.golf/onlineresweb/auth/verify-email
------


3. Create Crontab to run this flow nightly at 12:01 EST
Example Crontab Entry:
------
1 4 * * * cd ~/Tee-timer && npx playwright test
------
