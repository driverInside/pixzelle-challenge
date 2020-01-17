/**
 * users tests
 */
const faker = require('faker')

const UserService = require('../services/users')
const dbHandler = require('./dbHandler')

/* global describe expect it beforeAll beforeEach afterAll */
describe('User services', () => {
  const userService = new UserService()

  it('should define a new service', () => {
    expect(userService).toBeDefined()
  })

  describe('CRUD Users', () => {
    beforeAll(async () => dbHandler.connect())
    beforeEach(async () => dbHandler.clearDatabase())
    afterAll(async() => dbHandler.closeDatabase())

    describe('Create a new user', () => {
      it('should throw an error with two validation messages', async () => {
        const incompleteUserData = {}
        let err
        try {
          await userService.create(incompleteUserData)
        } catch (error) {
          err = error
        }

        expect(err.errors).toHaveProperty('email')
        expect(err.errors).toHaveProperty('username')

        expect(err.errors.email.message).toBe('Email is required')
        expect(err.errors.username.message).toBe('Username is required')
      })

      it('the email must be unique', async () => {
        let err
        const userOneData = {
          email: 'foo@bar.com',
          username: faker.internet.userName(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          biography: faker.random.words(),
          github: faker.internet.url(),
          profilePic: faker.internet.url()
        }

        const userTwoData = {
          email: 'foo@bar.com',
          username: faker.internet.userName(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          biography: faker.random.words(),
          github: faker.internet.url(),
          profilePic: faker.internet.url()
        }

        try {
          await userService.create(userOneData)
          await userService.create(userTwoData)
        } catch (error) {
          err = error
        }

        expect(err.errors).toHaveProperty('email')
        expect(err.errors.email.message).toBe('Error, expected `email` to be unique. Value: `foo@bar.com`')
      })

      it('the username must be unique', async () => {
        let err
        const userOneData = {
          email: faker.internet.email(),
          username: 'foo',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          biography: faker.random.words(),
          github: faker.internet.url(),
          profilePic: faker.internet.url()
        }

        const userTwoData = {
          email: faker.internet.email(),
          username: 'foo',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          biography: faker.random.words(),
          github: faker.internet.url(),
          profilePic: faker.internet.url()
        }

        try {
          await userService.create(userOneData)
          await userService.create(userTwoData)
        } catch (error) {
          err = error
        }

        expect(err.errors).toHaveProperty('username')
        expect(err.errors.username.message).toBe('Error, expected `username` to be unique. Value: `foo`')
      })

      it('create a new user', async () => {
        const validUserData = {
          username: faker.internet.userName(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          biography: faker.random.words(),
          github: faker.internet.url(),
          profilePic: faker.internet.url()
        }
        const newValidUser = await userService.create(validUserData)

        expect(newValidUser).toHaveProperty('_id')
        expect(newValidUser).toHaveProperty('username')
        expect(newValidUser).toHaveProperty('firstName')
        expect(newValidUser).toHaveProperty('lastName')
        expect(newValidUser).toHaveProperty('email')
        expect(newValidUser).toHaveProperty('profilePic')
        expect(newValidUser).toHaveProperty('github')
        expect(newValidUser).toHaveProperty('profilePic')
      })
    })

    describe('Get all the users', () => {
      it('should return an empty array', async () => {
        const users = await userService.getAll()
        expect(users).toHaveLength(0)
      })

      it('should return 5 users', async () => {
        for (let i = 0; i < 5; i++) {
          await userService.create({
            username: faker.internet.userName(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            biography: faker.random.words(),
            github: faker.internet.url(),
            profilePic: faker.internet.url()
          })
        }
        const users = await userService.getAll()
        expect(users).toHaveLength(5)
      })
    })

    describe('Get by username', () => {
      it('should return null', async () => {
        const notFoundUser = await userService.getByUsername('foo')
        expect(notFoundUser).toBeNull()
      })
      it('should return a user', async () => {
        await userService.create({
          username: 'foo',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          biography: faker.random.words(),
          github: faker.internet.url(),
          profilePic: faker.internet.url()
        })
        const user = await userService.getByUsername('foo')
        expect(user.username).toBe('foo')
        expect(user).toHaveProperty('_id')
        expect(user).toHaveProperty('username')
        expect(user).toHaveProperty('firstName')
        expect(user).toHaveProperty('lastName')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('profilePic')
        expect(user).toHaveProperty('github')
        expect(user).toHaveProperty('profilePic')
      })
    })
  })
})
