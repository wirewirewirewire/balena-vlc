const util = require("util");
var path = require("path");
var fs = require("fs");
const dbus = require("dbus-native");
const { spawn, exec } = require("child_process");

const getVlcTimeCmd = `DISPLAY=:0 dbus-send --print-reply --session --dest=org.mpris.MediaPlayer2.vlc /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:"org.mpris.MediaPlayer2.Player" string:"Position"`;
const getDbusRunning =
  "DISPLAY=:0 dbus-send --session --dest=org.freedesktop.DBus --type=method_call --print-reply /org/freedesktop/DBus org.freedesktop.DBus.ListNames";
const env = Object.create(process.env);
env.DISPLAY = ":0";

let DEBUG = false;
var playerRunner = undefined;

let vlcPlayFile = async function (file, loop = false, audio = false) {
  var fileName = file;
  playerParams = ["-f", "--no-osd", "--control", "dbus"];
  if (loop) {
    playerParams.push("--loop");
  }
  if (!audio) {
    playerParams.push("--no-audio");
  }
  playerParams.push(fileName);

  return new Promise(async (resolve, reject) => {
    console.log("Launching player");
    var player = spawn("vlc", ["-f", "--no-osd", "--no-audio", "--control", "dbus", fileName], { env: env });

    player.stdout.on("data", (data) => {
      console.error(`stdout: ${data}`);
    });

    player.stderr.on("data", (data) => {
      if (DEBUG) console.error(`stderr: ${data}`);
    });

    player.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
    resolve(player);
  });
};

let vlcGetTime = async function () {
  return new Promise(async (resolve, reject) => {
    console.log("Launching time get");
    exec(getVlcTimeCmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        resolve(false);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        resolve(false);
        return;
      }
      if (DEBUG) console.log(`stdout: ${stdout}`);
      let match = stdout.match(/(\d+)(?![\s\S]*\d)/);
      let lastNumber = match ? match[0] : null;
      lastNumber = Math.floor(lastNumber / 1000);
      resolve(lastNumber);
    });
  });
};

let getDbus = async function () {
  return new Promise(async (resolve, reject) => {
    console.log("Launching time get");

    exec(getDbusRunning, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
    resolve();
  });
};

let getDbusAddress = async function () {
  return new Promise(async (resolve, reject) => {
    console.log("Launching time get");

    exec("dbus-daemon --session --fork --print-address", (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        resolve(false);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        resolve(false);
        return;
      }
      resolve(stdout);
    });
  });
};

async function run() {
  playerRunner = await vlcPlayFile("../test.mp4");

  setTimeout(async () => {
    var time = await vlcGetTime();
    console.log("VLC Player Time: " + time);
  }, 5550);
}

console.log("Starting server.js");
run();

process.on("SIGINT", (_) => {
  console.log("SIGINT");
  if (playerRunner != undefined) {
    playerRunner.kill();
  }

  process.exit(0);
});
