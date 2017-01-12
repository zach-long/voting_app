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

    var pollID
    do {
      pollID = generateRandomNumber()
    } while (pollIDExists(pollID))

    res.redirect('/poll/' + pollID)
  } else {
    console.log("User cannot create a poll")
    res.redirect('/')
  }


})

router.get('/poll/:pollID*', (req, res) => {
  if (req.user) {
    // check if poll exists already
      // display from DB
    res.render('polls')
  } else {
    console.log("You cannot be here")
    res.redirect('/')
  }
})

function generateRandomNumber() {
  let randomNumber = Math.floor(Math.random() * 999999).toString()
  return randomNumber
}

function pollIDExists(num) {
  // check db for existing poll ID
    // if exists then return true
  // else
    // return false
}

module.exports = router
