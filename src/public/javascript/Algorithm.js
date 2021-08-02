function sortTasksByAddedDate(tasks) {
  return tasks.sort((first, second) => {
    return new Date(first.addedOn) - new Date(second.addedOn);
  });
}

function sortTasksByDueDate(tasks) {
  return tasks.sort((first, second) => {
    if(first.dueDate == null) {
      return false;
    } else if(second.dueDate == null) {
      return true;
    }
    return new Date(second.dueDate) - new Date(first.dueDate);
  });
}

function sortTasksByPriority(tasks) {
  return tasks.sort((first, second) => {
    return first.priority == "High" ? true : false;
  });
}

function sortTasksByCategory(tasks) {
  return tasks.sort((first, second) => {

    if(first.category == "") {
      return false;
    } else if(second.category == "") {
      return true;
    }

    return first.category.toLowerCase() < second.category.toLowerCase();
  });
}

export {sortTasksByDueDate, sortTasksByPriority, sortTasksByCategory, sortTasksByAddedDate}
