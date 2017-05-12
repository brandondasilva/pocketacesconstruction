
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

  console.log(req.body.data);

  // Configuring the email parameters for composing
  var from_email = new helper.Email('info@pocketacescon.com', "Pocket Aces Construction");
  var to_email = new helper.Email('brandon@bdsdesign.co');
  var user_email = new helper.Email(req.body.data['email'], req.body.data['name']);
  var pac_subject = "New quote request from the Pocket Aces Construction website";
  var user_subject = "Pocket Aces Construction - Quote Form Submission Confirmation";

  // Construct email requests to be sent to PAC and a confirmation to the user using custom made templates
  var request  = composeMail(from_email, pac_subject, to_email, req.body.data, process.env.QUOTE_PAC_TEMPLATE);
  var request2 = composeMail(from_email, user_subject, user_email, req.body.data, process.env.QUOTE_USER_TEMPLATE);

  var PAC_Response, USER_Response;

  // SENDING THE EMAILS
  // PAC Email
  sg.API(request, function(error, response) {
    PAC_Response = response.statusCode;

    // Log response
    console.log('--PAC EMAIL RESPONSE BEGIN--');
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    console.log('--PAC EMAIL RESPONSE END--\n');
  });

  // USER Email
  sg.API(request2, function(error, response) {
    USER_Response = response.statusCode;

    // Log response
    console.log('--USER EMAIL RESPONSE BEGIN--');
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    console.log('--USER EMAIL RESPONSE END--\n');
  });

  // HTTP POST to Slack Webhook to post an update on Slack
  request({
    url: process.env.SLACK_WEBHOOK_URL,
    method: "POST",
    json: true,
    body: {
      "attachments": [
        {
          "fallback": "A new request for a quote has been submitted.",
          "color": "#36a64f",
          "pretext": "A new request for a quote has been submitted.",
          "title": "New Form Quote Submission",
          "text": "The following are the contents of the form for reference.",
          "fields": [
            {
              "title": "PAC Email Status code",
              "value": PAC_Response,
              "short": true
            }, {
              "title": "User Confirmation Email Status Code",
              "value": USER_Response,
              "short": true
            }, {
              "title": "Name",
              "value": req.body.data['name'],
              "short": true
            }, {
              "title": "Email",
              "value": req.body.data['email'],
              "short": true
            }, {
              "title": "City",
              "value": req.body.data['city'],
              "short": true
            }, {
              "title": "Phone Number",
              "value": (req.body.data['phone'] == undefined) ? 'Not provided' : req.body.data['phone'],
              "short": true
            }, {
              "title": "Job Type",
              "value": req.body.data['jobtype'],
              "short": false
            }, {
              "title": "Budget",
              "value": req.body.data['budget'],
              "short": false
            }, {
              "title": "Message",
              "value": req.body.data['message'],
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

  res.send(req.body);
});

function composeMail(from_email, subject, to_email, form_data, template_id) {

  var mail = new helper.Mail(from_email, subject, to_email, form_data['message']);

  mail.personalizations[0].addSubstitution( new helper.Substitution('-name-', form_data['name']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-email-', form_data['email']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-city-', form_data['city']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-jobtype-', form_data['jobtype']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-budget-', form_data['budget']) );
  mail.personalizations[0].addSubstitution( new helper.Substitution('-message-', form_data['message']) );
  // Checking if the user submitted a phone number
  if (form_data['phone'] == undefined) {
    mail.personalizations[0].addSubstitution( new helper.Substitution('-phone-', "Not provided") );
  } else {
    mail.personalizations[0].addSubstitution( new helper.Substitution('-phone-', form_data['phone']) );
  }

  mail.setTemplateId(template_id);

  return sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
}

module.exports = router;
