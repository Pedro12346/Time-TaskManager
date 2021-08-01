import ServerRequest from "./ServerRequest.js"
import {getFormattedDate, fromSecondsToHMS, getIDFromButton, removeAllCards, removeTaskCard, emptyFields} from "./Utils.js"
let port = "8080";
let startTime, endTime;
let serverRequest = new ServerRequest(port);
$(".a-pending").removeClass("not-active").addClass("active");

$(document).ready(() => {

  retrieveTasks();

  $("#date-input").on("click", () => {
    $(".due-date").datepicker({
      format: "dd/mm/yyyy",
    });
  })

  //disable add button if task field is empty
  $("#name-input").keyup(() => {
    let isDisabled = true;

    if($("#name-input").val().length > 0) {
      isDisabled = false;
    }

    $("#submit-task-button").attr("disabled", isDisabled);
  })

  //add click event to search button
  $("#search-button").on("click", (event) => {
    event.preventDefault()
    let keyword = $("#search-input").val()
    searchTask(keyword)
  })

  //add click event to add task button
  $("#submit-task-button").on("click", (event) => {
    event.preventDefault()
    addTask()
  })

  //add click event to delete button
  $(".container").on("click", ".delete-button", (event) => {
    event.preventDefault()
    let taskID = getIDFromButton(event.target)
    deleteTask(taskID)
  })

  //add click event to start tracking button
  $(".container").on("click", ".tracking-button", (event) => {
    event.preventDefault()

    let isBeingTracked = $(event.target).hasClass("tracking")
    let taskID = getIDFromButton(event.target)

    if(isBeingTracked) {
      stopTracking(taskID,  $(event.target))
    } else {
      startTracking(taskID,  $(event.target))
    }
  })

  //add click event to completed buttton
  $(".container").on("click", ".completed-button", (event) => {
    event.preventDefault()
    let taskID = getIDFromButton(event.target)
    markAsCompleted(taskID);
  })
})


function searchTask(keyword) {

  $.ajax({
    url: "http://localhost:" + port + "/search",
    method: "PUT",
    dataType: "JSON",
    data: {
      keyword: keyword,
      completed: false
    },
    success: (responseJSON) => {
      removeAllCards()
      displayTasks(responseJSON.tasks)
    },
    error: (err) => {
    }
  })
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

  $.ajax({
    url: "http://localhost:" + port + "/update-time-spent",
    method: "PUT",
    dataType: "JSON",
    data: {
      taskID: taskID,
      seconds: seconds
    },
    success: (responseJSON) => {
      $("#time-" + taskID).text("Time spent " + fromSecondsToHMS(responseJSON.timeSpentInSeconds));
    },
    error: (err) => {
      console.log(err);
    }

  })

  //change appereance and class names
  button.removeClass("btn-warning").removeClass("tracking").addClass("btn-primary").addClass("not-tracking");
  button.text("Start tracking");
}

function markAsCompleted(taskID) {
  serverRequest.markTaskAsCompleted(taskID).then((response) => {
    if(response.status == "success") {
      removeTaskCard(taskID);
    } else {
      console.log("Error");
    }
  });
}

/*
Get all pending tasks from db
*/
function retrieveTasks() {
  serverRequest.retrievePendingTasks().then((response) => {
    if(response.status == "success") {
      let tasks = response.body;
      displayTasks(tasks);
      emptyFields();
    } else {
      console.log("Error");
    }
  });
}

function displayTasks(tasks) {
  for(let i = 0; i < tasks.length; i++) {
    let date = getFormattedDate(tasks[i].dueDate);
    addTaskCard(tasks[i]._id, tasks[i].name, tasks[i].description, tasks[i].timeSpentInSeconds, tasks[i].category, tasks[i].priority, date);
  }
}

//delete task from db
function deleteTask(taskID) {
  serverRequest.deleteTask(taskID).then((response) => {
    if(response.status == "success") {
      removeTaskCard(taskID);
      emptyFields();
    } else {
      console.log("Error");
    }
  });
}

/*
Prepend a pending task card in the container
*/
function addTaskCard(taskID, name, description, timeSpent, category, priority, date) {
  let cardDiv =
  "<div class='task-card' id="+ taskID + ">" +
      "<div class='task-header-wrapper'>" +
        "<div class='task-header d-flex'>" +
          "<div class='p-2 task-name'>" + name + "</div>" +
          "<div class='p-2 time-spent' id=time-" + taskID +"> Time spent: " + fromSecondsToHMS(timeSpent) + "</div>" +
          "<button class='btn btn-primary p-2 ml-auto tracking-button card-buttons not-tracking'>Start tracking</button>" +
        "</div>" +

        "<div class='task-body d-flex'>" +
          "<div class='p-2 category-name'>Category: " + category + "</div>"+
          "<div class='p-2 priority'>Priority: " + priority + "</div>" +
          "<div class='p-2  date'>" + "due date: "+ date + "</div>" +
          "<button class='btn btn-danger p-2 ml-auto delete-button card-buttons'>Delete task</button>" +
        "</div>" +

        "<div class='d-flex'>" +
        "<button class='btn btn-secondary btn-sm' type='button' data-toggle='collapse' data-target='#task-"+ taskID + "' aria-expanded='false' aria-controls='task-"+ taskID + "'> Description </button>"+
        "<button class='btn btn-success p-2 ml-auto completed-button card-buttons'>Mark as completed</button>"+
        "</div>" +

        "<div class='collapse' id='task-"+ taskID + "'>" +
          "<div class='card description-body'>" +
            description +
          "</div>" +
        "</div>" +
      "</div>" +
  "</div>"

  $(".container").prepend(cardDiv)
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
      addTaskCard(newTask._id, newTask.name, newTask.description, newTask.timeSpentInSeconds, newTask.category ,newTask.priority, newTask.dueDate);
      emptyFields();
    } else {
      console.log("Error");
    }
  })
}
