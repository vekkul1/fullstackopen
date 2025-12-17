const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 
    ? 0 
    : blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
  const result = blogs.toSorted((blog1, blog2) => blog2.likes - blog1.likes)
  return result.length === 0 
    ? {}
    : result[0]
}

const mostBlogs = (blogs) => {
  const result = _.countBy(blogs, "author")
  const resultArray = _.flatMap(result, (value, key) => {
    return [[key, value]]
  })
  const biggest = resultArray.toSorted((a, b) => b[1]- a[1])[0]
  return resultArray.length === 0
    ? {}
    : { author: biggest[0], blogs: biggest[1],}
}

module.exports = { 
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
} 