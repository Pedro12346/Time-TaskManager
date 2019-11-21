let express = require("express")
let router = express.Router()
let User = require("../models/User")
let passport = require("passport")

//Default page - login page
router.get("/", (req, res) => {
    res.render("users/login", {layout: "users"})
})

//Sign up route
router.get("/signup", (req, res) => {
  res.render("users/signup", {layout: "users"})
})


router.post("/users/login", passport.authenticate("local", {
  successRedirect: "/pending-tasks",
  failureRedirect: "/",
}))


router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

router.post("/users/signup", async (req,res) => {
  let {email, password, confirmPassword} = req.body

  if(email === undefined || email.length == 0) {
    res.status(422).send("Email field is empty")
  }

  if(password === undefined || password.length == 0){
    res.status(422).send("Password field is empty")
  }

  if(confirmPassword === undefined || confirmPassword.length == 0) {
    res.status(422).send("Confirm password field is empty")
  }

  if(password != confirmPassword) {
    res.status(422).send("Password do not match")
  }

  if(password.length <= 5) {
    res.status(422).send("Password must be greater than 5")
  }

  try {
    let user = await User.findOne({email: email})

    if(user != null) {
      res.status(422).send("Email already registered")
    }
  } catch {
    res.status(500)
  }

  try {
    let newUser = new User({email, password})
    newUser.password = await newUser.encryptPassword(password)
    await newUser.save()
    res.status(200).json({message: "user created"})
  } catch {
    res.status(500)
  }
})


module.exports = router
