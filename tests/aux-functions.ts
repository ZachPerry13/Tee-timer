import fs from 'fs-extra'

// Function to delete all files within a directory
export async function emptyDirectory(directory) {
  try {
    fs.emptyDir(directory);
    console.log(`Successfully emptied directory: ${directory}`);
  } catch (err) {
    console.error(`Error emptying directory: ${directory}`, err);
  }
}

// Custom Date Function
export function formatDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

export function formatDay(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}`;
}

export function whatday(date: Date) {
  const day = date.getDay();
  return `${day}`;
}

export async function confirmOrRetry(page,SecondTime) {
    var count = await page.getByText('This tee time is not available.').count();
    if (count > 0) {
      console.log('Tee Time not available');
      await page.getByRole('button', { name: 'OK' }).click();
      await page.getByText(SecondTime).first().click();
    } else {
      console.log('available');
    }
  }

export async function removecarts(page) {
  await page.waitForTimeout(3000);
  const cartElements = await page.getByText('Cart').all();
  var x = 0
  while (x < cartElements.length) {
    await page.getByText('Cart').nth(x).click();
    x += 1;
  }
}
export async function finalize(page) {
  await page.waitForTimeout(3000);
  await page.getByText('Continue').first().click();
  await page.getByText('Finalize Reservation').first().click();
}

export async function editbooking(page, numberofgolfers, numberofholes){
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: numberofgolfers, exact: true }).click();
    await page.getByRole('button', { name: numberofholes, exact: true }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
}