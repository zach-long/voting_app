// imports
const express = require('express')
const router = express.Router()

// import Poll model
const Poll = require('../models/polls.js')

// can only be accessed by an authenticated user
/* generates a random Key to function as the poll ID,
   and shifts responsibility to a '/poll/:pollID' GET request */
router.get('/', (req, res) => {
  if (req.user) {
    var pollID
    do {
      pollID = generateRandomNumber()
    } while (pollIDExists(pollID))
    res.redirect('/poll/' + pollID)

  } else {
    res.redirect('/')
  }
})

// can only be accessed by an authenticated user
/*
   */
router.get('/:pollID*', (req, res) => {
  if (req.user) {
    // check if poll exists already
      // display from DB
    res.render('polls')

  } else {
    res.redirect('/')
  }
})

// generates a random number, used as a poll ID
function generateRandomNumber() {
  let randomNumber = Math.floor(Math.random() * 999999).toString()
  return randomNumber
}

// queries the DB to see if a poll with the generated ID exists
function pollIDExists(num) {
  // check db for existing poll ID
    // if exists then return true
  // else
    // return false
}

module.exports = router
