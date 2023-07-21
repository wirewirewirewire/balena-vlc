const util = require("util");
var path = require("path");
var fs = require("fs");

let debug = false;
const UNIPI_IP = "192.168.100.66";

const http = require("http");
const { WebSocketServer } = require("ws");
const { v4 } = require("uuid");
const inquirer = require("inquirer");
var EventEmitter = require("events").EventEmitter;
var theEvent = new EventEmitter();

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

// I'm maintaining all active connections in this object
const clients = {};

const questions = [
  {
    type: "input",
    name: "key",
    message: "Enter a key",
  },
];

function getAnswers() {
  return inquirer.prompt(questions).then((answers) => {
    theEvent.emit("validationDone", answers);
    return getAnswers();
  });
}

getAnswers()
  .then(console.log)
  .catch((error) => {});

// A new client connection request received
wsServer.on("connection", function (connection) {
  theEvent.on("validationDone", function (validationResult) {
    connection.send(
      JSON.stringify({ type: "keypress", userId, ...validationResult })
    );

    console.log("validation result is " + validationResult);
  });

  connection.on('message', function message(data) {
    console.log('received: %s', data);
  });
  

  const userId = v4();
  console.log(`Recieved a new connection.`);

  connection.send(JSON.stringify({ type: "userId", userId }));

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);
});

const port = 8007;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});




delay = async (time) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(resolve(true), time);
  });
};

test = async () => {
console.log("[SYSTEM] start");
};




if (process.argv.indexOf("-d") > -1) {
  console.log("[START] -d startup with debug");
  debug = true;
}

if (debug) {
  process.argv.forEach(function (val, index, array) {
    console.log(index + ": " + val);
  });
}

/*

if (process.argv.indexOf("-a") > -1) {
  let index = process.argv.indexOf("-a");
  analogTestValue = process.argv[index + 1];
  console.log("[START] -a analog value set: " + analogTestValue);
}
*/


test();

process.on("SIGINT", (_) => {
  console.log("SIGINT");
  process.exit(0);
});
