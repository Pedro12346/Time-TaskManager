let express = require("express")
let router = express.Router()
let Task = require("../models/Task.js")
let moment = require("../helpers/moment.js")
let {isAuthenticated} = require("../helpers/auth")

//Get pending tasks view
router.get("/pending-tasks", isAuthenticated, (req, res) => {
  res.render("tasks/pending-tasks")
})

//Get completed tasks view
router.get("/completed-tasks",  isAuthenticated, (req, res) => {
  res.render("tasks/completed")
})

//search tasks by keyword
router.put("/search",  isAuthenticated, async (req, res) => {
  let {keyword, completed} = req.body
  try {
    let tasks = await Task.find({$text: { $search: keyword}, completed: completed, userid: req.user.id})
    return res.status(200).json({tasks: tasks})
  } catch (e) {
    return res.status(404)
  }
})

router.get("/get-pending-tasks",  isAuthenticated, async (req, res) => {
  console.log("get pending tasks")
  try {
    let tasks = await Task.find({completed: false, userid: req.user.id})
    return res.status(200).json({tasks: tasks})
  } catch (e) {
    return res.status(404)
  }
})

router.get("/get-completed-tasks",  isAuthenticated, async (req, res) => {
  try {
    let tasks = await Task.find({completed: true, userid: req.user.id})
    return res.status(200).json({tasks: tasks})
  } catch (e) {
    return res.status(404)
  }
})
//Insert a task
router.post("/insert-task",  isAuthenticated, async (req, res) => {
  console.log("/insert-task")
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
  newTask.userid = req.user.id

  try {
    await newTask.save()
    return res.status(200).json(newTask)
  } catch (e) {
    return res.status(500)
  }
})

//delete task
router.delete("/delete-task/:taskID",  isAuthenticated, async (req, res) => {

  try {
    await Task.findByIdAndDelete(req.params.taskID)
    return res.status(200).json({_id: req.params.taskID})
  } catch (e) {
    return res.status(404)
  }
})

//update time spent
router.put("/update-time-spent",  isAuthenticated, async (req, res) => {

  let {taskID, seconds} = req.body
  try {
    await Task.findOneAndUpdate({_id: taskID, userid: req.user.id}, {$inc: {timeSpentInSeconds: seconds}})
    let updatedTask = await Task.findOne({_id: taskID})
    return res.status(200).json({_id: taskID, timeSpentInSeconds: updatedTask.timeSpentInSeconds})
  } catch(e) {
    return res.status(500)
  }
})

//mark a task as completed
router.put("/complete-task",  isAuthenticated, async (req, res) => {

  let {taskID, completedDate} = req.body

  try {
    await Task.findOneAndUpdate({_id: taskID, userid: req.user.id}, {completed: true, completedDate: completedDate})
    return res.status(200).json({_id: taskID})
  } catch(e) {
    return res.status(500)
  }
})

//mark a task as uncompleted
router.put("/uncomplete-task",  isAuthenticated, async (req, res) => {

  let {taskID} = req.body

  try {
    await Task.findOneAndUpdate({_id: taskID, userid: req.user.id}, {completed: false, completedDate: null})
    return res.status(200).json({_id: taskID})
  } catch(e) {
    return res.status(500)
  }
})

module.exports = router
