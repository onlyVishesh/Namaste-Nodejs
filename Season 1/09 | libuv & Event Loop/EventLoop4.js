const fs = require("fs");

setImmediate(() => console.log("setimmediate"));
setTimeout(() => console.log("settimeout"));
Promise.resolve("Promise").then(console.log);

fs.readFile("./file.txt", "utf-8", (err, data) => {
  console.log(data);
});

process.nextTick(() => {
  process.nextTick(() => console.log("inner nexttick"));
  console.log("process.nexttick");
});

console.log("last line of program");
