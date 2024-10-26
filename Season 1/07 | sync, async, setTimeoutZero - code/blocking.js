const crypto = require("node:crypto");
const { stringify } = require("node:querystring");

console.log("Program started");

//pbkdf2- Password based key derivative function version-2

//This is an synchronous function of pbkdf2 which will block the main thread and these type of synchronous functions does not have any callback functions
crypto.pbkdf2Sync("Vishesh", "salt", 5000000, 20, "sha512");
console.log("Fist synchronous key is generated ");

//Asynchronous function
crypto.pbkdf2("Vishesh", "salt", 50000, 20, "sha512", (err, key) => {
  console.log("Below is the asynchronous key of your password");
  console.log(key);
});

function addition(x, y) {
  const result = x + y;
  return result;
}

var c = addition(5, 10);
console.log("Addition is: " + c);
