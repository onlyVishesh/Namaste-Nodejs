const express = require("express");
const app = express();

/**
 * Route: /user
 * Handles all requests to /user.
 * Sends a response and logs a message.
 */
app.use("/user", (req, res) => {
  res.send("Route handler 1");
  console.log("Hello from /user route");
});

/**
 * Route: /user1
 * Demonstrates a missing response scenario.
 * Note: This will cause the browser to time out because no response is sent.
 */
app.use("/user1", (req, res) => {
  // Intentionally left without a response
  console.log("No response sent for /user1");
});

/**
 * Route: /user2
 * Demonstrates multiple handlers in a single route.
 * Only the first handler executes because a response is sent.
 */
app.use(
  "/user2",
  (req, res) => {
    console.log("Request log from 1st handler of /user2");
    res.send("1st response from /user2");
  },
  (req, res) => {
    console.log("Request log from 2nd handler of /user2");
    // This handler will never execute because the response is already sent.
    res.send("2nd response from /user2");
  }
);

/**
 * Route: /user3
 * Demonstrates the use of the `next` function to move to the next handler.
 */
app.use(
  "/user3",
  (req, res, next) => {
    console.log("Request log from 1st handler of /user3");
    // Pass control to the next handler
    next();
  },
  (req, res) => {
    console.log("Request log from 2nd handler of /user3");
    res.send("2nd response from /user3");
  }
);

/**
 * Start the server on port 3000.
 */
app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
