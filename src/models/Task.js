let mongoose = require("mongoose")

let taskSchema =  new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  category: {type: String, required: true},
  priority: {type: String, required: true},
  dueDate: {type: Date, default: null},
  timeSpentInSeconds: {type: Number, required: true},
  completed: {type: Boolean, required: true},
  completedDate: {type: Date, default: null}
})


module.exports = mongoose.model("Task" ,taskSchema)
