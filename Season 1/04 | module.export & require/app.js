// const { calculateMultiply } = require("./calulate/multiply");
// const { x, calculateSum } = require("./calulate/sum");
const { calculateMultiply, calculateSum } = require("./calulate/index");
const data = require("./data.json");
// import { calculateSum } from "./sum.js"
var a = 10;
var b = 20;
console.log(a);
calculateSum(a, b);
calculateMultiply(a, b);
console.log(data.name);
console.log(data.city);
// console.log(x)
