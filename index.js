// imports
require('dotenv').config()
const express = require('express');
const app = express();
const path = require("path");
const mustacheExpress = require('mustache-express');

// imports written by us
const particlesRoute = require(path.join(__dirname, 'routes/particles'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.set("static", path.join(__dirname, "static"));
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(express.json());
app.engine('mustache', mustacheExpress());

// path for particles related code
app.use('/particles', particlesRoute);

// home view
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "static/html/index.html"));
});

app.listen(
    3000,
    () => console.log(`Listening on port 3000 ... `)
);