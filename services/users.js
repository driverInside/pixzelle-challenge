/**
 * services/users.js
 */
const UserModel = require('../models/users')

const User = class {
  constructor () {
    this.model = UserModel
  }

  /**
   * create
   *
   * @description Creates a new user
   * @param {object} userData user data
   */
  async create (userData) {
    const newUser = await new UserModel(userData)
      .save()

    return newUser
  }

  /**
   * getAll
   *
   * @description Return all the users
   * @param {object} filter Filter
   * @returns {array} Collection of users
   */
  async getAll (filter = {}) {
    const users = await this.model.find({})
    return users
  }

  /**
   * getByUsername
   *
   * @description Get an user by username.
   * @param {string} username User username
   * @returns {object} The user with the username.
   */
  async getByUsername (username) {
    const user = this.model.findOne({ username })
    return user
  }
}

module.exports = User
