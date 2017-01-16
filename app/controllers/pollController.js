// imports
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// import models
const Poll = require('../models/polls.js')

// method for me during development to clean up
// remove this before prod
router.get('/drop', (req, res) => {
  mongoose.connection.db.dropDatabase()
  res.redirect('/')
})

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
router.get('/:pollID', (req, res) => {
  if (req.user) {
    let pollid = req.params.pollID
    res.locals.pollid = pollid
    res.render('polls')

  } else {
    res.redirect('/')
  }
})

// saves poll to the DB
router.post('/:pollID', (req, res) => {
  if (req.user) {

    // validate poll integrity
    req.checkBody('name', 'You must enter a name').notEmpty()

    // handles logic based on validation
    if (!req.validationErrors()) {
      // instantiate a Poll, save to DB
      var newPoll = new Poll({
        creator: req.user._id,
        pollid: req.params.pollID,
        name: req.body.name
      })
      /* set the poll 'options' to an array of objects,
         every object has a 'choice' and 'votes' value */
      // init array to hold any number of options
      let tempArray = req.body.option
      // create an object from the temp array and add it to 'options'
      for (let i = 0; i < tempArray.length; i++) {
        let pollOptions = {choice: tempArray[i], votes: 0}
        newPoll.options[i] = pollOptions
      }

      // create a Poll with function from the Model file
      Poll.createPoll(newPoll, (err, poll) => {
        if (err) throw err
        console.log("Created poll '" + poll + "'.")

        Poll.setOwner(req.user, poll, (err, owner) => {
          if (err) throw err
          console.log("Set " + owner + "to be the owner of " + newPoll)

        })
      })

      // display a success message and go to root
      req.flash('success_msg', 'Poll created successfully!')
      res.redirect('/')
    } else {
      // render homepage with error message
      console.log(req.validationErrors)
      res.render('profile')
    }

  } else {
    res.redirect('/')
  }
})

// handle request for unauthenticated user to vote in a poll
router.get('/vote/:pollID', (req, res) => {
  Poll.getPollByPollID(req.params.pollID, (err, thePoll) => {
    if (err) throw err
    //res.locals.poll = thePoll
    res.render('vote', {poll: thePoll})
  })
})

// applies the users vote and saves to DB
router.post('/vote/:pollID', (req, res) => {
  // get value from button clicked
  let voteValue = Object.keys(req.body)[0]

  // get the poll
  Poll.getPollByPollID(req.params.pollID, (err, thePoll) => {
    if (err) throw err

    // increase the vote count
    Poll.registerVote(thePoll, voteValue, (err, updatedPoll) => {
      if (err) throw err

      // update poll in DB
      Poll.updatePoll(updatedPoll, (err, savedPoll) => {
        if (err) throw err

        // redirect to results view to display data
        res.redirect('/poll/results/' + req.params.pollID)
      })
    })
  })
})

// render the page for poll results
router.get('/results/:pollID', (req, res) => {
  Poll.getPollByPollID(req.params.pollID, (err, thePoll) => {
    if (err) throw err

    res.render('results', {poll: thePoll})
  })
})

// authenticated user can destroy own polls
router.post('/delete/:pollID', (req, res) => {
  if (req.user) {
    // validate that user created the poll

      let thePollID = Object.keys(req.body)[0]
      Poll.findOneAndRemove({ pollid: thePollID }, (err, poll) => {
        if (err) throw err

        let deletedPoll = poll._id
        let userPollRefs = req.user.polls
        for (let i = 0; i < userPollRefs.length; i++) {

          let pollRef = userPollRefs[i]
          if (String(deletedPoll) == String(pollRef)) {
            let index = userPollRefs.indexOf(deletedPoll)
            Poll.updateOwner(req.user._id, req.user.polls, index, deletedPoll, (err, owner) => {

            })
          }

        }
        res.redirect('/u')
      })

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
