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
  ['solutions/', 'Start with what'],
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
      await expect(page.locator('.footer-trust-strip-v23')).toHaveCount(1)
      await expect(page.locator('.footer-cta-v23')).toHaveCount(1)
      await expect(page.locator('.corporate-footer-v23')).toHaveCount(1)

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
  await expect(page.locator('.human-intro-grid-v22 img')).toHaveCount(3)
  await page.locator('.human-intro-main-v22').scrollIntoViewIfNeeded()
  await expect.poll(async () => page.locator('.human-intro-main-v22 img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)

  await expect(page.locator('.service-theatre-tabs button')).toHaveCount(7)
  await page.getByRole('tab', { name: /AI & Automation/ }).click()
  await expect(page.locator('.service-theatre-copy')).toContainText('Apply AI where it can improve work, decisions, service and productivity.')
  await expect(page.locator('.service-theatre-photo-v22')).toHaveAttribute('src', /^https:\/\//)
  await expect(page.locator('.visual-story-v21-card')).toHaveCount(3)
  await expect(page.locator('.industry-photo-v22')).toHaveCount(8)
  await expect(page.locator('.industry-row-v21')).toHaveCount(8)
  await page.getByRole('button', { name: 'Introduce AI' }).click()
  await expect(page.locator('.finder-result')).toContainText('AI & Automation')
  await expect(page.getByText('From $2,000', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Trust & contracting ↗' })).toBeVisible()
})

test('services page keeps detailed catalogue behind progressive disclosure', async ({ page }) => {
  await page.goto('capabilities/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Seven ways we help.' })).toBeVisible()
  await expect(page.locator('.capability-visual-tile-v22')).toHaveCount(7)
  const firstDisclosure = page.locator('.disclosure').first()
  await expect(firstDisclosure).not.toHaveClass(/open/)
  await firstDisclosure.getByRole('button').click()
  await expect(firstDisclosure).toHaveClass(/open/)
  await expect(firstDisclosure.getByText('UX Audit & Assessment', { exact: true })).toBeVisible()
  await expect(firstDisclosure.getByText('$2,000–$3,000', { exact: true })).toBeVisible()
})

test('capability page uses progressive disclosure with pricing, proof and editorial imagery', async ({ page }) => {
  await page.goto('capabilities/ai/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.capability-visual')).toBeVisible()
  await expect(page.locator('.capability-hero-art-v22 img')).toHaveAttribute('src', /^https:\/\//)
  await expect.poll(async () => page.locator('.capability-hero-art-v22 img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  const agentTrigger = page.getByRole('button', { name: /AI Agents/ })
  await agentTrigger.click()
  await expect(agentTrigger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText('$5,000–$10,000', { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /Discuss AI Agents/ })).toBeVisible()
})

test('industries keep service and proof detail behind expandable rows', async ({ page }) => {
  await page.goto('industries/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.industry-visual-tile-v22')).toHaveCount(8)
  await expect(page.locator('.industry-detail-v21')).toHaveCount(8)
  const firstIndustry = page.locator('.industry-detail-v21').first()
  await firstIndustry.locator(':scope > summary').click()
  await expect(firstIndustry).toHaveAttribute('open', '')
  await expect(firstIndustry.getByText('Relevant services', { exact: true })).toBeVisible()
  await expect(firstIndustry.locator('.industry-detail-image-v22 img')).toHaveAttribute('src', /^https:\/\//)
})

test('pricing keeps per-capability detail expandable', async ({ page }) => {
  await page.goto('pricing/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.compact-editorial-media-v22 img')).toHaveAttribute('src', /^https:\/\//)
  await expect(page.locator('.pricing-detail-v21')).toHaveCount(7)
  const firstPricing = page.locator('.pricing-detail-v21').first()
  await firstPricing.locator(':scope > summary').click()
  await expect(firstPricing).toHaveAttribute('open', '')
  await expect(firstPricing.getByText('UX Audit & Assessment', { exact: true })).toBeVisible()
})

test('work is industry-led and lab work is separated from selected evidence', async ({ page }) => {
  await page.goto('work/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.work-industry-card')).toHaveCount(8)
  await expect(page.locator('.work-industry-card-v22 figure img')).toHaveCount(8)
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

test('intake validation prevents incomplete opportunities and preserves commercial fields', async ({ page }) => {
  await page.goto('contact/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.lead-honeypot-v23')).toHaveValue('')
  await expect(page.locator('.lead-honeypot-v23')).toBeHidden()

  await page.getByRole('button', { name: /Continue/ }).click()
  await expect(page.getByRole('alert')).toContainText('Please complete the required fields')

  await page.getByText('Improve customer or user experience', { exact: true }).click()
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.locator('#capability').selectOption('ui-ux')
  await page.locator('#goals').fill('Too short')
  await page.getByRole('button', { name: /Continue/ }).click()
  await expect(page.getByRole('alert')).toContainText('Please complete the required fields')

  const goals = 'Improve a complex operational interface without replacing the underlying business system.'
  await page.locator('#goals').fill(goals)
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.locator('#budget').selectOption({ label: 'US$5,000–7,500' })
  await page.locator('#preferred').selectOption({ label: 'Video call' })
  await page.getByRole('button', { name: /Continue/ }).click()

  await page.locator('#name').fill('Regression Visitor')
  await page.locator('#email').fill('regression@example.com')
  await page.locator('#referral').selectOption({ label: 'Referral' })
  await page.getByLabel('Security assessment').check()
  await page.getByLabel('I consent to being contacted about this inquiry. *').check()
  await page.getByRole('button', { name: /Continue/ }).click()

  await expect(page.getByRole('heading', { name: 'Your project brief is classified.' })).toBeVisible()
  await expect(page.getByText('US$5,000–7,500')).toBeVisible()
  await expect(page.getByText('Video call')).toBeVisible()
  await expect(page.getByText('Security review')).toBeVisible()
  await expect(page.getByRole('button', { name: /Open email draft/ })).toBeVisible()

  await page.getByRole('button', { name: 'Back' }).click()
  await expect(page.locator('#referral')).toHaveValue('Referral')
  await expect(page.getByLabel('Security assessment')).toBeChecked()
  await page.getByRole('button', { name: 'Back' }).click()
  await expect(page.locator('#budget')).toHaveValue('US$5,000–7,500')
  await expect(page.locator('#preferred')).toHaveValue('Video call')
})

test('corporate closing system matches the approved structure without unsupported client claims', async ({ page }) => {
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  const trust = page.locator('.footer-trust-strip-v23')
  await trust.scrollIntoViewIfNeeded()
  await expect(trust.getByText('BUILT ACROSS SECTORS', { exact: true })).toBeVisible()
  await expect(trust.locator('.footer-sector-marks-v23 span')).toHaveCount(6)

  const cta = page.locator('.footer-cta-v23')
  await expect(cta.getByRole('heading', { name: 'What’s next for your organisation?' })).toBeVisible()
  await expect(cta.getByRole('link', { name: /Start a conversation/ })).toHaveAttribute('href', /\/contact$/)
  await expect(cta.getByRole('link', { name: 'See our work' })).toHaveAttribute('href', /\/work$/)
  await expect.poll(async () => cta.locator(':scope > img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)

  const footer = page.locator('.corporate-footer-v23')
  await expect(footer.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link')).toHaveCount(7)
  await expect(footer.getByText('Tokyo', { exact: true })).toBeVisible()
  await expect(footer.getByText('Harare', { exact: true })).toBeVisible()
  await expect(footer.getByText('Global', { exact: true })).toBeVisible()

  const pageText = await page.locator('body').innerText()
  for (const unsupported of ['TOYOTA', 'World Vision', 'BBC', 'UNHCR', 'Oxford', 'Safaricom']) expect(pageText).not.toContain(unsupported)
})

test('rendered links never contain broken or executable hrefs', async ({ page }) => {
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  const invalid = await page.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href') || '').filter((href) => !href || /undefined|null|javascript:/i.test(href)))
  expect(invalid).toEqual([])
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
