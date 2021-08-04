import ServerRequest from "./ServerRequest.js"
import * as UIutils from "./UIutils.js"
import * as timeUtils from "./TimeUtils.js"
import * as algorithm from "./Algorithm.js"
import * as events from "./Event.js"

let port = "8080"
let serverRequest = new ServerRequest(port);
let tasks = [];

$(document).ready(() => {
  $(".a-completed").removeClass("not-active").addClass("active");
  $(".dropdown-added").addClass("active");

  retrieveTasks();

  events.addSearchInputEvent(filterTasks);
  events.addDeleteButtonEvent(deleteTask);
  events.addUncompletedTaskEvent(markAsUncompleted)
  events.addSortDropdownEvents(sortBy);
  events.addAttachmentEvents(getFileInfo, uploadFile, deleteFile);
})

function filterTasks(keyword) {
  let filteredTasks = algorithm.filterTasks(keyword, tasks);
  UIutils.displayTasks(filteredTasks, "completed");
}

function markAsUncompleted(taskID) {
  serverRequest.markTaskAsUncompleted(taskID).then((response) => {
    if(response.status == "success") {
      UIutils.removeTaskCard(taskID);
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
    } else {
      console.log("Error");
    }
  });
}


function retrieveTasks() {
  serverRequest.retrieveCompletedTasks().then((response) => {
    if(response.status == "success") {
      tasks = response.body;
      UIutils.displayTasks(tasks, "completed");
    } else {
      console.log("Error")
    }
  });
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
  UIUtils.displayTasks(sortedTasks, "completed");
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
