import { test, expect } from '@playwright/test'

test.describe('Welcome Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows the app title and game mode buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Monster Deck' })).toBeVisible()
    await expect(page.getByText('The Witcher Old World')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start New Game' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Wild Hunt mode' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Legendary Hunt mode' })).toBeVisible()
  })
})

test.describe('Standard game flow', () => {
  test('Start New Game transitions to the board screen', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Start New Game' }).click()
    // After starting a game the welcome screen heading disappears
    await expect(page.getByRole('heading', { name: 'Monster Deck' })).not.toBeVisible()
  })
})

test.describe('Wild Hunt mode', () => {
  test('Wild Hunt mode button transitions to setup screen', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Wild Hunt mode' }).click()
    // The welcome-screen heading should no longer be visible
    await expect(page.getByRole('heading', { name: 'Monster Deck' })).not.toBeVisible()
  })
})
