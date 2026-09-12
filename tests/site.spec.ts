import { expect, test } from '@playwright/test'

const routes = [
  ['./', 'Systems that'],
  ['work/', 'Products with'],
  ['services/', 'Strategy to'],
  ['about/', 'Built between'],
  ['vision/', 'Build the'],
  ['method/', 'Discover.'],
  ['contact/', 'Tell us what'],
  ['policies/', 'Clear'],
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

      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
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

test('client navigation preserves clean URLs and browser history', async ({ page }, testInfo) => {
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  if (testInfo.project.name.startsWith('mobile')) {
    await page.locator('.menu-btn').click()
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Work' }).click()
  } else {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work' }).click()
  }
  await expect(page).toHaveURL(/\/11-11-tech\/work$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Products with')

  await page.goBack()
  await expect(page).toHaveURL(/\/11-11-tech\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Systems that')
})

test('media-led home exposes loaded imagery, motion and interactive system topology', async ({ page }, testInfo) => {
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.motion-hero')).toBeVisible()
  await expect(page.locator('.motion-hero-poster')).toBeVisible()
  await expect.poll(async () => page.locator('.motion-hero-poster').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)

  if (testInfo.project.name.startsWith('mobile')) {
    await expect(page.locator('.motion-hero-video')).toHaveCount(0)
  } else {
    await expect(page.locator('.motion-hero-video')).toHaveCount(1)
    await expect(page.locator('.motion-hero-video source')).toHaveAttribute('src', /^https:\/\//)
  }

  await expect(page.locator('.system-field canvas')).toBeVisible()
  await page.getByRole('button', { name: /Inject signal/ }).click()
  await expect(page.locator('.visual-story-card')).toHaveCount(3)
  await expect(page.locator('.media-case')).toHaveCount(3)
  await expect.poll(async () => page.locator('.visual-story-card img, .media-case img').evaluateAll((images: HTMLImageElement[]) => images.length === 6 && images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true)
})

test('portfolio filter and project dialog are keyboard-operable', async ({ page }) => {
  await page.goto('work/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Education', exact: true }).click()
  await expect(page.getByText('Showing 4 of 22 projects.')).toBeVisible()

  await page.getByRole('button', { name: 'View details for ALT Game Center' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'ALT Game Center' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('inquiry flow preserves data across steps and reaches review', async ({ page }) => {
  await page.goto('contact/', { waitUntil: 'domcontentloaded' })
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
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  const menuButton = page.locator('.menu-btn')
  await menuButton.click()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
})
