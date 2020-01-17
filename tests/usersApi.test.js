const faker = require('faker')
const request = require('supertest')

const app = require('../app')
const UserModel = require('../models/users')
const UserService = require('../services/users')
const userService = new UserService()

const deleteUsers = async () => {
  await UserModel.deleteMany({})
}

/* global describe expect it beforeEach afterAll */
describe('User Routes', () => {
  beforeEach(async () => deleteUsers())
  afterAll(async () => deleteUsers())

  describe('POST /api/users', () => {
    it('should return 400: username is required', async (done) => {
      const res = await request(app)
        .post('/api/users')
        .send({})

      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('errors')
      return done()
    })

    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          username: faker.internet.userName(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          biography: faker.random.words(),
          github: faker.internet.url(),
          profilePic: faker.internet.url()
        })

      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('username')
      expect(res.body).toHaveProperty('firstName')
      expect(res.body).toHaveProperty('lastName')
      expect(res.body).toHaveProperty('email')
      expect(res.body).toHaveProperty('biography')
      expect(res.body).toHaveProperty('github')
      expect(res.body).toHaveProperty('profilePic')
    })
  })

  describe('User Routes', () => {
    describe('GET /api/users', () => {
      it('should return an empty array', async () => {
        const res = await request(app)
          .get('/api/users')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveLength(0)
      })

      it('should return 5 items', async () => {
        for (let i = 0; i < 5; i++) {
          const newUser = new UserModel({
            username: faker.internet.userName(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            biography: faker.random.words(),
            github: faker.internet.url(),
            profilePic: faker.internet.url()
          })
          await newUser.save()
        }
        const res = await request(app)
          .get('/api/users')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveLength(5)
      })
    })

    describe('GET /api/users/:username', () => {
      it('should return 404', async () => {
        const res = await request(app)
          .get('/api/users/foo')
        
        expect(res.statusCode).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('User not found')
      })

      it('should return a user', async () => {
        const username = 'foo'
        await userService.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          biography: faker.random.words(),
          github: faker.internet.url(),
          profilePic: faker.internet.url(),
          username
        })

        const res = await request(app)
          .get(`/api/users/${username}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('_id')
        expect(res.body).toHaveProperty('username')
        expect(res.body).toHaveProperty('firstName')
        expect(res.body).toHaveProperty('lastName')
        expect(res.body).toHaveProperty('email')
        expect(res.body).toHaveProperty('profilePic')
        expect(res.body).toHaveProperty('github')
        expect(res.body).toHaveProperty('profilePic')
        expect(res.body.username).toBe(username)
      })
    })

  })
})


