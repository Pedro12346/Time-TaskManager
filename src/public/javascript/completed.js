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
})

function filterTasks(keyword) {
  let filteredTasks = algorithm.filterTasks(keyword, tasks);
  UIutils.displayTasks(filteredTasks);
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
