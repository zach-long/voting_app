// imports
const express = require('express')
const router = express.Router()
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy

// import User model
const User = require('../models/users.js')

// set user root path to '/u'
router.get('/', (req, res) => {
  if (req.user) {
    res.render('profile')
  } else {
    res.redirect('/')
  }
})

// handle a a POST request to register a user
router.post('/register', (req, res) => {
  // validate user
  req.checkBody('name', 'You must enter a name').notEmpty()
  req.checkBody('email', 'You must enter an email').notEmpty()
  req.checkBody('email', 'You must enter a valid email').isEmail()
  req.checkBody('username', 'You must enter a username').notEmpty()
  req.checkBody('password', 'You must enter a password').notEmpty()
  req.checkBody('password2', 'The passwords you entered do not match').equals(req.body.password)

  // handles logic based on validation
  if (!req.validationErrors()) {
    // instantiate a User
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })

    // create a User with function from the Model file
    User.createUser(newUser, (err, user) => {
      if (err) throw err
      console.log("Created user '" + user + "'.")
    })

    // display a success message and go to root
    req.flash('success_msg', 'Registration successful!')
    res.redirect('/')
  } else {
    // render homepage with errors display
    res.render('index', {errors: req.validationErrors})
  }
})

// defines the local strategy used for user authentication
passport.use(new LocalStrategy((username, password, done) => {
  // check the database for the username
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err
    if (!user) {
      return done(null, false, {message: 'Unknown User'})
    }

    // see if provided password matches the username
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err
      // if password and username match then return the user object
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, {message: 'Invalid password'})
      }
    })

  })
}))

// used by passport to maintain session authentication state
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// used by passport to maintain session authentication state
passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user)
  })
})

// handles a POST request to log in
router.post('/login',
passport.authenticate('local', {
  successRedirect: '/u',
  failureRedirect: '/'
}))

// logs the user out
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
