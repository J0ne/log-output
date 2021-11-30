const express = require("express");
const config = require("../config.js");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;

const directory = path.join("/", "usr", "src", "files");
const filePath = path.join(directory, "log.txt");
const filePathPong = path.join(directory, "pong.txt");
const app = express();

const port = process.env.PORT || 3000;
const message = process.env.MESSAGE || "Didn't got any message from env :("; 
let currentStatus;

// app.get("/", (req, res) => {
//   console.log("request... reading file:", filePathPong);
//   fs.readFile(filePathPong, (error, data) => {
//       if(error){
//           console.log('error in reading file', error);
//       }
//       console.log('got file', data);
//       res.send(`${currentStatus}<br/>${data}`);
//   });
// });

app.get("/", (req, res) => {
  const response = axios
    .get("http://pingpong-svc/pingpong")
    .then((response) => {
      console.log('response from "http://pingpong-svc/pingpong', response);
      res.status(200).send(`${message}<br/>${currentStatus}<br/>${response.data}`);
    }).catch(err => console.log('error in fetching pingpong-svc', err));
});

const startWriting = async () => {
  await new Promise((res) => fs.mkdir(directory, (err) => res()));

  setInterval(() => {
    currentStatus = `${new Date().toISOString()} `;
    writeToFile(currentStatus);
  }, 5000);
};

const writeToFile = async (msg) => {
  try {
    await fsPromises.writeFile(filePath, msg);
    console.log(`${message} ${msg} > log.txt`);
  } catch (error) {
    console.log(error);
  }

  //   fs.writeFile(filePath, msg, (err) => {
  //     if (err) return console.error(err);
};

const readLogFile = async () => {
  fsPromises
    .readFile(filePath)
    .then((result) => {
      currentStatus = `${result} ${uuidv4()}`;
      console.log(currentStatus);
    })
    .catch((error) => console.log(error));
};

const startReading = async () => {
  setInterval(() => {
    try {
      readLogFile();
    } catch (error) {
      console.log(error);
    }
  }, 10000);
};

app.listen(port, () => {
  console.log(
    `Log-output app started in ${config.APP_MODE} mode an is listening at http://localhost:${config.PORT}`
  );

  if (config.APP_MODE === "writer") {
    startWriting();
  } else {
    // start reading after 5 sec, then 10 sec interval
    setTimeout(() => {
      startReading();
    }, 5000);
  }
});
