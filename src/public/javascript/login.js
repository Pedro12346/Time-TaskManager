import ServerRequest from "./ServerRequest.js"
let port= "8080"
let serverRequest = new ServerRequest(port);

$(document).ready(() => {
  $("#login-button").on("click", (event) => {
    event.preventDefault()
    let email = $("#email-input").val()
    let password = $("#password-input").val()
    login(email, password)
  })
})

function login(email, password) {
  let credentials = {
    email: email,
    password: password
  }
  serverRequest.login(credentials).then((response) => {
    if(response.status == "success") {
      window.location.replace("/pending-tasks");
    } else {
      console.log("Error");
    }
  })
}
