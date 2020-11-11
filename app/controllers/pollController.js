// imports
const express = require('express')
const body = require('express-validator').body
var validationResult = require('express-validator').validationResult
const router = express.Router()

// import models
const Poll = require('../models/polls.js')

// can only be accessed by an authenticated user
/* generates a random Key to function as the poll ID,
   and shifts responsibility to a '/poll/:pollID' GET request */
router.get('/', (req, res) => {
  if (req.user) {
    /*         Not node-esque
       - duplicate prevention is in '/:pollID' GET request
       in the astronomical event a random duplicate is generated

    var pollID
    do {
      pollID = generateRandomNumber()
    } while (pollIDExists(pollID))

    */
    var pollID = generateRandomNumber()
    res.redirect('/poll/' + pollID)

  } else {
    res.redirect('/')
  }
})

// can only be accessed by an authenticated user
/*
   */
router.get('/:pollID', (req, res) => {
  Poll.getPollByPollID(req.params.pollID, (err, thePoll) => {
    if (err) throw err
    if (thePoll === null) {
      if (req.user) {
        let pollid = req.params.pollID
        res.locals.pollid = pollid
        res.render('polls')

      } else {
        res.redirect('/')
      }

    } else {
      res.redirect('/')
    }
  })
})

// saves poll to the DB
router.post('/:pollID',
[
  body('name').trim().escape().notEmpty().withMessage('You must enter a name')
],
(req, res) => {
  Poll.getPollByPollID(req.params.pollID, (err, thePoll) => {
    if (err) throw err

    if (thePoll === null) {
      if (req.user) {

        // set poll privacy level
        let privacyLevel;
        if (req.body.private === 'on') {
          privacyLevel = 'private'
        } else if (req.body.public === 'on') {
          privacyLevel = 'public'
        } else {
          alert('An unknown error has occured')
          return;
        }

        // handles logic based on validation
        let errors = validationResult(req);
        if (errors.isEmpty()) {
          // instantiate a Poll, save to DB
          var newPoll = new Poll({
            creator: req.user._id,
            pollid: req.params.pollID,
            privacy: privacyLevel,
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

            Poll.setOwner(req.user, poll, (err, owner) => {
              if (err) throw err

            })
          })

          // display a success message and go to root
          res.redirect('/')

        } else {
          // render homepage
          res.render('profile')
        }

      } else {
        res.redirect('/')
      }

    } else {
      res.redirect('/')
    }
  })
})

// handle request for unauthenticated user to vote in a poll
router.get('/vote/:pollID', (req, res) => {
  if (!req.cookies[req.params.pollID]) {
    Poll.getPollByPollID(req.params.pollID, (err, thePoll) => {
      if (err) throw err
      res.render('vote', {poll: thePoll, req: req})
    })

  } else {
    res.redirect('/poll/results/' + req.params.pollID)
  }
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
      Poll.updatePollOptions(updatedPoll, (err, savedPoll) => {
        if (err) throw err

        // store cookie to register this user has voted
        res.cookie(req.params.pollID, voteValue, {
          maxAge: 1000 * 60 * 1440, // one day
          httpOnly: true
        })

        // redirect to results view to display data
        res.redirect('/poll/results/' + req.params.pollID)
      })
    })
  })
})

// render the page for poll results
router.get('/results/:pollID', (req, res) => {
  if (req.cookies[req.params.pollID]) {
    // get user Vote value from cookie
    let userVote = req.cookies[req.params.pollID]
    Poll.getPollByPollID(req.params.pollID, (err, thePoll) => {
      if (err) throw err

      res.render('results', {poll: thePoll, vote: userVote, req: req})
    })

  } else {
    res.redirect('/poll/vote/' + req.params.pollID)
  }
})

// return JSON for XMLHttpRequest used to display results
router.get('/results/json/:pollID', (req, res) => {
  Poll.getPollByPollID(req.params.pollID, (err, thePoll) => {
    if (err) throw err

    res.json(thePoll)
  })
})

// authenticated user can destroy own polls
router.post('/delete/:pollID', (req, res) => {
  if (req.user) {
    let thePollID = Object.keys(req.body)[0]

    // query poll twice, bad bad bad, hack
    Poll.getPollByPollID(thePollID, (err, thePoll) => {
      if (String(req.user._id) === String(thePoll.creator)) {

        Poll.findOneAndRemove({ pollid: thePoll.pollid }, (err, poll) => {
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

      // redirect if not the poll owner
      } else {
        res.redirect('/')
      }
    })

  // redirect if not logged in
  } else {
    res.redirect('/')
  }
})

// route for user to edit a poll
router.get('/edit/:pollID', (req, res) => {
  if (req.user) {
    let thePollID = req.params.pollID

    // find the poll to edit
    Poll.getPollByPollID(thePollID, (err, thePoll) => {
      // make sure the poll is being accessed by the creator
      if (String(req.user._id) === String(thePoll.creator)) {
        res.render('polls', {poll: thePoll})

      } else {
        res.redirect('/')
      }
    })

  } else {
    res.redirect('/')
  }
})

// post request to update an edited poll
router.post('/edit/:pollID', (req, res) => {

  let thePollID = req.params.pollID
  Poll.getPollByPollID(thePollID, (err, thePoll) => {
    // set poll privacy level
    let privacyLevel;
    if (req.body.private === 'on') {
      privacyLevel = 'private'
    } else if (req.body.public === 'on') {
      privacyLevel = 'public'
    } else {
      alert('An unknown error has occured')
      return;
    }

    // update poll values
    thePoll.privacy = privacyLevel,
    thePoll.name = req.body.name

    /* set the poll 'options' to an array of objects,
       every object has a 'choice' and 'votes' value */
    // init array to hold any number of options
    let tempArray = req.body.option
    // create an object from the temp array and add it to 'options'
    for (let i = 0; i < tempArray.length; i++) {
      let pollOptions = {choice: tempArray[i], votes: 0}
      thePoll.options[i] = pollOptions
    }

    Poll.updatePoll(thePoll, (err, updatedPoll) => {

      res.redirect('/u')
    })
  })
})

// generates a random number, used as a poll ID
function generateRandomNumber() {
  let randomNumber = Math.floor(Math.random() * 999999).toString()
  return randomNumber
}

/*
function pollIDExists(num) {

}
*/
/*
function exists(num, cb) {
  Poll.getPollByPolID(num, (err, thePoll) => {
    if (err) {
      cb(err, null)
    } else if (thePoll) {
      console.log("poll already exists")
      cb(null, true)
    } else {
      console.log("Poll doesn't exist")
      cb(null, false)
    }
  })
}
*/
module.exports = router
