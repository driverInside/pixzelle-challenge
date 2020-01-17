const express = require('express')
const router = express.Router()

const UserService = require('../services/users')
const userService = new UserService()

router
  /* GET users listing. */
  .get('/', async (req, res, next) => {
    try {
      const users = await userService.getAll({})
      res.send(users)
    } catch (e) {
      res.status(500)
      console.error(e)
      res.send({
        message: e.message,
        error: e
      })
    }
  })
  /* POST users */
  .post('/', async (req, res, next) => {
    const body = req.body
    try {
      const newUser = await userService.create(body)
      res.status(201)
      res.send(newUser)
    } catch (e) {
      if (e.name && e.name === 'ValidationError') {
        res.status(400)
        res.send({
          errors: e.errors
        })
      } else {
        console.error(e)
        res.status(500)
        res.send(e.message)
      }
    }
  })

/* GET user by username */
router.get('/:username', async (req, res, next) => {
  const username = req.params.username
  const user = await userService.getByUsername(username)

  if (!user) {
    res.status(404)
    res.send({
      error: 'User not found'
    })
    return
  }
  res.send(user)
})

module.exports = router
