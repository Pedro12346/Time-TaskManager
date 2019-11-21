let passport = require("passport")
let LocalStrategy = require("passport-local").Strategy
let User = require("../models/User")

passport.use(new LocalStrategy({
  usernameField: "email",

}, async (email, password, done) => {


  try{
    let user = await User.findOne({email: email})

    if(!user === null) {
      return done(null, false, {message: "User not found"})
    }

    try{
      let match = await user.matchPassword(password)

      if(match) {
        return done(null, user)
      }
      return done(null,false, {message: "Incorrect password"})
    } catch(e) {}
  } catch(e) {}

}))


passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})
