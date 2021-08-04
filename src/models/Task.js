let mongoose = require("mongoose")

let taskSchema =  new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: false},
  category: {type: String, required: false},
  priority: {type: String, required: true},
  dueDate: {type: Date, default: null},
  timeSpentInSeconds: {type: Number, required: true},
  completed: {type: Boolean, required: true},
  completedDate: {type: Date, default: null},
  addedOn: {type: Date, required: true},
  fileInfo: {type: Object, required: false},
  userid: {type: String, required: true}
})


module.exports = mongoose.model("Task" ,taskSchema)
