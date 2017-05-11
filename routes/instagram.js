
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
    },
    live: true
  });

  // var slackResponse = "A new Instagram post has been posted and uploaded to Webflow:\n\n\n";
  // slackResponse += "Name: " + req.body['name'] + "\n\n";
  // slackResponse += "Post Link: " + req.body['link'] + "\n\n";
  // slackResponse += "Image Link: " + req.body['image'] + "\n\n";
  // slackResponse += "This needs to be published to the Webflow CMS";

  // request.post(
  //   'https://hooks.slack.com/services/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',
  //   { json: { "text": slackResponse } },
  //   function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       console.log(body);
  //     }
  //   }
  // )

  request({
    url: "https://hooks.slack.com/services/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",
    method: "POST",
    json: true,
    body: {
      "attachments": [
        {
          "fallback": "A new post from Instagram has been posted to Webflow.",
          "color": "#36a64f",
          "pretext": "A new post from Instagram has been posted to Webflow.",
          "title": "Instagram Post to Webflow",
          "text": "This needs to be published to the Webflow CMS via the Webflow Editor",
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
      console.log(body);
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
  });

  item.then(i => console.log(i));

  res.send(req.body);
});

module.exports = router;


// 58e6d0fa9d08c00e607f27fb

// curl 'https://pocketacesconstruction.herokuapp.com/instagram' \
//   -H "Content-Type: application/json" \
//   -X POST -d '
//     "name": "Exciting blog post title",
//     "slug": "exciting-post-3",
//     "post-link": "https://www.instagram.com/p/BT4NSOZjHyD/",
//     "image-link": "https://scontent.cdninstagram.com/t51.2885-15/e35/p320x320/18382487_1958594714427116_8724567892445626368_n.jpg"
//   '

// curl https://api.webflow.com/collections/5904f80595a2d43d313758fc/items \
//     -H "Authorization: Bearer c3571a7ebfbcbefbfe02346b708be8ef78c5c4fb9782b6eb6a6bbf4481cf929f" \
//     -H 'accept-version: 1.0.0'
//
// c3571a7ebfbcbefbfe02346b708be8ef78c5c4fb9782b6eb6a6bbf4481cf929f

// curl 'https://api.webflow.com/collections/5904f80595a2d43d313758fc/items' \
//   -H "Authorization: Bearer c3571a7ebfbcbefbfe02346b708be8ef78c5c4fb9782b6eb6a6bbf4481cf929f" \
//   -H 'accept-version: 1.0.0' \
  // -H "Content-Type: application/json" \
  // --data-binary $'{
  //     "fields": {
  //       "name": "Exciting blog post title",
  //       "slug": "exciting-post-3",
  //       "_archived": false,
  //       "_draft": false,
  //       "post-link": "https://www.instagram.com/p/BT4NSOZjHyD/",
  //       "image-link": "https://scontent.cdninstagram.com/t51.2885-15/e35/p320x320/18382487_1958594714427116_8724567892445626368_n.jpg"
  //     }
  //   }'
