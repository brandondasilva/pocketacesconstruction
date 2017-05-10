
'use strict';

var express = require('express');
var router = express.Router();

const Webflow = require('webflow-api')
const webflow = new Webflow({ token: process.env.WEBFLOW_TOKEN })

router.get ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('API v1 GET: Hello World!');
});

router.post ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  var item = webflow.createItem({
    collectionId: '5904f80595a2d43d313758fc',
    fields: {
      'name': req.body['name'],
      'slug': req.body['slug'],
      '_archived': false,
      '_draft': false,
      'post-link': req.body['link'],
      'image-link': req.body['image']
    },
    live: true
  })

  res.send(req.body);
});

module.exports = router;


// 58e6d0fa9d08c00e607f27fb

// curl https://api.webflow.com/collections/5904f80595a2d43d313758fc/items \
//     -H "Authorization: Bearer c3571a7ebfbcbefbfe02346b708be8ef78c5c4fb9782b6eb6a6bbf4481cf929f" \
//     -H 'accept-version: 1.0.0'
//
// c3571a7ebfbcbefbfe02346b708be8ef78c5c4fb9782b6eb6a6bbf4481cf929f
