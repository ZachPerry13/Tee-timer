import { test as setup, expect } from '@playwright/test';
import fs from 'fs-extra'
import 'dotenv/config';

//Variables for the Boys
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const WeekendTeeTimes = ['9:15am', '9:24am', '9:33am']


// Function to delete all files within a directory
async function emptyDirectory(directory) {
  try {
    fs.emptyDir(directory);
    console.log(`Successfully emptied directory: ${directory}`);
  } catch (err) {
    console.error(`Error emptying directory: ${directory}`, err);
  }
}
emptyDirectory('./screenshots');

// Custom Date Function
function formatDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

function formatDay(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}`;
}

function whatday(date: Date) {
  const day = date.getDay();
  return `${day}`;
}

async function confirmOrRetry(page,SecondTime) {
    var count = await page.getByText('This tee time is not available.').count();
    if (count > 0) {
      console.log('Tee Time not available');
      await page.getByText('Ok').first().click();
      await page.getByText(SecondTime).first().click();
    } else {
      console.log('available');
    }
  }

async function removecarts(page) {
  await page.waitForTimeout(3000);
  const cartElements = await page.getByText('Cart').all();
  var x = 0
  while (x < cartElements.length) {
    await page.getByText('Cart').nth(x).click();
    x += 1;
  }
}
async function finalize(page) {
  await page.waitForTimeout(3000);
  await page.getByText('Continue').first().click();
  await page.getByText('Finalize Reservation').first().click();
}

// Get current date and create a new date that is 7 days ahead
const currentDate = new Date();
const oneWeekLater = new Date(currentDate);
oneWeekLater.setDate(currentDate.getDate() + 7);
var Day = formatDay(oneWeekLater)


// Print the formatted date of the current date and the new date (1 week later)
console.log('Current Date:', formatDate(currentDate));
console.log('One Week Later:', formatDate(oneWeekLater));
console.log('One Week Later Day:', Day);
console.log('Current Day of week:', whatday(currentDate));

// If One week from now starts with a 0, remove it
console.log('logme: ', Day[0])
if (Day[0] == '0') {
  console.log(Day[0])
  Day = Day[1]
}
console.log(Day)

////////////////////////////////////////START OF TESTS//////////////////////////////////////////////////////
setup('Check for Tee Times', async ({ page }) => {

  await page.goto('https://lebaronhills.cps.golf/onlineresweb/auth/verify-email');

  //Login
  await page.locator('input[name="email"]').fill(username);
  await page.getByText('Next').first().click();
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button').filter({ hasText: 'Sign In' }).nth(1).click();

  //Get Tee Time, Open Box
  const DayofWeek = whatday(currentDate)
  console.log(DayofWeek)

  //Monday
  if (DayofWeek == '1') {
    console.log('It is a Monday, No Tee Times')
    await page.getByText(Day, { exact: true }).click();
    //await page.getByText('6:20pm').first().click();
    //await removecarts(page)
    //await finalize(page)
  }

  //Tuesday
  if (DayofWeek == '2') {
    //await page.getByText(Day, { exact: true }).first().click();
    //await page.locator('button:visible').getByText(Day, { exact: true }).first().click();
    await page.getByText(Day, { exact: true }).click();
    await page.getByText('Show more Mid Day tee times').first().click();
    await page.getByText('12:30pm').first().click();
    await confirmOrRetry(page, '3:30pm')
    await removecarts(page)
    await finalize(page)
  }

  //Wed-Friday
  if (DayofWeek == '3' || DayofWeek == '4' || DayofWeek == '5') {
    await page.getByText(Day, { exact: true }).click();
    await page.getByText('2:30pm').first().click();
    await confirmOrRetry(page, '3:30pm')
    await removecarts(page)
    await finalize(page)
  }

  //Saturday and Sunday
  if (DayofWeek == '6' || DayofWeek == '0') {
    await page.getByText(Day, { exact: true }).click();
    await page.getByText('Show more Morning tee times').first().click();
    await page.getByText('9:15am').first().click();
    await confirmOrRetry(page, '10:20am')
    await removecarts(page)
    await finalize(page)
  }

  // Wait for 3 seconds
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'screenshots/Lebaron/tee_time.png' });

});

