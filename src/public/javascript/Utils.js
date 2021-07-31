function getFormattedDate(date) {
  let year = date.substring(0, 4)
  let month = date.substring(5, 7)
  let day = date.substring(8, 10)
  return day + "/" + month + "/" + year
}

function fromSecondsToHMS(seconds) {
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor(seconds % 3600 / 60)
  seconds = Math.floor(seconds % 3600 % 60)

  return hours + ":" + minutes + ":" + seconds
}

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

export {getFormattedDate, fromSecondsToHMS, getIDFromButton, removeAllCards, removeTaskCard, emptyFields, }