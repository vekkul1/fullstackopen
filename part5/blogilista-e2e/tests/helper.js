const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('link', { name: 'create' }).click()
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page
    .getByRole('listitem')
    .filter({ hasText: `${blog.title} ${blog.author}` })
    .waitFor()
}

const openBlog = async (page, text) => {
  await page.getByRole('link', { name: text }).click()
}

module.exports = { loginWith, createBlog, openBlog }
