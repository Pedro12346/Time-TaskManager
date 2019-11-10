let express = require("express")
let router = express.Router()

//Default page - login page
router.get("/", (req, res) => {
  res.send("Default page")
})

//Sign up route
router.get("/signup", (req, res) => {
  res.send("signup form")
})


module.exports = router
