let express = require("express")
let router = express.Router()
let Task = require("../models/Task.js")
let moment = require("../helpers/moment.js")

//Get pending tasks
router.get("/pending-tasks", (req, res) => {
  res.render("tasks/pending-tasks")
})

router.get("/get-pending-tasks", async (req, res) => {

  try {
    let tasks = await Task.find({completed: false})
    return res.status(200).json({pendingTasks: tasks})
  } catch (e) {
    return res.status(404)
  }
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
    return res.status(200).json(newTask)
  } catch (e) {
    return res.status(500)
  }
})

//delete task
router.delete("/delete-task/:taskID", async (req, res) => {

  try {
    await Task.findByIdAndDelete(req.params.taskID)
    return res.status(200).json({taskID: req.params.taskID})
  } catch (e) {
    return res.status(404)
  }
})

//update time spent
router.put("/update-time-spent", async (req, res) => {

  let {taskID, seconds} = req.body

  try {
    await Task.findOneAndUpdate({_id: taskID}, {$inc: {timeSpentInSeconds: seconds}})
    let updatedTask = await Task.findOne({_id: taskID})
    return res.status(200).json({_id: taskID, timeSpentInSeconds: updatedTask.timeSpentInSeconds})
  } catch(e) {
    return res.status(500)
  }
})

module.exports = router
