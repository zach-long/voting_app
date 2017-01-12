'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/register', (req, res) => {
  res.redirect('/u/register')
})

router.get('/login', (req, res) => {
  res.redirect('/u/login')
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = router
