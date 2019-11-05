let express = require("express")
let router = express.Router()

//Get pending tasks
router.get("/pending-tasks", (req, res) => {
  res.render("pending-tasks")
})

module.exports = router
