const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 , id: 1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    response.status(400).end()
  }

  if (!request.token) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user,
  })

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const toBeDeleted = await Blog.findByIdAndDelete(request.params.id)
  if (toBeDeleted) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async(request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (request.body.likes) {
    blog.likes = request.body.likes
  }
  if (request.body.title) {
    blog.title = request.body.title
  }
  if (request.body.url) {
    blog.url = request.body.url
  }
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter