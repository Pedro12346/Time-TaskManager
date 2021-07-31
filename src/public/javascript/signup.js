import ServerRequest from "./ServerRequest.js"
let port= "8080"
let serverRequest = new ServerRequest(port);


$(document).ready(() => {
  $("#create-account-button").on("click", (event) => {
    event.preventDefault()
    let email = $("#email-input").val()
    let password = $("#password-input").val()
    let confirmPassword= $("#confirm-password-input").val()
    register(email, password, confirmPassword)
  })
})

function register(email, password, confirmPassword) {
  let user = {
    email: email,
    password: password,
    confirmPassword: confirmPassword
  }

  serverRequest.register(user).then((response) => {
    if(response.status == "success") {
      displaySuccessRegisterMessage();
    } else {
      console.log("Error");
    }
  })
}

function displaySuccessRegisterMessage() {
  $("h1").text("Congratulations! You're registered")
  $("form").remove()
  $(".card-body").append("<a class='btn btn-primary btn-block' href='/'> Click here to log in</a>")
}
