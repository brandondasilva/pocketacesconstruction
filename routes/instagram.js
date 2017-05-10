
'use strict';

var express = require('express');
var router = express.Router();

const Webflow = require('webflow-api')
const webflow = new Webflow({ token: process.env.WEBFLOW_TOKEN })

webflow.info()
  .then(info => console.log(info))

router.get ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('API v1 GET: Hello World!');
});

router.post ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  res.send(req.body);
});

module.exports = router;
