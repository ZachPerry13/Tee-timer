# Tee-timer

This is a guide to setting up and running the Tee-timer application. Please note that you will need to customize certain aspects, such as creating a `.env` file with your credentials and specifying the golf course's sign-in page.

I normally would not include all Node Modules, but it makes it much easier to config changes across my dev and prod enviroment. 

## Getting Started

Follow these steps to set up and run the Tee-timer application:

### Step 1: Clone the Repository

Clone the repository onto a Linux server that runs 24/7 using the following command:

```bash
git clone https://github.com/ZachPerry13/Tee-timer
```

### Step 2: Create .env file

Create a `.env` file in the root of the project with the following format:

```ini
USERNAME=your_email@example.edu
PASSWORD=YourPassword123
URL=https://golf-course-sign-in-page.com/onlineresweb/auth/verify-email
```


### Step 3: Edit playwright.config.ts

Edit playwright.config.ts to run the flow headless:

```bash
headless: true
```

### Step 4: Create Crontab

Create a crontab to run the flow nightly at 12:01 EST with the following entry:

```bash
1 4 * * * cd ~/Tee-timer && npx playwright test
```
