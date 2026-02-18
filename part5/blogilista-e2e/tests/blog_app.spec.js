const { describe, test, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { exitCode } = require('process')

describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'root',
        name: 'rooter',
        password: 'sekret',
      },
    })
    await page.goto('')
  })
  test('login page is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })
  describe('login', () => {
    test('user cant login with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'salainen')
      await expect(page.getByText('logged in as rooter')).not.toBeVisible()
      await expect(page.getByText('Log in to application')).toBeVisible()
    })
    test('user can login with real credentials', async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
      await expect(page.getByText('logged in as rooter')).toBeVisible()
    })
    describe('after login', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'root', 'sekret')
      })
      test('a blog can be created', async ({ page }) => {
        await createBlog(page, {
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        })
        await expect(
          page
            .locator('div')
            .filter({ hasText: 'First class tests Robert C.' })
            .nth(3),
        ).toBeVisible()
      })
      describe('and multiple blogs are present', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
          })
          await createBlog(page, {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          })
        })
        test('a blog can be liked', async ({ page }) => {
          const oneBlog = page
            .getByRole('listitem')
            .filter({ hasText: 'First class tests' })
          await oneBlog.getByRole('button').click()
          await oneBlog.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('1 like')).toBeVisible()
        })
        test('a blog can be removed', async ({ page }) => {
          const oneBlog = page
            .getByRole('listitem')
            .filter({ hasText: 'Canonical string reduction' })
          await oneBlog.getByRole('button').click()
          page.on('dialog', (dialog) => dialog.accept())
          await oneBlog.getByRole('button', { name: 'remove' }).click()

          expect(oneBlog).not.toBeVisible()
        })
      })
    })
  })
})
