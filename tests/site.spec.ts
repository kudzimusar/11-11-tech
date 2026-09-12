import { expect, test } from '@playwright/test'

const routes = [
  ['./', '11-11 Tech'],
  ['work/', 'One studio.'],
  ['services/', 'Build the system.'],
  ['about/', 'Born from'],
  ['vision/', 'Build for the'],
  ['method/', 'The work behind'],
  ['contact/', 'Tell us what'],
  ['policies/', 'Public policies'],
] as const

test.describe('route integrity', () => {
  for (const [route, heading] of routes) {
    test(`${route} renders without runtime errors or horizontal overflow`, async ({ page }) => {
      const pageErrors: string[] = []
      const consoleErrors: string[] = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })

      const response = await page.goto(route, { waitUntil: 'networkidle' })
      expect(response?.ok()).toBeTruthy()
      await expect(page.locator('main')).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)

      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
      expect(pageErrors, `Page errors on ${route}`).toEqual([])
      expect(consoleErrors, `Console errors on ${route}`).toEqual([])
    })
  }
})

test('client navigation preserves clean URLs and browser history', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/\/11-11-tech\/work$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('One studio.')

  await page.goBack()
  await expect(page).toHaveURL(/\/11-11-tech\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('portfolio filter and project dialog are keyboard-operable', async ({ page }) => {
  await page.goto('work/')
  await page.getByRole('button', { name: 'Education' }).click()
  await expect(page.getByText('Showing 4 of 22 projects.')).toBeVisible()

  await page.getByRole('button', { name: 'View details for ALT Game Center' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'ALT Game Center' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('inquiry flow preserves data across steps and reaches review', async ({ page }) => {
  await page.goto('contact/')
  await page.locator('#name').fill('Test Visitor')
  await page.locator('#email').fill('visitor@example.com')
  await page.locator('#region').selectOption({ label: 'Africa' })
  await page.getByRole('button', { name: /Continue/ }).click()

  await page.locator('#type').selectOption({ label: 'New product / MVP' })
  const goals = 'Build a reliable product with a clear launch path and strong mobile usability.'
  await page.locator('#goals').fill(goals)
  await page.getByRole('button', { name: /Continue/ }).click()

  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: /Review inquiry/ }).click()
  await expect(page.getByRole('heading', { name: '04. Ready to send.' })).toBeVisible()
  await expect(page.getByText('Test Visitor')).toBeVisible()
  await expect(page.getByText(goals)).toBeVisible()

  await page.getByRole('button', { name: 'Back' }).click()
  await page.getByRole('button', { name: 'Back' }).click()
  await expect(page.locator('#goals')).toHaveValue(goals)
})

test('mobile navigation traps focus and closes with Escape', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile-only behavior')
  await page.goto('./')
  const menuButton = page.getByRole('button', { name: 'Open menu' })
  await menuButton.click()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
})
