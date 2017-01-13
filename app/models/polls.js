// imports
const mongoose = require('mongoose')

// define poll
var PollModel = mongoose.Schema({
  pollid: String,
  name: String,
  options: Array
})

// set Poll equal to a reference of the PollModel mongoose schema
var Poll = module.exports = mongoose.model('Poll', PollModel)

// define Poll methods

// Poll method to insert a Poll into the database
module.exports.createPoll = function(newPoll, cb) {
  newPoll.save(cb)
}

// Poll method to get a Poll from the DB with provided pollID
module.exports.getPollByPollID = function(pollID, cb) {
  let query = {pollid: pollID}
  Poll.findOne(query, cb)
}

// Poll method to get all polls from DB
module.exports.getPolls = function(cb) {
  Poll.find({}, cb)
}

// Poll method to save a vote value
module.exports.registerVote = function(voteValue, cb) {

}
