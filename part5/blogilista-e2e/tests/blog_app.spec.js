const { describe, test, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, openBlog } = require('./helper')
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

  test('front page is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'home' })).toBeVisible()
  })

  test('login page opens', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(
      page.getByRole('heading', { name: 'Log in to application' }),
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
  })

  describe('login', () => {
    test('user cant login with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'salainen')
      await expect(page.getByText('create')).not.toBeVisible()
      await expect(page.getByText('Log in to application')).toBeVisible()
    })

    test('user can login with real credential s', async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
      await expect(page.getByText('create')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
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
        beforeEach(async ({ page, request, context }) => {
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

          //const tokenString = await page.evaluate(() => {
          //  return localStorage.getItem('loggedBlogappUser')
          //})
          //const token = JSON.parse(tokenString)
          //await page.request.post('/api/blogs', {
          //  headers: {
          //    Authorization: `bearer ${token.token}`,
          //  },
          //  data: {
          //    title: 'React patterns',
          //    author: 'Michael Chan',
          //    url: 'https://reactpatterns.com/',
          //    likes: 7,
          //  },
          //})
        })
        test('blog page opens', async ({ page }) => {
          await page
            .getByRole('link', { name: 'Canonical string reduction' })
            .click()
          await expect(
            page.getByRole('heading', {
              name: 'Edsger W. Dijkstra: Canonical',
            }),
          ).toBeVisible()
        })

        describe('blog page can be opened', () => {
          test('a blog can be liked', async ({ page }) => {
            await openBlog(page, 'Canonical string reduction')
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('1like')).toBeVisible()
          })

          test('a blog can be removed', async ({ page }) => {
            await openBlog(page, 'Canonical string reduction')
            page.on('dialog', (dialog) => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()
            await expect(
              page.getByRole('button', { name: 'logout' }),
            ).toBeVisible()
            await expect(page.getByRole('link', { name: 'home' })).toBeVisible()
            await expect(
              page.getByRole('link', { name: 'create' }),
            ).toBeVisible()
            await expect(
              page.getByRole('link', { name: 'Canonical string reduction' }),
            ).not.toBeVisible()
          })

          test('only blogs owner can see delete', async ({ page, request }) => {
            await request.post('/api/users', {
              data: {
                username: 'heikki',
                name: 'heikki h.',
                password: 'salainen',
              },
            })
            await page.getByRole('button', { name: 'logout' }).click()
            await expect(
              page.getByRole('link', { name: 'login' }),
            ).toBeVisible()
            await loginWith(page, 'heikki', 'salainen')

            await openBlog(page, 'Canonical string reduction')
            await expect(
              page.getByRole('button', { name: 'remove' }),
            ).not.toBeVisible()
          })

          test('sorted in order of likes', async ({ page }) => {
            expect(page.getByRole('listitem').last()).toContainText(
              'Canonical string reduction',
            )
            await openBlog(page, 'Canonical string reduction')
            await page.getByRole('button', { name: 'like' }).click()
            await page.getByRole('link', { name: 'home' }).click()
            const blogsAtEnd = page.getByRole('listitem')
            await expect(blogsAtEnd.first()).toContainText(
              'Canonical string reduction',
            )
          })
        })
      })
    })
  })
})
