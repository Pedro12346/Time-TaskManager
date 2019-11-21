let port="8080"
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

  $.ajax({
    url: "http://localhost:" + port + "/users/login",
    method: "POST",
    data: credentials,
    success: (responseJSON) => {
      window.location.replace("/pending-tasks")
    },
    error: (err) => {
      console.log(err)
    }
  })
}
