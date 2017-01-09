const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy

module.exports = {

  passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err
      if (!user) {
        return done(null, false, {message: 'Unknown User'})
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'Invalid password'})
        }
      })

    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    done(err, user)
  })

}
