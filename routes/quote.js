
'use strict';

var express = require('express');
var request = require('request');
var router = express.Router();

var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

router.get ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('API v1 GET: Hello World!');
});

router.post ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  var from_email = new helper.Email('info@pocketacescon.com', "Pocket Aces Construction");
  var to_email = new helper.Email('brandon@bdsdesign.co');
  var subject = "New quote request from the Pocket Aces Construction website";

  var mail = new helper.Mail(from_email, subject, to_email, content);


  mail.setTemplateId(process.env.QUOTE_PAC_TEMPLATE);


  var mail2 = new helper.Mail(from_email, subject, to_email, content);


  mail2.setTemplateId(process.env.QUOTE_USER_TEMPLATE);

  // HTTP POST to Slack Webhook to post an update on Slack
  // request({
  //   url: "https://hooks.slack.com/services/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",
  //   method: "POST",
  //   json: true,
  //   body: {
  //     "attachments": [
  //       {
  //         "fallback": "A new post from Instagram has been posted to Webflow.",
  //         "color": "#36a64f",
  //         "pretext": "A new post from Instagram has been posted to Webflow.",
  //         "title": "Instagram Post to Webflow",
  //         "text": "This needs to be published to the Webflow CMS using the Webflow Editor",
  //         "fields": [
  //           {
  //             "title": "Name",
  //             "value": req.body['name'],
  //             "short": false
  //           }, {
  //             "title": "Post Link",
  //             "value": req.body['link'],
  //             "short": false
  //           }, {
  //             "title": "Image Link",
  //             "value": req.body['image'],
  //             "short": false
  //           }
  //         ]
  //       }
  //     ]
  //   }, function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       console.log(body);
  //     }
  //   }
  // });

  res.send(req.body);
});

module.exports = router;
