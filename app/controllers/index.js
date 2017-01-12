// imports
const express = require('express')
const router = express.Router()
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy

// loads the index file at the site root
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router
