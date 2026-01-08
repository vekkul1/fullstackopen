const { test, after, beforeEach, before, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekretks', 10)
  const user = new User({ username: 'root', name: 'rooter', passwordHash})
  await user.save()
})

describe('/api/users POST success', () => {
  test('creation successful with actual user', async() => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'admin',
      name: 'Admin Superuser',
      password: 'Secret'
    }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(user.username))
  })
})

describe('/api/users POST fails', () => {
  test('creation fails with duplicate username', async() => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'root',
      name: 'Admin Superuser',
      password: 'Secret'
    }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    assert.deepStrictEqual(usersAtEnd, usersAtStart)

    assert(result.body.error.includes(`expected 'username' to be unique`))
  })

  test('creation fails when username too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'ad',
      name: 'Admin Superuser',
      password: 'Secret',
    }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('must be longer than'))

    const usersAtEnd = await helper.usersInDb()
    assert.deepStrictEqual(usersAtStart, usersAtEnd)   
  })

  test('creation fails when password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'admin',
      name: 'Admin Superuser123',
      password: 'Se',
    }

    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('must be longer than'))

    const usersAtEnd = await helper.usersInDb()
    assert.deepStrictEqual(usersAtStart, usersAtEnd)   
  })

  test('creation fails when missing username or password', async() => {
    const usersAtStart = await helper.usersInDb()

    const noUsername = {
      username: '',
      name: 'Admin Superuser',
      password: 'Secret',
    }

    const resultUser = await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const noPassword = {
      username: 'admin',
      name: 'Admin Superuser',
      password: '',
    }

    const resultPass = await api
      .post('/api/users')
      .send(noPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(resultUser.body.error.includes('username or password missing'))
    
    assert(resultPass.body.error.includes('username or password missing'))
   
    const usersAtEnd = await helper.usersInDb()
    assert.deepStrictEqual(usersAtStart, usersAtEnd)
  })
})

after(async () => {
  await mongoose.connection.close()
})
