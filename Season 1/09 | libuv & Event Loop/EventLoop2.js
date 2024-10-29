const fs = require("fs");
const a = 999;

setImmediate(() => console.log("setImmediate"));

Promise.resolve("promise").then(console.log);

fs.readFile("./file.txt", "utf-8", (err, data) => {
  console.log(data);
});

setTimeout(() => console.log("setimeout"), 0);

process.nextTick(() => console.log("Process.nexttick"));

function printA() {
  console.log("a:" + a);
}
printA();
console.log("last line of program");

//output
// a:999
//Last line of program
//process.nexttick
//promise resolved
//settimeout
//setimmediate
//file data
