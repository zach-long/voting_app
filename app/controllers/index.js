// imports
const express = require('express')
const router = express.Router()

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
    res.redirect('/u')
  }
})

module.exports = router
