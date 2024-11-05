//http server
const http = require("node:http");
const port = 999;
const server = http.createServer(function (req, res) {
  if (req.url === "/getSecretData") {
    res.end("You are seeing a secret message");
  }
  res.end("server Created");
});

server.listen(port, () => {
  console.log("Server running on port " + port);
});
