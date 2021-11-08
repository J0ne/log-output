const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;
const randomString = uuidv4();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);

  setInterval(() => {
    console.log(`${new Date().toISOString()} - ${randomString}`);
  }, 5000);
});
