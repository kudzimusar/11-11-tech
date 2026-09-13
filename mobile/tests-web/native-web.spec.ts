import { expect, test, type Page, type Request, type Response } from '@playwright/test'

const criticalResourceTypes = new Set(['document', 'script', 'stylesheet', 'xhr', 'fetch'])

function watchRuntime(page: Page) {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  const failedRequests: string[] = []
  const serverErrors: string[] = []

  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('requestfailed', (request: Request) => {
    if (criticalResourceTypes.has(request.resourceType())) failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`)
  })
  page.on('response', (response: Response) => {
    if (response.status() >= 500 && criticalResourceTypes.has(response.request().resourceType())) serverErrors.push(`${response.status()} ${response.url()}`)
  })

  return async (label: string) => {
    await page.waitForTimeout(200)
    expect(pageErrors, `${label}: uncaught page errors`).toEqual([])
    expect(consoleErrors, `${label}: console errors`).toEqual([])
    expect(failedRequests, `${label}: critical request failures`).toEqual([])
    expect(serverErrors, `${label}: 5xx responses`).toEqual([])
  }
}

async function expectNoOverflow(page: Page, label: string) {
  const result = await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }))
  expect(result.scrollWidth, `${label}: horizontal overflow`).toBeLessThanOrEqual(result.width + 1)
}

test('native Home renders without runtime errors or horizontal overflow', async ({ page }) => {
  const clean = watchRuntime(page)
  const response = await page.goto('./', { waitUntil: 'domcontentloaded' })
  expect(response?.ok()).toBeTruthy()
  await expect(page.getByText('Technology that makes business work better.', { exact: false }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open app menu' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Start a project/ }).first()).toBeVisible()
  await expectNoOverflow(page, 'native home')
  await clean('native home')
})

test('Reduce Motion keeps the cinematic hero on a still presentation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('SYSTEM FIELD / STILL', { exact: true })).toBeVisible()
})

test('remote visual failure degrades to an intentional fallback instead of a blank surface', async ({ page }) => {
  await page.route('**/*', async (route) => {
    const type = route.request().resourceType()
    if (type === 'image' || type === 'media') await route.abort()
    else await route.continue()
  })
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('Technology that makes business work better.', { exact: false }).first()).toBeVisible()
  await expect.poll(async () => page.getByText('VISUAL UNAVAILABLE', { exact: true }).count()).toBeGreaterThan(0)
})

test('native appearance controls switch System, Light and Dark semantics', async ({ page }) => {
  const clean = watchRuntime(page)
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Open app menu' }).click()
  await expect(page.getByText('APPEARANCE', { exact: true })).toBeVisible()

  const light = page.getByRole('button', { name: 'Use light appearance' })
  const dark = page.getByRole('button', { name: 'Use dark appearance' })
  const system = page.getByRole('button', { name: 'Use system appearance' })
  await light.click()
  await expect(light).toHaveAttribute('aria-selected', 'true')
  await dark.click()
  await expect(dark).toHaveAttribute('aria-selected', 'true')
  await system.click()
  await expect(system).toHaveAttribute('aria-selected', 'true')
  await expectNoOverflow(page, 'appearance menu')
  await clean('appearance menu')
})

test('native Start flow preserves business routing and validation', async ({ page }) => {
  const clean = watchRuntime(page)
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /Start a project/ }).first().click()
  await expect(page.getByText('WHAT SHOULD CHANGE?', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /Improve customer or user experience/i }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByText('ROUTE THE OPPORTUNITY.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByText(/Describe the problem in at least 20 characters/i)).toBeVisible()
  await expectNoOverflow(page, 'native start')
  await clean('native start')
})

test('native secure billing validates identity before opening the client workspace', async ({ page }) => {
  const clean = watchRuntime(page)
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Open app menu' }).click()
  await page.getByRole('button', { name: /Pay an invoice/i }).click()
  await expect(page.getByText('PAY AN INVOICE OR PROJECT BALANCE.', { exact: true })).toBeVisible()

  await page.getByLabel('Invoice or project reference').fill('11T-INV-2026-00042')
  await page.getByLabel('Billing email').fill('not-an-email')
  await page.getByRole('button', { name: /Continue securely/i }).click()
  await expect(page.getByText(/Enter the billing email attached to the engagement/i)).toBeVisible()

  await page.getByLabel('Billing email').fill('billing@example.com')
  await page.getByRole('button', { name: /Continue securely/i }).click()
  await expect(page.getByText('YOUR PROJECTS, AGREEMENTS & PAYMENTS.', { exact: true })).toBeVisible()
  await expect(page.getByText(/Client authentication is not connected in this build|billing email attached to your engagement/i)).toBeVisible()
  await expectNoOverflow(page, 'native billing')
  await clean('native billing')
})
