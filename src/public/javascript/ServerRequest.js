class ServerRequest {

  constructor(port) {
    this.port = port;
  }

  async retrieveCompletedTasks() {
    let response = {};
    let tasks;
    await $.ajax({
      url: "http://localhost:" + this.port + "/get-completed-tasks",
      method: "GET",
      dataType: "JSON",
      success: (responseJSON) => {
        response.status = "success";
        response.body = responseJSON.tasks;
      },
      error: (err) => {
        console.log(err);
        response.status = "error";
      }
    })
    return response;
  }

  async retrievePendingTasks() {
    let response = {};
    let tasks;
    await $.ajax({
      url: "http://localhost:" + this.port + "/get-pending-tasks",
      method: "GET",
      dataType: "JSON",
      success: (responseJSON) => {
        response.status = "success";
        response.body = responseJSON.tasks;
      },
      error: (err) => {
        console.log(err)
        response.status = "error";
      }
    })

    return response;
  }

  async addTask(task) {
    let response = {};
    await $.ajax({
      url: "http://localhost:" + this.port + "/insert-task",
      method: "POST",
      dataType: "JSON",
      data: task,
      success: (responseJSON) => {
        response.status = "success";
        response.body = responseJSON;
      },
      error: (err) => {
        console.log(err);
        response.status = "error";
      }
    })

    return response;
  }

  async deleteTask(taskID) {
    let response = {};

    await $.ajax({
      url: "http://localhost:" + this.port + "/delete-task/" + taskID,
      method: "DELETE",
      dataType: "JSON",
      success: (responseJSON) => {
        response.status = "success";
      },
      error: (err) => {
        console.log(err)
        response.status = "error";
      }
    })
    return response;
  }

  async markTaskAsCompleted(taskID) {
    let now = Date.now();
    let response = {};
    await $.ajax({
      url: "http://localhost:" + this.port + "/complete-task",
      method: "PUT",
      dataType: "JSON",
      data: {
        taskID: taskID,
        completedDate: now
      },
      success: (responseJSON) => {
        response.status = "success";
      },
      error: (err) => {
        console.log(err);
        response.status = "error";
      }
    })

    return response;
  }

  async markTaskAsUncompleted(taskID) {
    let completed = true;
    let response = {};
    await $.ajax({
      url: "http://localhost:" + this.port + "/uncomplete-task",
      method: "PUT",
      dataType: "JSON",
      data: {
        taskID: taskID,
      },
      success: (responseJSON) => {
        response.status = "success";
      },
      error: (err) => {
        console.log(err);
        response.status = "error";
      }

    })

    return response;
  }

  async login(credentials) {
    let completed = undefined;
    let response = {};
    await $.ajax({
      url: "http://localhost:" + this.port + "/users/login",
      method: "POST",
      data: credentials,
      success: (responseJSON) => {
        response.status = "success";
      },
      error: (err) => {
        console.log(err)
        response.status = "error";
      }
    })
    return response;
  }

  async register(user) {
    let completed = undefined;
    let response = {};
    await $.ajax({
      url: "http://localhost:" + this.port + "/users/signup",
      method: "POST",
      dataType: "JSON",
      data: user,
      success: (responseJSON) => {
        response.status = "success";
        completed = true;
      },
      error: (err) => {
        response.status = "error";
        console.log(err);
      }
    });
    return response;
  }
}

export default ServerRequest
