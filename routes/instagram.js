
'use strict';

var express = require('express');
var request = require('request');
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
    }
  });

  // HTTP POST to Slack Webhook to post an update on Slack
  request({
    url: process.env.SLACK_WEBHOOK_URL,
    method: "POST",
    json: true,
    body: {
      "attachments": [
        {
          "fallback": "A new post from Instagram has been posted to Webflow.",
          "color": "#36a64f",
          "pretext": "A new post from Instagram has been posted to Webflow.",
          "title": "Instagram Post to Webflow",
          "text": "This needs to be published to the Webflow CMS using the Webflow Editor",
          "fields": [
            {
              "title": "Name",
              "value": req.body['name'],
              "short": false
            }, {
              "title": "Post Link",
              "value": req.body['link'],
              "short": false
            }, {
              "title": "Image Link",
              "value": req.body['image'],
              "short": false
            }
          ]
        }
      ]
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
  });

  item.then(i => console.log(i));

  res.send(req.body);
});

module.exports = router;
