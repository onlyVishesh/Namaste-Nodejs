const express = require("express");

const app = express();

// demonstrating how middleware are used to authorize all request to admin routes
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAllUser", (req, res) => {
  res.send("All user data");
});

app.delete("/admin/deleteUser", (req, res) => {
  res.send("user deleted");
});


app.get("/user/login", (req,res)=>{
  res.send("welcome to DevRoot")
})

app.get("/user/getUser",userAuth, (req, res) => {
  res.send("user data");
});

app.delete("/user/deleteUser",userAuth, (req, res) => {
  res.send("user deleted");
});

app.listen(3000, () => {
  console.log("Server is listing on port 3000...");
});
