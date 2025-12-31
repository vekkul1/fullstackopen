const { test, after , beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.listWithMultipleBlogs)
})

describe('/api/blogs GET', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.listWithMultipleBlogs.length)
  })

  test('a specific blog is returned', async () => {
    const response = await api.get('/api/blogs')

    const authors = response.body.map(e => e.author)
    const titles = response.body.map(e => e.title)

    assert.strictEqual(authors.includes('Edsger W. Dijkstra'), true)
    assert.strictEqual(titles.includes('Go To Statement Considered Harmful'), true)
  })

  test('blogs are identified with id field', async () => {
    const blogs = await helper.blogsInDb()

    const ids = blogs.map(b => b.id)
    assert.strictEqual(ids.length, helper.listWithMultipleBlogs.length)
  })

  // test('a specific blog can be viewed', async() => {
  //  const blogsAtTheStart = await helper.blogsInDb()
  //  const blogToView = blogsAtTheStart[0]

  //  const resultBlog = await api
  //    .get(`/api/blogs/${blogToView.id}`)
  //    .expect(200)
  //    .expect('Content-type', /application\/json/)
  //  assert.deepStrictEqual(resultBlog.body, blogToView)
  //})
})

describe('/api/blogs POST', () => {
  test('adding blog adds to the db', async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.listWithMultipleBlogs.length + 1)

    const authors = blogsAtEnd.map(e => e.author)
    const titles = blogsAtEnd.map(e => e.title)
    assert.strictEqual(authors.includes('Robert C. Martin'), true)
    assert.strictEqual(titles.includes('Type wars'), true)
  })

  test('added blog can be found', async() => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C.  Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const findBlog = await Blog.find(newBlog)
    assert.strictEqual(findBlog.length, 1)
  })

  test('adding blog with out likes defaults to 0 likes', async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C.  Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(result.body.likes, 0)

  })

  test('adding blog without url blog cant be added', async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C.  Martin",
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('adding blog without title blog cant be added', async () => {
    const newBlog = {
      author: "Robert C.  Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('/api/blogs DELETE', () => {
  test('deleting deletes actual id', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.listWithMultipleBlogs.length - 1)

    const findBlog = await Blog.find(blogToDelete)
    assert.strictEqual(findBlog.length, 0)
  })

  test('deleting with a fake id', async() => {
    const blogsAtStart = helper.blogsInDb()
    const fakeId = "eeee2b3a1b54a676234deeee"

    await api
      .delete(`/api/blogs/${fakeId}`)
      .expect(404)

    const blogsAtEnd = helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
  })
})

describe('/api/blogs PUT', () => {
  test('editing a blog is saved', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]

    const editedBlog = {
      likes: 10101010
    }

    const result = await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(editedBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.likes, editedBlog.likes)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)

    const findBlog = await Blog.findById(blogToEdit.id)
    assert.deepStrictEqual(result.body, findBlog.toJSON())
  })
  test('editing without title is not saved')
})

after(async () => {
  await mongoose.connection.close()
})