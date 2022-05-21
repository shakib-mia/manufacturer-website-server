const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("manufacturer website server is running");
});

app.listen(port, () => {
  console.log("listen on port", port);
});
