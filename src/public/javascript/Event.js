import {
  getIDFromButton,
  removeActivesFromSortDropdown,
  displayAttachmentInfo,
  hideAttachmentInfo
} from "./UIutils.js"
import ServerRequest from "./ServerRequest.js"

function addChangeDateFormateEvent(){
    $("#date-input").on("click", () => {
      $(".due-date").datepicker({
        format: "dd/mm/yyyy",
      });
    })
}

function addDisableAddButtonIfEmptyEvent() {
  $("#name-input").keyup(() => {
    let isDisabled = true;

    if($("#name-input").val().length > 0) {
      isDisabled = false;
    }

    $("#submit-task-button").attr("disabled", isDisabled);
  })
}

function addCreateTaskButtonEvent(addTask) {
  $("#submit-task-button").on("click", (event) => {
    event.preventDefault();
    addTask();
  })
}

function addDeleteButtonEvent(deleteTask) {
  $(".container").on("click", ".delete-button", (event) => {
    event.preventDefault();
    let taskID = getIDFromButton(event.target);
    deleteTask(taskID);
  })
}

function addStartTrackingEvent(stopTracking, startTracking) {
  $(".container").on("click", ".tracking-button", (event) => {
    event.preventDefault();

    let isBeingTracked = $(event.target).hasClass("tracking");
    let taskID = getIDFromButton(event.target);

    if(isBeingTracked) {
      stopTracking(taskID,  $(event.target));
    } else {
      startTracking(taskID,  $(event.target));
    }
  })
}

function addCompletedTaskEvent(markAsCompleted) {
  //add click event to completed buttton
  $(".container").on("click", ".completed-button", (event) => {
    event.preventDefault();
    let taskID = getIDFromButton(event.target);
    markAsCompleted(taskID);
  })
}

function addUncompletedTaskEvent(markAsUncompleted) {
  $(".container").on("click", ".uncompleted-button", (event) => {
    event.preventDefault();
    let taskID = getIDFromButton(event.target);
    markAsUncompleted(taskID);
  })
}

function addSortDropdownEvents(sortBy) {
  $(".nav-dropdown").on("click", ".dropdown-added", (event) => {
    removeActivesFromSortDropdown();
    $(".dropdown-added").addClass("active");
    sortBy("added");
  })

  $(".nav-dropdown").on("click", ".dropdown-due", (event) => {
    removeActivesFromSortDropdown();
    $(".dropdown-due").addClass("active");
    sortBy("due");
  })

  $(".nav-dropdown").on("click", ".dropdown-priority", (event) => {
    removeActivesFromSortDropdown();
    $(".dropdown-priority").addClass("active");
    sortBy("priority");
  })

  $(".nav-dropdown").on("click", ".dropdown-category", (event) => {
    removeActivesFromSortDropdown();
    $(".dropdown-category").addClass("active");
    sortBy("category");
  })
}

function addSearchInputEvent(filterTasks) {
  $("#search-input").on("keyup", () => {
    filterTasks($("#search-input").val());
  })
}

function addDeleteAttachmentButtonEvent(deleteFile) {
  $(".attachment-delete-button").on("click",(event) => {
    let taskID = $(".attachment-delete-button").attr("data-taskID");
    deleteFile(taskID);
  });
}

function addUploadFileButtonEvent(uploadFile){
  $(".attachment-upload-button").on("click", (event) =>  {
    event.preventDefault();
    let taskID = $(".attachment-upload-button").attr("data-taskID");
    if($("#my-file").val()) {
      uploadFile(taskID);
    } else {

    }
  })
}

function addCloseFileButtonEvent() {
  $(".close-file-modal-button").on("click", (event) => {
    event.preventDefault();
    $("#my-file").val("");
  })
}

function addAttachmentEvents(getFileInfo, uploadFile, deleteFile) {
  $(".container").on("click", ".attachment-button", (event) => {
    event.preventDefault();
    let taskID = getIDFromButton(event.target);
    let fileInfo = getFileInfo(taskID);

    $(".attachment-upload-button").attr("data-taskID", taskID);
    $(".attachment-delete-button").attr("data-taskID", taskID);

    if(fileInfo != null)  {
      displayAttachmentInfo(fileInfo.name, fileInfo.publicURL);
    } else {
      hideAttachmentInfo();
    }
  });
  addUploadFileButtonEvent(uploadFile);
  addDeleteAttachmentButtonEvent(deleteFile);
  addCloseFileButtonEvent();
}

export {
  addSortDropdownEvents,
  addCompletedTaskEvent,
  addUncompletedTaskEvent,
  addStartTrackingEvent,
  addDeleteButtonEvent,
  addCreateTaskButtonEvent,
  addDisableAddButtonIfEmptyEvent,
  addChangeDateFormateEvent,
  addSearchInputEvent,
  addAttachmentEvents
 }
