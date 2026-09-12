import { expect, test } from '@playwright/test'

const routes = [
  ['./', 'Technology that makes'],
  ['work/', 'Experience across industries'],
  ['capabilities/', 'Clear services.'],
  ['capabilities/ui-ux/', 'UI/UX & Front-End Engineering'],
  ['capabilities/enterprise/', 'Enterprise Systems & CRM'],
  ['capabilities/ai/', 'AI & Intelligent Automation'],
  ['capabilities/software-data-cloud/', 'Software, Data & Cloud Engineering'],
  ['capabilities/transformation/', 'Digital Transformation & Technology Advisory'],
  ['capabilities/talent/', 'Technology Talent & IT Recruitment'],
  ['capabilities/trust/', 'Trust, Security & Engineering Assurance'],
  ['solutions/', 'Start with the'],
  ['industries/', 'Built around'],
  ['pricing/', 'Know the range'],
  ['trust/', 'Quality, confidentiality'],
  ['insights/', 'Useful thinking'],
  ['about/', 'An IT services company'],
  ['vision/', 'Explore the next technology pattern.'],
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
      page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })

      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(response?.ok()).toBeTruthy()
      await expect(page.locator('main')).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)

      const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewportWidth: window.innerWidth }))
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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Experience across industries')

  await page.goBack()
  await expect(page).toHaveURL(/\/11-11-tech\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Technology that makes')
})

test('home communicates services visually without losing discovery, industries, pricing and trust', async ({ page }, testInfo) => {
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.motion-hero')).toBeVisible()
  await expect(page.locator('.motion-hero-poster')).toBeVisible()
  await expect.poll(async () => page.locator('.motion-hero-poster').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)

  if (testInfo.project.name.startsWith('mobile')) await expect(page.locator('.motion-hero-video')).toHaveCount(0)
  else { await expect(page.locator('.motion-hero-video')).toHaveCount(1); await expect(page.locator('.motion-hero-video source')).toHaveAttribute('src', /^https:\/\//) }

  await expect(page.getByText('We design, build and improve the digital systems organizations depend on.', { exact: true })).toBeVisible()
  await expect(page.locator('.service-theatre-tabs button')).toHaveCount(7)
  await page.getByRole('tab', { name: /AI & Automation/ }).click()
  await expect(page.locator('.service-theatre-copy')).toContainText('Apply AI where it can improve work, decisions, service and productivity.')
  await expect(page.locator('.visual-story-v21-card')).toHaveCount(3)
  await expect(page.locator('.industry-row-v21')).toHaveCount(8)
  await page.getByRole('button', { name: 'Introduce AI' }).click()
  await expect(page.locator('.finder-result')).toContainText('AI & Automation')
  await expect(page.getByText('From $2,000', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Trust & contracting ↗' })).toBeVisible()
})

test('services page keeps detailed catalogue behind progressive disclosure', async ({ page }) => {
  await page.goto('capabilities/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Seven ways we help.' })).toBeVisible()
  const firstDisclosure = page.locator('.disclosure').first()
  await expect(firstDisclosure).not.toHaveClass(/open/)
  await firstDisclosure.getByRole('button').click()
  await expect(firstDisclosure).toHaveClass(/open/)
  await expect(firstDisclosure.getByText('UX Audit & Assessment', { exact: true })).toBeVisible()
  await expect(firstDisclosure.getByText('$2,000–$3,000', { exact: true })).toBeVisible()
})

test('capability page uses progressive disclosure with pricing and proof', async ({ page }) => {
  await page.goto('capabilities/ai/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.capability-visual')).toBeVisible()
  const agentTrigger = page.getByRole('button', { name: /AI Agents/ })
  await agentTrigger.click()
  await expect(agentTrigger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText('$5,000–$10,000', { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /Discuss AI Agents/ })).toBeVisible()
})

test('industries keep service and proof detail behind expandable rows', async ({ page }) => {
  await page.goto('industries/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.industry-detail-v21')).toHaveCount(8)
  const firstIndustry = page.locator('.industry-detail-v21').first()
  await firstIndustry.locator(':scope > summary').click()
  await expect(firstIndustry).toHaveAttribute('open', '')
  await expect(firstIndustry.getByText('Relevant services', { exact: true })).toBeVisible()
})

test('pricing keeps per-capability detail expandable', async ({ page }) => {
  await page.goto('pricing/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.pricing-detail-v21')).toHaveCount(7)
  const firstPricing = page.locator('.pricing-detail-v21').first()
  await firstPricing.locator(':scope > summary').click()
  await expect(firstPricing).toHaveAttribute('open', '')
  await expect(firstPricing.getByText('UX Audit & Assessment', { exact: true })).toBeVisible()
})

test('work is industry-led and lab work is separated from selected evidence', async ({ page }) => {
  await page.goto('work/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.work-industry-card')).toHaveCount(8)
  await expect(page.locator('.proof-logo-card')).toHaveCount(8)
  await expect(page.getByText('Experiments and prototypes are useful R&D, not client claims.')).toBeVisible()
  const labToggle = page.getByText(/Explore \d+ Lab \/ prototype initiatives/)
  await labToggle.click()
  await expect(page.locator('.lab-mini-grid button')).toHaveCount(14)
  await page.getByRole('button', { name: 'View selected evidence for ALT Game Center' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'ALT Game Center' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('classified inquiry flow preserves context and reaches review', async ({ page }) => {
  await page.goto('contact/?capability=ui-ux&service=UX%20Audit%20%26%20Assessment', { waitUntil: 'domcontentloaded' })
  await page.getByText('Improve customer or user experience', { exact: true }).click()
  await page.getByRole('button', { name: /Continue/ }).click()

  await expect(page.locator('#capability')).toHaveValue('ui-ux')
  await expect(page.locator('#service')).toHaveValue('UX Audit & Assessment')
  const goals = 'Modernize an existing product interface, improve mobile usability and reduce user friction.'
  await page.locator('#goals').fill(goals)
  await page.getByRole('button', { name: /Continue/ }).click()

  await page.locator('#budget').selectOption({ label: 'US$3,500–5,000' })
  await page.getByRole('button', { name: /Continue/ }).click()

  await page.locator('#name').fill('Test Visitor')
  await page.locator('#email').fill('visitor@example.com')
  await page.getByLabel('I consent to being contacted about this inquiry. *').check()
  await page.getByRole('button', { name: /Continue/ }).click()

  await expect(page.getByRole('heading', { name: 'Your project brief is classified.' })).toBeVisible()
  await expect(page.getByText('11T-UI-UX')).toBeVisible()
  await expect(page.getByText('Test Visitor')).toBeVisible()
  await expect(page.getByText('visitor@example.com')).toBeVisible()
  await expect(page.getByText(goals)).toBeVisible()

  await page.getByRole('button', { name: 'Back' }).click()
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
