console.log("SetTimeoutZero demonstration");

var a = 5;
var b = 10;

setTimeout(() => {
  console.log("SetTimeout function after 3 seconds");
}, 3000);

//this function only will be pushed in to the call stack of v8 once its become empty so its doesn't matter its for 0 second or more than that
setTimeout(() => {
  console.log("Call me asap");
}, 0); //Trust issues with the set timeout

function multiply(x, y) {
  const result = x * y;
  return result;
}

const c = multiply(a, b);
console.log("Multiplication answer is : " + c);
