'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/poll', (req, res) => {
  if (req.user) {
    console.log("User is logged in and can create a poll")
  } else {
    console.log("User cannot create a poll")
  }

  res.redirect('/')
})

module.exports = router
