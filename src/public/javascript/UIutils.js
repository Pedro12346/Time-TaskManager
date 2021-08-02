import * as timeUtils from "./TimeUtils.js"

function getIDFromButton(button) {
  return $(button).parent().parent().parent().attr("id")
}

function removeAllCards() {
  $(".container").empty()
}

/*
Remove a task card view
*/
function removeTaskCard(taskID) {
  $("#" + taskID).remove()
}

function emptyFields() {
  $("#name-input").val("")
  $("#description-input").val("")
  $("#category-input").val("")
  $("#select-input").val("Low")
  $("#date-input").val("")
}

function removeActivesFromSortDropdown() {
  let sortBy = ["added", "due", "priority", "category"];

  for(let i = 0; i < sortBy.length; i++) {
    $(".dropdown-" + sortBy[i]).removeClass("active");
  }
}

function currentSortInDropdown() {
  let sortBy = ["added", "due", "priority", "category"];

  for(let i = 0; i < sortBy.length; i++) {
    if($(".dropdown-" + sortBy[i]).hasClass("active")) {
      return sortBy[i];
    }
  }
  return "";
}

function addCompletedCard(taskID, name, description, timeSpent, category, priority, date) {
  let cardDiv =
  "<div class='task-card' id="+ taskID + ">" +
      "<div class='task-header-wrapper'>" +
        "<div class='task-header d-flex'>" +
          "<div class='p-2 task-name'>" + name + "</div>" +
          "<div class='p-2 task-description time-spent' id=time-" + taskID +"> Time spent: " + timeUtils.fromSecondsToHMS(timeSpent) + "</div>" +
          "<button class='btn btn-danger p-2 ml-auto delete-button card-buttons'>Delete</button>" +
        "</div>" +

        "<div class='task-body d-flex'>" +
          "<div class='p-2 task-description category-name'>Category: " + category + "</div>"+
          "<div class='p-2 task-description priority'>Priority: " + priority + "</div>" +
          "<div class='p-2 task-description date-div'>" + "Finished date: "+ date + "</div>" +
          "<button class='btn btn-warning p-2 ml-auto uncompleted-button card-buttons'>Mark as uncompleted</button>"+
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

  $(".container").prepend(cardDiv);
}

function addTaskCard(taskID, name, description, timeSpent, category, priority, date) {
  let cardDiv =
  "<div class='task-card' id="+ taskID + ">" +
      "<div class='task-header-wrapper'>" +
        "<div class='task-header d-flex'>" +
          "<div class='p-2 task-name'>" + name + "</div>" +
          "<div class='p-2 task-description time-spent' id=time-" + taskID +"> Time spent: " + timeUtils.fromSecondsToHMS(timeSpent) + "</div>" +
          "<button class='btn btn-primary p-2 ml-auto tracking-button card-buttons not-tracking'>Start tracking</button>" +
        "</div>" +

        "<div class='task-body d-flex'>" +
          "<div class='p-2 task-description category-name'>Category: " + category + "</div>"+
          "<div class='p-2 task-description priority'>Priority: " + priority + "</div>" +
          "<div class='p-2  task-description date'>" + "Due date: "+ date + "</div>" +
          "<button class='btn btn-danger p-2 ml-auto delete-button card-buttons'>Delete</button>" +
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

function displayTasks(tasks, type) {
  removeAllCards();
  for(let i = 0; i < tasks.length; i++) {
    let date = "N/A";
    if(tasks[i].dueDate != null) {
      date = timeUtils.getFormattedDate(tasks[i].dueDate);
    }

    if(tasks[i].category == null) {
      tasks[i].category = "N/A"
    }

    if(type == "tasks") {
      addTaskCard(tasks[i]._id, tasks[i].name, tasks[i].description, tasks[i].timeSpentInSeconds, tasks[i].category, tasks[i].priority, date);
    } else {
      addCompletedCard(tasks[i]._id, tasks[i].name, tasks[i].description, tasks[i].timeSpentInSeconds, tasks[i].category, tasks[i].priority, date)
    }
  }
}

function displaySuccessMessage(message) {
}

export {
  getIDFromButton,
  removeAllCards,
  removeTaskCard,
  emptyFields,
  removeActivesFromSortDropdown,
  currentSortInDropdown,
  displayTasks}
