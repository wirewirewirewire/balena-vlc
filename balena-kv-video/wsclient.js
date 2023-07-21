const util = require("util");
var path = require("path");
var fs = require("fs");
const { WebSocket } = require("ws");

let debug = false;
const UNIPI_IP = "192.168.188.21";
let commandInput = undefined;
let fadeValue = undefined;

const ws = new WebSocket("ws://" + UNIPI_IP + ":8007");

ws.on("message", function message(data) {
  console.log("Message: " + data);
  //ws.send(JSON.stringify({ command: "lcstart" }));
});

ws.on("open", function open() {
  //ws.send(JSON.stringify({ command: "lcoff" }));
  sendData = process.argv[2];

  if (commandInput != undefined) {
    console.log("Sending: { command: " + commandInput + " }");
    ws.send(JSON.stringify({ command: commandInput }));
  }

  if (fadeValue != undefined) {
    console.log("Sending: { fadeValue: " + fadeValue + " }");
    ws.send(JSON.stringify({ command: "lcstart", value: fadeValue }));
  }

  process.exit(0);
});

if (debug) {
  process.argv.forEach(function (val, index, array) {
    console.log(index + ": " + val);
  });
}

if (process.argv.indexOf("-d") > -1) {
  console.log("[START] -d startup with debug");
  debug = true;
}

if (process.argv.indexOf("-c") > -1) {
  let index = process.argv.indexOf("-c");
  commandInput = process.argv[index + 1];
  console.log("[START] -c command set: " + commandInput);
}

if (process.argv.indexOf("-f") > -1) {
  let index = process.argv.indexOf("-f");
  fadeValue = process.argv[index + 1];
  console.log("[START] -f fade the glass with time: " + fadeValue);
  testRun = true;
}

process.on("SIGINT", (_) => {
  console.log("SIGINT");
  process.exit(0);
});
