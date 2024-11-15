const express = require("express");

const app = express();

// Route to fetch user data
app.get("/getUserData", async (req, res, next) => {
  try {
    // Simulate logic to fetch user data (e.g., database call)
    const userData = { name: "Vishesh", email: "vishesh@example.com" }; // Example response
    res.status(200).json(userData);
  } catch (err) {
    // Pass the error to the error-handling middleware
    next(err);
  }
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  // Log the error details
  console.error("Error occurred:", err.message);
  res.status(500).send("Something went wrong. Please try again later.");
});

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
