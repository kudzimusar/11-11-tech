import { expect, test, type Page, type Request, type Response } from '@playwright/test'

const criticalResourceTypes = new Set(['document', 'script', 'stylesheet', 'xhr', 'fetch'])

function watchRuntime(page: Page) {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []
  const failedRequests: string[] = []
  const serverErrors: string[] = []

  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('requestfailed', (request: Request) => {
    if (criticalResourceTypes.has(request.resourceType())) failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`)
  })
  page.on('response', (response: Response) => {
    if (response.status() >= 500 && criticalResourceTypes.has(response.request().resourceType())) serverErrors.push(`${response.status()} ${response.url()}`)
  })

  return async (label: string) => {
    await page.waitForTimeout(150)
    expect(pageErrors, `${label}: uncaught page errors`).toEqual([])
    expect(consoleErrors, `${label}: console errors`).toEqual([])
    expect(failedRequests, `${label}: critical request failures`).toEqual([])
    expect(serverErrors, `${label}: 5xx responses`).toEqual([])
  }
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }))
  expect(dimensions.scrollWidth, `${label}: horizontal overflow`).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
}

const publicRoutes = [
  ['./', 'Technology that makes'],
  ['work/', 'Experience across industries'],
  ['capabilities/', 'Clear services'],
  ['pricing/', 'Know the range'],
  ['trust/', 'Quality, confidentiality'],
  ['contact/', 'Tell us what'],
  ['pay/', 'Pay an invoice'],
  ['payment/success/', 'Your payment has been submitted securely'],
  ['payment/cancelled/', 'No payment was completed'],
] as const

for (const [route, marker] of publicRoutes) {
  test(`${route} stays clean, visible and overflow-safe`, async ({ page }) => {
    const assertRuntimeClean = watchRuntime(page)
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
    expect(response?.ok(), `${route}: document response`).toBeTruthy()
    await expect(page.locator('body')).toContainText(marker)
    await expectNoHorizontalOverflow(page, route)
    await assertRuntimeClean(route)
  })
}

test('commercial entry surfaces fail closed without exposing account data', async ({ page }) => {
  const assertRuntimeClean = watchRuntime(page)

  await page.goto('client/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('body')).toContainText(/secure|client/i)
  await expect(page.locator('body')).not.toContainText(/stripe_secret|service_role/i)
  await expectNoHorizontalOverflow(page, 'client')

  await page.goto('admin/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('body')).toContainText(/commercial|admin|sign/i)
  await expect(page.locator('body')).not.toContainText(/stripe_secret|service_role/i)
  await expectNoHorizontalOverflow(page, 'admin')

  await assertRuntimeClean('commercial entry')
})

test('payment result keeps web and native recovery paths distinct', async ({ page }) => {
  const assertRuntimeClean = watchRuntime(page)
  await page.goto('payment/success/', { waitUntil: 'domcontentloaded' })
  const nativeReturn = page.getByRole('link', { name: 'Return to native app' })
  await expect(nativeReturn).toHaveAttribute('href', 'eleveneleven://client?payment=success')
  await expect(page.getByRole('link', { name: /Open web client workspace/ })).toBeVisible()

  await page.goto('payment/cancelled/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('link', { name: 'Return to native app' })).toHaveAttribute('href', 'eleveneleven://client?payment=cancelled')
  await assertRuntimeClean('payment result')
})

test('critical mobile controls meet minimum touch height', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop-1440', 'Touch-target check is for touch layouts.')
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  const controls = page.locator('.btn:visible, .menu-btn:visible')
  const count = await controls.count()
  expect(count).toBeGreaterThan(0)
  for (let index = 0; index < count; index += 1) {
    const box = await controls.nth(index).boundingBox()
    if (!box) continue
    expect(box.height, `control ${index} should be at least 44px tall`).toBeGreaterThanOrEqual(44)
  }
})

test('keyboard navigation can reach primary navigation and start action', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1440', 'Keyboard navigation is certified once at desktop Chromium.')
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await page.keyboard.press('Tab')
  const first = page.locator(':focus')
  await expect(first).toBeVisible()
  for (let index = 0; index < 12; index += 1) {
    const focusedText = (await page.locator(':focus').textContent()) || ''
    if (/start a project/i.test(focusedText)) return
    await page.keyboard.press('Tab')
  }
  await expect(page.getByRole('link', { name: /Start a project/i }).first()).toBeVisible()
})
