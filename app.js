
'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;

var auth = require('http-auth');
var basic = auth.basic({
  realm: "Restricted Access!"
}, function(username, password, callback) {
  callback((username === process.env.AUTH_USER && password === process.env.AUTH_PASS));
});

var app = express();
var bodyParser = require('body-parser');
var helmet = require('helmet');

app.set('port', PORT);

app.use(auth.connect(basic));
var server = require('http').createServer(basic);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

var quote = require('./routes/quote');
var instagram = require('./routes/instagram');

app.use('/quote', quote);
app.use('/instagram', instagram);

app.get('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  res.status(200).send('ok');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
