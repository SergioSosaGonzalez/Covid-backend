"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 3800;
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/covid_security", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Crear servidor
    app.listen(port, () => {
      console.log("Servidor creado");
    });
  })
  .catch((err) => console.log(err));
