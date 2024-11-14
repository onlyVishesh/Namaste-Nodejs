const express = require("express");

const app = express();

// this will match all the http methods like GET, PORT etc on /test so if we need to make same route but preform different methods we have to use GET, POST, DELETE separated

app.use("/test", (req, res) => {
  res.send("This is testing route");
});

// Route to handle only GET requests to /user

app.get("/user", (req, res) => {
  res.send({
    uid: 101,
    fname: "Vishesh",
    lname: "",
  });
});

// Route to handle only POST requests to /user

app.post("/user", (req, res) => {
  console.log("Data have been saved in database");
  res.send("Data successfully saved to database");
});

// how to retrieving query parameters form route handle

app.get("/userData", (req, res) => {
  console.log(req.query);
  res.send(`getting the data of ${JSON.stringify(req.query)}`);
});

// dynamic routing

app.get("/userProfile/:userId/:collageId", (req, res) => {
  console.log(req.params);
  res.send(`showing the profile of ${JSON.stringify(req.params)}`);
});



// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log("Server is listing on port 3000...");
});
