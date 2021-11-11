const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;
let currentStatus;

app.get("/", (req, res) => {
  res.send(currentStatus);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);

  setInterval(() => {
    const uid = uuidv4();
    currentStatus = `-> ${new Date().toISOString()} - ${uid}`;
    console.log(currentStatus);
  }, 5000);
});
