"use strict";
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//Cargar rutas
const user = require("./routes/UserRoute");
const qr = require("./routes/QRroutes");
//Cargar middelwares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cargar Cores
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});

//Rutas
app.use("/document", (req, resp) => {
  return resp
    .status(200)
    .send(fs.readFileSync("./templates/Indication_page.html", "utf8"));
});
app.use("/api/user", user);
app.use("/api/qr", qr);
//Exportar
module.exports = app;
