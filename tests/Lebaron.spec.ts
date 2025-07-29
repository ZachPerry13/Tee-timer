import { test as setup} from '@playwright/test';
import 'dotenv/config';
import { emptyDirectory, formatDate, whatday, formatDay, master, login } from './aux-functions';

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
const Tuesday_Times: Array<String> = ['12:30pm', '12:40pm', '12:50pm' ]
const WedThursFri_Times: Array<String>  = ['2:30pm', '3:30pm']
const Weekend_times: Array<String>  = ['9:15am', '10:20am']

// Get current date and create a new date that is 7 days ahead
const currentDate = new Date();
const oneWeekLater = new Date(currentDate);
oneWeekLater.setDate(currentDate.getDate() + 7);
const Day = formatDay(oneWeekLater)

// Print the formatted date of the current date and the new date (1 week later)
console.log('Current Date:', formatDate(currentDate));
console.log('One Week Later:', formatDate(oneWeekLater));
console.log('One Week Later Day:', Day);
console.log('Current Day of week:', whatday(currentDate));

////////////////////////////////////////START OF FlOW//////////////////////////////////////////////////////
setup('Lebaron Tee-Time Grabber', async ({ page }) => {
  emptyDirectory('./screenshots');

  //Login
  await login(page, username, password, url)

  const DayofWeek = whatday(currentDate)
  console.log(DayofWeek)

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