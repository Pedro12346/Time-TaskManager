let express = require("express")
let router = express.Router()

//Default page - login page
router.get("/", (req, res) => {
  res.render("users/login", {layout: "users"})
})

//Sign up route
router.get("/signup", (req, res) => {
  res.render("users/signup", {layout: "users"})
})


module.exports = router
