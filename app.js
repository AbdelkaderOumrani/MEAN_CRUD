const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

// Connect To Database
mongoose.Promise = require("bluebird");
mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    promiseLibrary: require("bluebird"),
    // useFindAndModify: false,
  })
  .then(() => console.log(`Connected to database ${config.database}`))
  .catch((err) => console.log(`Database error: ${err}`));

const app = express();

const users = require("./routes/users");
const courses = require("./routes/courses");

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use("/users", users);
app.use("/courses", courses);

// Index Route
app.get("/", (req, res) => {
  res.send("Invalid Endpoint");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start Server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
