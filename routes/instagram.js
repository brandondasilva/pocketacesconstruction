
'use strict';

var express = require('express');
var request = require('request');
var router = express.Router();

// Set up and configure Webflow
var Webflow = require('webflow-api')
var webflow = new Webflow({ token: process.env.WEBFLOW_TOKEN })

router.get ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('API v1 GET: Hello World!');
});

router.post ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  // Checking the length of the title to be uploaded to Webflow properly
  if (req.body['name'].length > 256) {
    req.body['name'] = req.body['name'].slice(0, 255);
  }

  // Removing hashtags from title
  var tempName = req.body['name'].split("#");
  req.body['name'] = tempName[0];

  // Create Webflow item to push to the CMS
  var item = webflow.createItem({
    collectionId: process.env.WEBFLOW_COLLECTION_ID,
    fields: {
      'name': req.body['name'],
      'slug': req.body['slug'],
      '_archived': false,
      '_draft': false,
      'post-link': req.body['link'],
      'image-link': req.body['image'],
      'image-2': req.body['image']
    }
  });

  var publish = webflow.publishSite({
    siteId: process.env.WEBFLOW_SITE_ID,
    domains: ['pocketaces.webflow.io', 'www.pocketacescon.com']
  });

  // HTTP POST to Slack Webhook to post an update on Slack
  request({
    url: process.env.SLACK_WEBHOOK_URL,
    method: "POST",
    json: true,
    body: {
      "attachments": [
        {
          "fallback": "A new post from Instagram has been posted on Webflow.",
          "color": "#36a64f",
          "pretext": "A new post from Instagram has been posted on Webflow.",
          "title": "Instagram Post to Webflow",
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

  item.then(i => console.log(i)); // Send to Webflow
  // publish.then(p => console.log(p)); // Publish on webflow

  res.send(req.body);
});

module.exports = router;
