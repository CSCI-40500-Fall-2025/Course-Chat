const express = require("express"); // Importing the Express module we installed

const port = 3000;
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello registration");
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
