# Tee-timer

This will need to be tweaked to work for you, most importantly, creating a .env file and populating it with your username and PW, and Golf Course's sign in page

.env format is as follows: 
------
USERNAME=perry.z@northeastern.edu
PASSWORD=BingBangBongExamplePW
URL=https://lebaronhills.cps.golf/onlineresweb/auth/verify-email
------
Crontab:

1 4 * * * cd ~/Lebaron && npx playwright test

-------
File Structure:

├── package-lock.json
├── package.json
├── playwright
├── playwright.config.ts
├── .env
├── .gitignore
├── README.md
├── screenshots
├── test-results
│   └── Lebaron-Check-for-Tee-Times
│       ├── trace.zip
│       └── video.webm
└── tests
    └── Lebaron.spec.ts