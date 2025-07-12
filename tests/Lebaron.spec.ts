import { test as setup, expect } from '@playwright/test';
import 'dotenv/config';
import { emptyDirectory, formatDate, removecarts, finalize, confirmOrRetry, whatday, formatDay} from './aux-functions';

emptyDirectory('./screenshots');

//Variables for the Boys
declare var process : {
  env: {
      USERNAME: string;
      PASSWORD: string;
      URL: string;
  }
}
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const WeekendTeeTimes = ['9:15am', '9:24am', '9:33am']

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

////////////////////////////////////////START OF FlOW//////////////////////////////////////////////////////
setup('Check for Tee Times', async ({ page }) => {

  await page.goto('https://lebaronhills.cps.golf/onlineresweb/auth/verify-email');

  //Login
  await page.locator('input[name="email"]').fill(username);
  await page.getByText('Next').first().click();
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button').filter({ hasText: 'Sign In' }).nth(1).click();

  
  const DayofWeek = whatday(currentDate)
  console.log(DayofWeek)

  //Monday
  if (DayofWeek == '1') {
    console.log('It is a Monday, No Tee Times')
    await page.getByText(Day, { exact: true }).click();
  }

  //Tuesday
  if (DayofWeek == '2') {
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

