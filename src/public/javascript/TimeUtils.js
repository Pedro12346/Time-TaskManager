function getFormattedDate(date) {
  let year = date.substring(0, 4);
  let month = date.substring(5, 7);
  let day = date.substring(8, 10);
  return day + "/" + month + "/" + year;
}

function fromSecondsToHMS(seconds) {
  let hours = Math.floor(seconds / 3600).toString();
  let minutes = Math.floor(seconds % 3600 / 60).toString();
  seconds = Math.floor(seconds % 3600 % 60).toString();

  if(hours.length == 1) {
    hours = "0" + hours;
  }

  if(minutes.length == 1) {
    minutes = "0" + minutes;
  }

  if(seconds.length == 1) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

export {getFormattedDate,
  fromSecondsToHMS}
