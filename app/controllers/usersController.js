'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy

 // user model
 const User = require('../models/users.js')
 // passport config
 //const passportConfig = require('../../config/passport.js')

router.get('/', (req, res) => {
  res.render('profile')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/register', (req, res) => {
  // validate user
  req.checkBody('name', 'You must enter a name').notEmpty()
  req.checkBody('email', 'You must enter an email').notEmpty()
  req.checkBody('email', 'You must enter a valid email').isEmail()
  req.checkBody('username', 'You must enter a username').notEmpty()
  req.checkBody('password', 'You must enter a password').notEmpty()
  req.checkBody('password2', 'The passwords you entered do not match').equals(req.body.password)

  if (req.validationErrors()) {
    res.render('register', {errors: req.validationErrors})
  } else {
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })

    User.createUser(newUser, (err, user) => {
      if (err) throw err
      console.log("Created user '" + user + "'.")
    })

    req.flash('success_msg', 'Registration successful!')
    res.redirect('/u/login')
  }
})

passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err
    if (!user) {
      return done(null, false, {message: 'Unknown User'})
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, {message: 'Invalid password'})
      }
    })

  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(err, user)
})

router.post('/login',
passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}, (req, res) => { res.render('/') }))

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = router
