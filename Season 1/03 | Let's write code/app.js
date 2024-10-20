// Define a constant
const name = "Vishesh";

// Define two variables 
var a = 20; 
var b = 12; 
var c = a + b; 

// Print to the console.
console.log("User Name:", name);
console.log("Sum of a and b:", c);

// Demonstrate the use of globalThis in Node.js.
// The globalThis object provides access to the global scope, equivalent to 'global' in Node.js.
console.log("GlobalThis Object:", globalThis);

// Check if 'globalThis' is the same as 'global' (Node.js global object).
console.log("Is globalThis the same as global?", globalThis === global);
