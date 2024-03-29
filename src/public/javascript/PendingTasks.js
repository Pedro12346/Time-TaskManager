import ServerRequest from "./ServerRequest.js"
import * as UIutils from "./UIutils.js"
import * as timeUtils from "./TimeUtils.js"
import * as algorithm from "./Algorithm.js"
import * as events from "./Event.js"

let port = "8080";
let startTime, endTime;
let serverRequest = new ServerRequest(port);
let tasks = [];

$(document).ready(() => {

  $(".a-pending").removeClass("not-active").addClass("active");
  $(".dropdown-added").addClass("active");

  retrieveTasks();
  events.addSearchInputEvent(filterTasks);
  events.addChangeDateFormateEvent();
  events.addDisableAddButtonIfEmptyEvent();
  events.addCreateTaskButtonEvent(addTask);
  events.addDeleteButtonEvent(deleteTask);
  events.addStartTrackingEvent(stopTracking, startTracking);
  events.addCompletedTaskEvent(markAsCompleted);
  events.addSortDropdownEvents(sortBy);
  events.addAttachmentEvents(getFileInfo, uploadFile, deleteFile);
})

function filterTasks(keyword) {
  let filteredTasks = algorithm.filterTasks(keyword, tasks);
  UIutils.displayTasks(filteredTasks, "tasks");
}

function startTracking(taskID, button) {
  startTime = new Date();
  //change appereance
  button.removeClass("btn-success").removeClass("not-tracking").addClass("btn-warning").addClass("tracking");
  button.text("Stop tracking");
}

function stopTracking(taskID, button) {
  //calculate how much time was spent in this task
  endTime = new Date();
  let difference = endTime - startTime;
  difference /= 1000;
  let seconds = Math.round(difference);

  serverRequest.updateTimeSpent(taskID, seconds).then( (response) => {
    if(response.status == "success") {
      $("#time-" + taskID).text("Time spent " + timeUtils.fromSecondsToHMS(response.body));
    } else {
      console.log("Error");
    }
  })
  button.removeClass("btn-warning").removeClass("tracking").addClass("btn-primary").addClass("not-tracking");
  button.text("Start tracking");
}

function markAsCompleted(taskID) {
  serverRequest.markTaskAsCompleted(taskID).then((response) => {
    if(response.status == "success") {
      UIutils.removeTaskCard(taskID);
    } else {
      console.log("Error");
    }
  });
}

function retrieveTasks() {
  serverRequest.retrievePendingTasks().then((response) => {
    if(response.status == "success") {
      tasks = response.body;
      UIutils.displayTasks(tasks, "tasks");
      UIutils.emptyFields();
    } else {
      console.log("Error");
    }
  });
}

//delete task from db
function deleteTask(taskID) {
  serverRequest.deleteTask(taskID).then((response) => {
    if(response.status == "success") {
      UIutils.removeTaskCard(taskID);
      UIutils.emptyFields();
    } else {
      console.log("Error");
    }
  });
}

//send task to DB
function addTask() {
  let name = $("#name-input").val()
  let description = $("#description-input").val()
  let category = $("#category-input").val()
  let priority = $("#select-input").val()
  let dueDate = $("#date-input").val()

  let task = {
    name: name,
    description: description,
    category: category,
    priority: priority,
    dueDate: dueDate
  }

  serverRequest.addTask(task).then((response) => {
    if(response.status == "success") {
      let newTask = response.body;
      tasks.push(newTask);
      sortBy(UIutils.currentSortInDropdown());
      UIutils.emptyFields();
    } else {
      console.log("Error");
    }
  })
}

function sortBy(sort) {
  let sortedTasks = tasks;

  if(sort == "added") {
    sortedTasks = algorithm.sortTasksByAddedDate(tasks);
  } else if(sort == "due") {
    sortedTasks = algorithm.sortTasksByDueDate(tasks);
  } else if(sort == "priority") {
    sortedTasks = algorithm.sortTasksByPriority(tasks);
  } else if(sort == "category") {
    sortedTasks = algorithm.sortTasksByCategory(tasks);
  }
  UIutils.displayTasks(sortedTasks, "tasks");
}

function getFileInfo(taskID) {
  let fileInfo = null;

  for(let i = 0; i < tasks.length; i++)  {
    if(tasks[i]._id == taskID) {
      return tasks[i].fileInfo;
    }
  }
  return fileInfo;
}

function addFileInfo(taskID, fileInfo) {
  for(let i = 0; i < tasks.length; i++)  {
    if(tasks[i]._id == taskID) {
      tasks[i].fileInfo = fileInfo;
    }
  }
}

function removeFileInfo(taskID) {
  for(let i = 0; i < tasks.length; i++)  {
    if(tasks[i]._id == taskID) {
      tasks[i].fileInfo = null;
    }
  }
}

function uploadFile(taskID) {
  let file = $('#my-file').prop('files')[0];
  serverRequest.uploadFile(taskID, file).then( (response) => {
    addFileInfo(taskID, response.body.fileInfo);
    UIutils.displayAttachmentInfo(response.body.fileInfo.name, response.body.fileInfo.publicURL);
  });
}

function deleteFile(taskID) {
  serverRequest.deleteFile(taskID).then( (response) => {
    removeFileInfo(response.body._id);
    UIutils.hideAttachmentInfo();
  });
}
