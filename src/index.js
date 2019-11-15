let express = require("express")
let path = require("path")
let hbs = require("express-handlebars")
let methodOverride = require("method-override")
let session = require("express-session")
require("dotenv").config()

//Inits
require("./config/database")
let app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  next();
})

let port = "8080"

//Settings
app.set("port", process.env.PORT || port)
app.set("views", path.join(__dirname, "views"))
app.engine(".hbs", hbs( {
  defaultLayout: "main",
  layoutDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"), "partials"),
  extname: ".hbs"
}))

app.set("view engine", ".hbs")

//Middlewares
app.use(express.urlencoded({extended:true}))

app.use(methodOverride("_method"))
app.use(session({
  secret: "s_app",
  resave: true,
  saveUninitialized: true
}))


//Global variables

//Routes
app.use(require("./routes/index"))
app.use(require("./routes/tasks"))

//Static files
app.use(express.static(path.join(__dirname, "public")))


// Init server
app.listen(app.get("port"), () => {
  console.log("listening on port " + app.get("port"))
})
