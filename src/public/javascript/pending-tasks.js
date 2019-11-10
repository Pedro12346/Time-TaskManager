$(document).ready(() => {

  $("#date-input").on("click", () => {
    $(".due-date").datepicker({
      format: "dd/mm/yyyy"
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


  $("#submit-task-button").on("click", (event) => {
    event.preventDefault()
    addTask()
  })
})

/*
Prepend a pending task card in the container
*/
function addTaskCard(id, name, description, category, priority, dueDate) {
  let cardDiv =
  "<div class='task-card'>" +
      "<div class='task-header-wrapper'>"+
        "<div class='task-header d-flex'>" +
          "<div class='p-2 bg-info task-name'>" + name + "</div>" +
          "<div class='p-2 bg-warning time-spent'>Time spent</div>" +
          "<button class='btn btn-success p-2 ml-auto tracking-button card-buttons'>Start tracking</button>" +
        "</div>" +

        "<div class='task-body d-flex'>" +
          "<div class='p-2 bg-info task-name'>Category: " + category + "</div>"+
          "<div class='p-2 bg-warning time-spent'>Priority:" + priority + "</div>" +
          "<div class='p-2 bg-danger time-spent'>Due date: 10:12:1998</div>" +
          "<button class='btn btn-danger p-2 ml-auto delete-button card-buttons'>Delete task</button>" +
        "</div>" +

        "<button class='btn btn-link more-info-button' type='button' data-toggle='collapse' data-target='#task-"+ id + "' aria-expanded='false' aria-controls='task-"+ id + "'> Description </button>"+
        "<div class='collapse' id='task-"+ id + "'>" +
          "<div class='card card-body'>" +
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

  let newTask = {
    name: name,
    description: description,
    category: category,
    priority: priority,
    dueDate: dueDate
  }

  $.ajax({
    url: "http://localhost:8080/insert-task",
    method: "POST",
    dataType: "JSON",
    data: newTask,
    success: (responseJSON) => {
      console.log(responseJSON)
      addTaskCard(responseJSON._id, responseJSON.name, responseJSON.description, responseJSON.category ,responseJSON.priority);
    },
    error: (err) => {
      console.log(err)
    }
  })
}
