const express = require("express");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./util/sequelize");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

//import models and database
const User = require("./models/user");
const Resetpassword = require("./models/password");
const Message = require("./models/message");
const Poll = require("./models/poll");

//Model Relation
User.hasMany(Resetpassword);
Resetpassword.belongsTo(User, {constraints: true, onDelete: "CASCADE"});

User.hasMany(Message);
Message.belongsTo(User);

//import routes
const userRouter = require("./routes/user");
const passwordRouter = require("./routes/password");
const messageRouter = require("./routes/message");
const pollRouter = require("./routes/poll");

//route directs
app.use("/", userRouter);
app.use("/", messageRouter);
app.use("/password", passwordRouter);
app.use("/", pollRouter);

//use static files
app.use(express.static(path.join(__dirname, "views")));

sequelize
  .sync()
  .then((result) => {
    server.listen(3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.log("Database Error setting Sequelize", err);
  });

//initialize the socket aka connection event and give socket.id key to user
const users = [];
const parties = [
  {votes: 0, label: "INC"},
  {votes: 0, label: "BJP"},
  {votes: 0, label: "AAP"},
  {votes: 0, label: "RJD"},
];

io.on("connection", (socket) => {
  socket.on("user-joined", (usertoken) => {
    const user = jwt.decode(usertoken);
    users[socket.id] = user;
    socket.broadcast.emit("user-joined-broadcast", user);
  });

  // send-message event and recieve-message broadcast
  socket.on("send-message", (message) => {
    const user = jwt.decode(message.token);
    const userb = users[socket.id];
    const data = {user: user.name, message: message.message};
    socket.broadcast.emit("receive-message", data);
  });

  // user-left event & broadcast it executes automatically when user log out or close the tab, inbuilt socket.io feature
  socket.on("disconnect", () => {
    const user = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit("user-left", user.name);
  });

  // emit the voting stats to all users
  socket.on("vote", (index) => {
    parties[index].votes += 1;
    io.emit("update", index);
  });

  // listent to typing event and broadcast it
  socket.on("typing", (usertoken) => {
    const user = jwt.decode(usertoken);
    const name = user.name;
    socket.broadcast.emit("typing", name);
  });

  // notifications live
  socket.on("send-notification", (message) => {
    const user = jwt.decode(message.token);
    const data = {user: user.name, message: message.message};
    io.emit("new-notification", data);
  });
});
