const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middlewares').userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1, id: 1})
  
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  if (!request.user) {
    return response.status(401).end()
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: request.user,
  })

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id',  async (request, response) => {
  const toBeDeleted = await Blog.findById(request.params.id)

  if (!toBeDeleted) {
    return response.status(404).end()
  }

  if (!request.token) {
    return response.status(401).json({ error: 'token invalid' }).end()
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken) {
    return response.status(401).json({ error: 'token invalid' }).end()
  }

  if (toBeDeleted.user.toString() === decodedToken.id) {
    await Blog.deleteOne(toBeDeleted)
    return response.status(204).end()
  }
})

blogsRouter.put('/:id', async(request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1, id: 1})
  blog.likes = request.body.likes
  blog.title = request.body.title
  blog.url = request.body.url
  blog.author = request.body.author

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter
