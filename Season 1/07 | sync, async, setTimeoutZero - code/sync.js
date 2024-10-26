console.log("Synchronous Code");

var a = 1235356954;
var b = 425324146;

function multiply(a, b) {
  const result = a * b;
  return result;
}
var c = multiply(a, b);
console.log("Multiplication of a and b is " + c);
