import { test as setup} from '@playwright/test';
import 'dotenv/config';
import {formatDate, whatday, formatDay, master, login } from './aux-functions';

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
const url = process.env.URL;

//Tee Time Arrays
const Tuesday_Times: Array<String> = ['12:30', '12:40', '12:50' ]
const WedThursFri_Times: Array<String>  = ['8:50','12:50','2:00','2:10','2:20','2:30','2:40', '3:30']
const Weekend_times: Array<String>  = ['9:15', '10:20']

// Get current date and create a new date that is 7 days ahead
const currentDate = new Date();
const oneWeekLater = new Date(currentDate);
oneWeekLater.setDate(currentDate.getDate() + 7);
const Day = formatDay(oneWeekLater)
const DayofWeek = whatday(currentDate)

console.log('Current Date:', formatDate(currentDate));
console.log('One Week Later:', formatDate(oneWeekLater));
console.log('One Week Later Day:', Day);
console.log('Current Day of week:', DayofWeek);

////////////////////////////////////////START OF FlOW//////////////////////////////////////////////////////
setup('Lebaron Tee-Time Grabber', async ({ page }) => {
  await login(page, username, password, url)

  //Monday
  if (DayofWeek == '1') {
    console.log('It is a Monday, No Tee Times');
  }
  //Tuesday
  if (DayofWeek == '2') {
    await master(page, Day, Tuesday_Times, 1, 9, true)
  }
  //Weds&Thurs
  if (DayofWeek == '3' || DayofWeek == '4') {
    await master(page, Day, WedThursFri_Times, 1, 9, true)
  }
  //Fri
  if (DayofWeek == '5') {
    await master(page, Day, WedThursFri_Times, 4, 18, false)
  }

  //Saturday and Sunday
  if (DayofWeek == '6' || DayofWeek == '0') {
    await master(page, Day, Weekend_times, 4, 18, false)
  }

  // Wait for 3 seconds
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/Lebaron/tee_time.png' });

});