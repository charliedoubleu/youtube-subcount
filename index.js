// imports
const express = require('express');
const app = express();
const path = require("path");

// home view
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/static/index.html"));
});

const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`Listening on port ${port}... `))