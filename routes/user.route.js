const express = require('express')
const userRoute = express.Router()

// model
let UserModel = require('../models/User')

userRoute.route('/create-user').post((req, res, next) => {
  console.log(req.body)
  UserModel.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

userRoute.route('/').get((req, res, next) => {
  UserModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

userRoute.route('/edit-user/:id').get((req, res, next) => {
  UserModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update
userRoute.route('/update-user/:id').put((req, res, next) => {
  console.log(req.body)
  UserModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
        console.log('User successfully updated!')
      }
    },
  )
})

// Delete
userRoute.route('/delete-user/:id').delete((req, res, next) => {
  
  UserModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
})

module.exports = userRoute
