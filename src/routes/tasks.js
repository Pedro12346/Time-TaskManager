let express = require("express");
let router = express.Router();
let Task = require("../models/Task.js");
let moment = require("../helpers/moment.js");
let {isAuthenticated} = require("../helpers/auth");
let multer  = require('multer');
let upload  = multer({ storage: multer.memoryStorage(), preservePath: true });
var admin = require("firebase-admin");
let bucket = admin.storage().bucket();
let { format } = require("util");

//Get pending tasks view
router.get("/pending-tasks", (req, res) => {
  res.render("tasks/pending-tasks");
})

//Get completed tasks view
router.get("/completed-tasks", (req, res) => {
  res.render("tasks/completed");
})

router.get("/get-pending-tasks",  isAuthenticated, async (req, res) => {
  try {
    let tasks = await Task.find({completed: false, userid: req.user.id});
    return res.status(200).json({tasks: tasks});
  } catch (e) {
    console.log(e);
    return res.status(404);
  }
})

router.get("/get-completed-tasks",  isAuthenticated, async (req, res) => {
  try {
    let tasks = await Task.find({completed: true, userid: req.user.id});
    return res.status(200).json({tasks: tasks});
  } catch (e) {
    console.log(e);
    return res.status(404);
  }
})
//Insert a task
router.post("/insert-task",  isAuthenticated, async (req, res) => {
  let {name, description, category, priority, dueDate} = req.body;

  //validate task name
  if(!name) {
    return res.status(204).send("Empty task name")
  }

  if(!category) {
    category = null;
  }

  dueDate = moment(dueDate, 'DD/MM/YYYY');
  if(dueDate.isValid()) {
    dueDate = dueDate.toDate();
  } else {
    dueDate = null;
  }

  timeSpentInSeconds = 0;
  completed = false;
  completedDate = null;
  let newTask = new Task({name, description, category, priority, dueDate, timeSpentInSeconds, completed, completedDate});
  newTask.userid = req.user.id;
  newTask.addedOn = new Date();
  newTask.fileInfo = null;
  try {
    await newTask.save();
    return res.status(200).json(newTask);
  } catch (e) {
    console.log(e);
    return res.status(500);
  }
})

//delete task
router.delete("/delete-task/:taskID",  isAuthenticated, async (req, res) => {

  try {
    await Task.findByIdAndDelete(req.params.taskID);
    return res.status(200).json({_id: req.params.taskID});
  } catch (e) {
    console.log(e);
    return res.status(404);
  }
})

//update time spent
router.put("/update-time-spent",  isAuthenticated, async (req, res) => {

  let {taskID, seconds} = req.body
  try {
    await Task.findOneAndUpdate({_id: taskID, userid: req.user.id}, {$inc: {timeSpentInSeconds: seconds}});
    let updatedTask = await Task.findOne({_id: taskID});
    return res.status(200).json({_id: taskID, timeSpentInSeconds: updatedTask.timeSpentInSeconds});
  } catch(e) {
    console.log(e);
    return res.status(500);
  }
})

//mark a task as completed
router.put("/complete-task",  isAuthenticated, async (req, res) => {

  let {taskID, completedDate} = req.body;

  try {
    await Task.findOneAndUpdate({_id: taskID, userid: req.user.id}, {completed: true, completedDate: completedDate});
    return res.status(200).json({_id: taskID});
  } catch(e) {
    console.log(e);
    return res.status(500);
  }
})

//mark a task as uncompleted
router.put("/uncomplete-task",  isAuthenticated, async (req, res) => {

  let {taskID} = req.body

  try {
    await Task.findOneAndUpdate({_id: taskID, userid: req.user.id}, {completed: false, completedDate: null});
    return res.status(200).json({_id: taskID});
  } catch(e) {
    console.log(e);
    return res.status(500);
  }
})

router.put("/add-file", isAuthenticated, upload.single("file"), async(req, res) => {

  let {taskID} = req.body;

  let task = await Task.findOne({_id: taskID});
  let fileInfo = task.fileInfo;

  if(fileInfo) {
    try {
      await bucket.file(fileInfo.dbName).delete();
      await Task.findOneAndUpdate({_id: taskID}, {fileInfo: null});
    } catch(e) {
      return res.status(500);
    }
  }

  try {
    if(!req.file) {
      return res.status(500);
    }

    let blob = bucket.file(req.file.originalname);
    blob.name = `${new Date().getTime()}_${blob.name}`;
    let blobStream = blob.createWriteStream({ resumable: false});

    blobStream.on("error", (err) => {
      return res.status(500);
    })

    blobStream.on("finish", async(data) => {
      let publicURL = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
      try {
        await bucket.file(blob.name).makePublic();
      } catch(e) {
        console.log(e);
        return res.status(500);
      }

      try {
        let fileInfo = {
          name: req.file.originalname,
          dbName: blob.name,
          publicURL: publicURL
        }
        await Task.findOneAndUpdate({_id: taskID, userid: req.user.id}, {fileInfo: fileInfo});
        console.log("Success - public URL = ", publicURL);
        return res.status(200).json({fileInfo});
      } catch(e) {
        return res.status(500);
      }

      return res.status(200);
    })

    blobStream.end(req.file.buffer);
  } catch(e){
    return res.status(500);
  }
})

router.delete("/delete-file/:taskID", isAuthenticated, async(req, res) => {

  let taskID = req.params.taskID;
  let task = await Task.findOne({_id: taskID});
  let fileInfo = task.fileInfo;

  if(!fileInfo) {
    return res.status(500);
  }

  try {
    await bucket.file(fileInfo.dbName).delete();
    await Task.findOneAndUpdate({_id: taskID}, {fileInfo: null});
    return res.status(200).json({_id: taskID});
  } catch(e) {
    console.log(e);
    return res.status(500);
  }
})

module.exports = router
