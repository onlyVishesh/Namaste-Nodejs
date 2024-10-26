const fs = require("fs");
const https = require("https");

console.log("Asynchronous Javascript");

var a = 5;
var b = 10;

fs.readFileSync("./file.txt", "utf8");
console.log("This will execute only after reading the file");

https.get("https://dummyjson.com/products/1", (res) => {
  console.log("data fetch successfully");
});

setTimeout(() => {
  console.log("Execute it after 5 seconds");
}, 5000);

//Synchronous function
//it will block the main thread

//asynchronous functions
fs.readFile("./file.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("Error", err);
    return;
  }
  console.log("file data:" + data);
});

function multiply(x, y) {
  const result = x * y;
  return result;
}

const c = multiply(a, b);
console.log("Multiplication ans is:" + c);
