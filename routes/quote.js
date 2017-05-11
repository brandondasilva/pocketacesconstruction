
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

  console.log(req.body);

  // Configuring the email parameters for composing
  var from_email = new helper.Email('info@pocketacescon.com', "Pocket Aces Construction");
  var to_email = new helper.Email('brandon@bdsdesign.co');
  var user_email = new helper.Email(req.body['email'], req.body['name']);
  var pac_subject = "New quote request from the Pocket Aces Construction website";
  var user_subject = "Pocket Aces Construction - Quote Form Submission Confirmation";

  // Construct email requests to be sent to PAC and a confirmation to the user using custom made templates
  // var request  = composeMail(from_email, pac_subject, to_email, req.body, process.env.QUOTE_PAC_TEMPLATE);
  // var request2 = composeMail(from_email, user_subject, user_email, req.body, process.env.QUOTE_USER_TEMPLATE);

  var PAC_Response, USER_Response;

  // SENDING THE EMAILS
  // PAC Email
  // sg.API(request, function(error, response) {
  //   PAC_Response = response.statusCode;
  //
  //   // Log response
  //   console.log('--PAC EMAIL RESPONSE BEGIN--');
  //   console.log(response.statusCode);
  //   console.log(response.body);
  //   console.log(response.headers);
  //   console.log('--PAC EMAIL RESPONSE END--\n');
  //
  //   res.send(response);
  // });

  // USER Email
  // sg.API(request, function(error, response) {
  //   USER_Response = response.statusCode;
  //
  //   // Log response
  //   console.log('--USER EMAIL RESPONSE BEGIN--');
  //   console.log(response.statusCode);
  //   console.log(response.body);
  //   console.log(response.headers);
  //   console.log('--USER EMAIL RESPONSE END--\n');
  // });

  // HTTP POST to Slack Webhook to post an update on Slack
  // request({
  //   url: process.env.SLACK_WEBHOOK_URL,
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
  //             "title": "PAC Email Status code",
  //             "value": PAC_Response,
  //             "short": true
  //           }, {
  //             "title": "User Confirmation Email Status Code",
  //             "value": USER_Response,
  //             "short": true
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

function composeMail(from_email, subject, to_email, form_data, template_id) {

  var message_body = new helper.Content("text/plain", form_data['message']);

  var mail = new helper.Mail(from_email, subject, to_email, message_body);

  mail.personalizations[0].addSubstitution( new helper.Substitution('-name-', form_data['name']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-email-', form_data['name']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-city-', form_data['name']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-jobtype-', form_data['name']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-budget-', form_data['name']) );
  // Checking if the user submitted a phone number
  if (form_data['phone'] == undefined) {
    mail.personalizations[0].addSubstitution( new helper.Substitution('-phone-', "Not provided" );
  } else {
    mail.personalizations[0].addSubstitution( new helper.Substitution('-phone-', form_data['phone']) );
  }

  mail.setTemplateId(template_id);

  return sg.EmptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
}

module.exports = router;
