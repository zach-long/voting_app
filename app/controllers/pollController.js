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

// saves poll to the DB
router.post('/:pollID*', (req, res) => {
  if (req.user) {

    // validate poll integrity
    req.checkBody('name', 'You must enter a name').notEmpty()

    // handles logic based on validation
    if (!req.validationErrors()) {
      // instantiate a Poll, save to DB
      var newPoll = new Poll({
        pollid: req.params.pollID,
        name: req.body.name,
        options: []
      })

      // push options from 'req.body' into 'newPoll' array


      // create a Poll with function from the Model file
      Poll.createPoll(newPoll, (err, poll) => {
        if (err) throw err
        console.log("Created poll '" + poll + "'.")
      })

      // display a success message and go to root
      req.flash('success_msg', 'Poll created successfully!')
      res.redirect('/')
    } else {
      // render homepage with error message
      res.render('profile', {errors: req.validationErrors})
    }

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
