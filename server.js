console.log('Is this thing on?');


const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const PORT = 3000;

//should always be above CRUD code
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.post('/users', (req, res) => {
	console.log(req.body);
	// if this does not work, remember to save your file after each major change
})

// always keep at bottom
app.listen(PORT, function () {
    console.log(`Server is live! Listening at port ${PORT}`);
})

