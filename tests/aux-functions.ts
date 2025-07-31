// Custom Date Function
export function formatDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

export function formatDay(date: Date) {
  var day = String(date.getDate()).padStart(2, '0');
  if (day[0] == '0') {
    day = day[1]
  }
  return `${day}`;
}

export function whatday(date: Date) {
  const day = date.getDay();
  return `${day}`;
}

export async function confirmOrRetry(page, SecondTime) {
  var count = await page.getByText('This tee time is not available.').count();
  if (count > 0) {
    console.log('Tee Time not available');
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByText(SecondTime, { exact: true }).first().click();
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
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Finalize Reservation' }).click();
}


export async function editbooking(page, numberofgolfers, numberofholes) {
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('button', { name: numberofgolfers, exact: true }).click();
  await page.getByRole('button', { name: numberofholes, exact: true }).click();
  await page.getByRole('button', { name: 'Submit' }).click();

}



export async function findcalendarDay(page, dayText: string) {
  await page.waitForTimeout(3000);
  const calendar = page.locator('.main-calendar-days');

  // Match spans by CSS, then filter to exact text manually
  const possibleDays = calendar.locator(
    `.day-background-upper.is-visible:not(.is-disabled)`
  );

  const count = await possibleDays.count();
  for (let i = 0; i < count; i++) {
    const day = possibleDays.nth(i);
    const text = await day.textContent();
    const isHidden = await day.getAttribute('aria-hidden');

    if (text?.trim() === dayText && isHidden === 'false' && await day.isVisible()) {
      await day.click();
      return; // stop recursion if day is found and clicked
    }
  }
  await page.locator('#Forward').click();
  await findcalendarDay(page, dayText)
}
export async function expandteetimes(page) {
  await page.getByText('Show more Mid Day tee times').first().click();
  await page.getByText('Show more Morning tee times').first().click();
}

export async function findtime(page, times: Array<String>,) {
  const time = times[0];
  const count = await page.getByText(time, { exact: true }).count();
  if (count > 0) {
    await page.getByText(time, { exact: true }).first().click();
    return;
  }

  // Try the next time recursively
  await findtime(page, times.slice(1));
}

export async function login(page, username: string, password: string, url: string) {
  await page.goto(url);
  await page.locator('input[name="email"]').fill(username);
  await page.getByText('Next').first().click();
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button').filter({ hasText: 'Sign In' }).nth(1).click();
}

export async function master(page, Day: string, Times: Array<String>, NumberofGolfers: number, NumberofHoles: number, EditBooking: Boolean) {
  await findcalendarDay(page, Day)
  await expandteetimes(page)
  await findtime(page, Times)
  await confirmOrRetry(page, Times[1]);
  if (EditBooking == true) {
    await editbooking(page, NumberofGolfers, NumberofHoles);
    await removecarts(page);
  }
  await finalize(page);
}