// imports
const express = require('express')
const router = express.Router()
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy

// include Poll model
const Poll = require('../models/polls.js')

// loads the index file at the site root
router.get('/', (req, res) => {
  if (!req.user) {
    Poll.getPolls((err, polls) => {
      if (err) throw err

      res.render('index', {openPolls: polls, req: req})
    })

  } else {
    Poll.findPollsByCreator(req.user._id, (err, polls) => {
      res.redirect('/u')
    })
  }
})

router.get('/test', (req, res) => {
  Poll.getPolls((err, poll) => {
    console.log("Poll name: " + poll[4].name)
    console.log("Poll: " + poll[4].options)
    console.log(poll[4].options.split(','))
    res.redirect('/')
  })
})

module.exports = router
