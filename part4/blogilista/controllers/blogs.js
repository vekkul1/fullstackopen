const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    response.status(400).end()
  }
  
  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0
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