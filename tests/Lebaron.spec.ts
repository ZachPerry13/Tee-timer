import { test as setup, expect } from '@playwright/test';
import 'dotenv/config';
import { emptyDirectory, formatDate, removecarts, finalize, confirmOrRetry, whatday, formatDay, editbooking, trybothDays } from './aux-functions';

//Set Up Secure Credential Referencing
declare var process: {
  env: {
    USERNAME: string;
    PASSWORD: string;
    URL: string;
  }
}
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

//Tee Time Arrays
const Tuesday_Times = ['12:30pm', '12:40pm']
const WedThursFri_Times = ['2:30pm', '3:30pm']
const Weekend_times = ['9:15am', '10:20am']

// Get current date and create a new date that is 7 days ahead
const currentDate = new Date();
const oneWeekLater = new Date(currentDate);
oneWeekLater.setDate(currentDate.getDate() + 7);
var Day = formatDay(oneWeekLater)

// Remove leading O on day
if (Day[0] == '0') {
  Day = Day[1]
}

// Print the formatted date of the current date and the new date (1 week later)
console.log('Current Date:', formatDate(currentDate));
console.log('One Week Later:', formatDate(oneWeekLater));
console.log('One Week Later Day:', Day);
console.log('Current Day of week:', whatday(currentDate));

////////////////////////////////////////START OF FlOW//////////////////////////////////////////////////////
setup('Check for Tee Times', async ({ page }) => {
  emptyDirectory('./screenshots');
  await page.goto(process.env.URL);

  //Login
  await page.locator('input[name="email"]').fill(username);
  await page.getByText('Next').first().click();
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button').filter({ hasText: 'Sign In' }).nth(1).click();


  const DayofWeek = whatday(currentDate)
  console.log(DayofWeek)

  //Monday
  if (DayofWeek == '1') {
    console.log('It is a Monday, No Tee Times');
  }

  //Tuesday
  if (DayofWeek == '2') {
    await trybothDays(page, Day)
    await page.getByText('Show more Mid Day tee times').first().click();
    await page.getByText(Tuesday_Times[0]).first().click();
    await confirmOrRetry(page, Tuesday_Times[1]);
    await editbooking(page, 1, 9);
    await removecarts(page);
    //await finalize(page);
  }

  //Weds&Thurs
  if (DayofWeek == '3' || DayofWeek == '4') {
    await trybothDays(page, Day)
    await page.getByText(WedThursFri_Times[0]).first().click();
    await confirmOrRetry(page, WedThursFri_Times[1])
    await editbooking(page, 1, 9);
    await removecarts(page);
    await finalize(page);
  }
  //Fri
  if (DayofWeek == '5') {
    await trybothDays(page, Day)
    await page.getByText(WedThursFri_Times[0]).first().click();
    await confirmOrRetry(page, WedThursFri_Times[1])
    await removecarts(page)
    await finalize(page)
  }

  //Saturday and Sunday
  if (DayofWeek == '6' || DayofWeek == '0') {
    await trybothDays(page, Day)
    await page.getByText('Show more Morning tee times').first().click();
    await page.getByText(Weekend_times[0]).first().click();
    await confirmOrRetry(page, Weekend_times[1]);
    await removecarts(page);
    await finalize(page);
  }

  // Wait for 3 seconds
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/Lebaron/tee_time.png' });

});