/**
 * models/users.js
 *
 * @description Defines user schema
 */
const uniqueValidator = require('mongoose-unique-validator')

// const db = require('./db')
// const Schema = db.Schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    required: [true, 'Username is required']
  },
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    unique: true,
    index: true,
    required: [true, 'Email is required']
  },
  profilePic: { type: String },
  github: { type: String },
  biography: { type: String }
}, {
  versionKey: false,
  timestamps: true
})

userSchema.plugin(uniqueValidator)

const Users = mongoose.model('Users', userSchema, 'Users')

module.exports = Users
