let port = "8080"

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

  $.ajax({
    url: "http://localhost:" + port + "/users/signup",
    method: "POST",
    dataType: "JSON",
    data: user,
    success: (responseJSON) => {
      displaySuccessRegisterMessage()
    },
    error: (err) => {
      console.log(err)
    }
  })
}

function displaySuccessRegisterMessage() {
  $("h1").text("Congratulations! You're registered")
  $("form").remove()
  $(".card-body").append("<a class='btn btn-primary btn-block' href='/'> Click here to log in</a>")
}
