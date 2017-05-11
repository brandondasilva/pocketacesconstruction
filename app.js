
'use strict';

const express = require('express');
const PORT = process.env.PORT || 3000;

var app = express();
var bodyParser = require('body-parser');

app.set('port', PORT);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var quote = require('./routes/quote');
var instagram = require('./routes/instagram');

app.use('/quote', quote);
app.use('/instagram', instagram);

app.get('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  res.json(200, 'status: ok');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
