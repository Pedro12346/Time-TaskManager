let port = "8080"

$(document).ready(() => {
  retrieveTasks()

  //add click event to search button
  $("#search-button").on("click", (event) => {
    event.preventDefault()
    let keyword = $("#search-input").val()
    searchTask(keyword)
  })

  //add click event to delete button
  $(".container").on("click", ".delete-button", (event) => {
    event.preventDefault()
    let taskID = getIDFromButton(event.target)
    deleteTask(taskID)
  })

  //add click event to uncompleted buttton
  $(".container").on("click", ".completed-button", (event) => {
    event.preventDefault()
    let taskID = getIDFromButton(event.target)
    markAsUncompleted(taskID);
  })

})


function searchTask(keyword) {

  $.ajax({
    url: "http://localhost:" + port + "/search",
    method: "PUT",
    dataType: "JSON",
    data: {
      keyword: keyword,
      completed: true
    },
    success: (responseJSON) => {
      removeAllCards()
      displayTasks(responseJSON.tasks)
    },
    error: (err) => {
    }
  })
}


function markAsUncompleted(taskID) {

  $.ajax({
    url: "http://localhost:" + port + "/uncomplete-task",
    method: "PUT",
    dataType: "JSON",
    data: {
      taskID: taskID,
    },
    success: (responseJSON) => {
      removeTaskCard(responseJSON._id)
    },
    error: (err) => {
      console.log(err)
    }

  })
}

//delete task from db
function deleteTask(taskID) {
  $.ajax({
    url: "http://localhost:" + port + "/delete-task/" + taskID,
    method: "DELETE",
    dataType: "JSON",
    success: (responseJSON) => {
      removeTaskCard(responseJSON._id)
    },
    error: (err) => {
      console.log(err)
    }
  })
}


function retrieveTasks() {
  $.ajax({
    url: "http://localhost:" + port + "/get-completed-tasks",
    method: "GET",
    dataType: "JSON",
    success: (responseJSON) => {
      displayTasks(responseJSON.pendingTasks)
    },
    error: (err) => {
      console.log(err)
    }
  })
}


function displayTasks(tasks) {
  for(let i = 0; i < tasks.length; i++) {
    let date = getFormattedDate(tasks[i].completedDate)
    addTaskCard(tasks[i]._id, tasks[i].name, tasks[i].description, tasks[i].timeSpentInSeconds, tasks[i].category, tasks[i].priority, date)
  }
}


function addTaskCard(taskID, name, description, timeSpent, category, priority, date) {
  let cardDiv =
  "<div class='task-card' id="+ taskID + ">" +
      "<div class='task-header-wrapper'>" +
        "<div class='task-header d-flex'>" +
          "<div class='p-2 task-name'>" + name + "</div>" +
          "<div class='p-2 time-spent' id=time-" + taskID +"> Time spent: " + fromSecondsToHMS(timeSpent) + "</div>" +
          "<button class='btn btn-danger p-2 ml-auto delete-button card-buttons'>Delete task</button>" +
        "</div>" +

        "<div class='task-body d-flex'>" +
          "<div class='p-2 category-name'>Category: " + category + "</div>"+
          "<div class='p-2 priority'>Priority: " + priority + "</div>" +
          "<div class='p-2 date-div'>" + "finished date: "+ date + "</div>" +
          "<button class='btn btn-warning p-2 ml-auto completed-button card-buttons'>Mark as uncompleted</button>"+
        "</div>" +

        "<div class='d-flex'>" +
        "<button class='btn btn-secondary btn-sm' type='button' data-toggle='collapse' data-target='#task-"+ taskID + "' aria-expanded='false' aria-controls='task-"+ taskID + "'> Description </button>"+
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
