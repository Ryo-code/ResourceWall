"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookieSession = require('cookie-session')


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(cookieSession({
  name: 'session',
  keys: ['lklkjahsdflkjhasdd', 'lklkjahsdflkjhasdf'],
  maxAge: 60 * 60 * 1000 // 1 hour cookie life
}))

// The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("front-page");
});

app.get("/user", (req, res) =>{
  let user = res.session;
  console.log("*********************************", user);
  res.render("index");
})

app.get("/user/:id", (req, res) => {
  let userid = req.params.id;
  let cards ={};
  knex('cards')
  .select("*")
  .where("user_id", userid)
  .then( (results) => {
    cards = results;
  })
  res.render("index", {cards: cards});
})

// app.post("registration", (req, res) => {
//   res.redirect("/users");
// })

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
