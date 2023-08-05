const util = require("util");
var path = require("path");
var fs = require("fs");
//const spawn = require("child_process").spawn;
const { spawn } = require("child_process");

const env = Object.create(process.env);
env.DISPLAY = ":0";

let debug = false;
var playerRunner = undefined;

console.log("Starting server.js");

let launchVlc = async function () {
  return new Promise(async (resolve, reject) => {
    console.log("Launching player");
    var player = spawn("vlc", ["-f", "--no-osd", "--no-audio", "../test.mp4", "-I", "rc"], { env: env });

    player.stdout.on("data", (data) => {
      console.error(`stdout: ${data}`);
      /*const output = data.toString().trim();
      if (output.startsWith("status change:")) {
        return; // Ignore status change messages
      }
      console.log(`Current time: ${output} seconds`);*/
    });

    player.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    player.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
    resolve(player);
    //return player;
  });
  //return spawn.bind(null, "/usr/bin/cvlc").apply(null, arguments);
};

async function run() {
  setTimeout(() => {
    console.log("Sending get_time_precise");
    playerRunner.stdin.write("get_time\n");
  }, 6000);
  playerRunner = await launchVlc();
}
run();

process.on("SIGINT", (_) => {
  console.log("SIGINT");
  playerRunner.kill();
  process.exit(0);
});
