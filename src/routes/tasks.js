let express = require("express")
let router = express.Router()
let Task = require("../models/Task.js")
let moment = require("../helpers/moment.js")

//Get pending tasks
router.get("/pending-tasks", (req, res) => {
  res.render("tasks/pending-tasks")
})

//Insert a task
router.post("/insert-task", async (req, res) => {

  let {name, description, category, priority, dueDate} = req.body

  //validate task name
  if(!name) {
    return res.status(204).send("Empty task name")
  }

  if(!category) {
    category = null
  }

  dueDate = moment(dueDate, 'DD/MM/YYYY')

  if(dueDate.isValid()) {
    dueDate = dueDate.toDate()
  } else {
    dueDate = null
  }

  timeSpentInSeconds = 0
  completed = false
  completedDate = null

  let newTask = new Task({name, description, category, priority, dueDate, timeSpentInSeconds, completed, completedDate})
  try {
    await newTask.save()
  } catch (e) {
    return res.status(500)
  }

  return res.status(200).json(newTask)
})

module.exports = router
