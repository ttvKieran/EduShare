const express = require('express');
const database = require('./configs/connection_mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

//Socket IO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
//End Socket IO

const routeUser = require('./routes/user/index.route');
const routeAdmin = require('./routes/admin/index.route');
const routeLecturer = require('./routes/lecturer/index.route');
const routeStudent = require('./routes/student/index.route');

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(cors({
  origin: "*",  
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());

database.connect();

routeUser(app);
routeStudent(app);
routeLecturer(app);
routeAdmin(app);

server.listen(PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});