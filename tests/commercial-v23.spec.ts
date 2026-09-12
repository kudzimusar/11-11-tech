import { expect, test } from '@playwright/test'

test('corporate closing system matches the approved three-part structure', async ({ page }) => {
  await page.goto('./', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.footer-trust-strip-v23')).toBeVisible()
  await expect(page.locator('.footer-sector-marks-v23 span')).toHaveCount(6)
  await expect(page.getByRole('heading', { name: 'What’s next for your organisation?' })).toBeVisible()
  await expect(page.locator('.footer-cta-v23 > img')).toHaveAttribute('src', /^https:\/\//)
  await expect(page.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible()
  await expect(page.locator('.corporate-footer-locations-v23')).toContainText('Tokyo')
  await expect(page.locator('.corporate-footer-locations-v23')).toContainText('Harare')
  await expect(page.locator('.corporate-footer-locations-v23')).toContainText('Global')

  // The reference image contained recognizable client logos. The production footer must not fabricate those relationships.
  await expect(page.getByText('Toyota', { exact: true })).toHaveCount(0)
  await expect(page.getByText('BBC', { exact: true })).toHaveCount(0)
  await expect(page.getByText('UNHCR', { exact: true })).toHaveCount(0)
})

test('project intake keeps a transparent fallback when the secure endpoint is not configured', async ({ page }) => {
  await page.goto('contact/?capability=ai', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.lead-honeypot-v23')).toHaveCount(1)
  await expect(page.getByText(/safe email fallback/i)).toBeVisible()
})
