export const getUser = () => {
  const user = window.localStorage.getItem('loggedBlogappUser')
  return user ? user : null
}

export const saveUser = (user) => {
  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
}

export const removeUser = () => {
  window.localStorage.removeItem('loggedBlogappUser')
}
