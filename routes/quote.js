
'use strict';

var moment = require('moment-timezone');

var express = require('express');
var request = require('request');
var router = express.Router();

// Set up SendGrid
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

router.get ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('API v1 GET: Hello World!');
});

router.post ('/', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  // Configuring the email parameters for composing
  var from_email = new helper.Email('info@pocketacescon.com', "Pocket Aces Construction");
  var to_email = new helper.Email('anthony@pocketacescon.com');
  var user_email = new helper.Email(req.body['email'], req.body['name']);
  var pac_subject = "New quote request from the Pocket Aces Construction website";
  var user_subject = "Pocket Aces Construction - Quote Form Submission Confirmation";

  // Construct email requests to be sent to PAC and a confirmation to the user using custom made templates
  var request1 = composeMail(from_email, pac_subject, to_email, req.body, process.env.QUOTE_PAC_TEMPLATE);
  var request2 = composeMail(from_email, user_subject, user_email, req.body, process.env.QUOTE_USER_TEMPLATE);

  // Add user to email list
  var contactRequest = sg.emptyRequest({
    method: 'POST',
    path: '/v3/contactdb/recipients',
    body: [{
      "email": req.body['email'],
      "first_name": req.body['name'],
      "last_name": ""
    }]
  });

  // Composing the content for the Slack post
  var slackContent = {
    "attachments": [
      {
        "fallback": "A new request for a quote has been submitted.",
        "color": "#36a64f",
        "pretext": "A new request for a quote has been submitted.",
        "title": "New Form Quote Submission",
        "text": "The following are the contents of the form for reference.",
        "fields": [
          {
            "title": "Name",
            "value": req.body['name'],
            "short": true
          }, {
            "title": "Email",
            "value": req.body['email'],
            "short": true
          }, {
            "title": "City",
            "value": req.body['city'],
            "short": true
          }, {
            "title": "Phone Number",
            "value": (req.body['phone'] == undefined) ? 'Not provided' : req.body['phone'],
            "short": true
          }, {
            "title": "Job Type",
            "value": req.body['jobtype'],
            "short": false
          }, {
            "title": "Budget",
            "value": req.body['budget'],
            "short": false
          }, {
            "title": "Message",
            "value": req.body['message'],
            "short": false
          }
        ]
      }
    ]
  }

  // SendGrid API Requests
  // sendgridRequest(request1); // Email to PAC
  // sendgridRequest(request2); // Confirmation email to user
  // sendgridRequest(contactRequest); // Adding user to SendGrid email list

  slackPost(slackContent); // Post to Slack

  res.send(req.body);
});

/**
 * Set up the mail information and template to be requested to be sent through SendGrid
 *
 * @param {String} from_email "From" email
 * @param {String} subject Subject for the email
 * @param {String} to_email "To" email
 * @param {Object} form_data The information submitted on the form
 * @param {String} template_id The ID of the template to use when sending the email
 */
function composeMail(from_email, subject, to_email, form_data, template_id) {

  var content = new helper.Content("text/html", form_data['message']);

  var mail = new helper.Mail(from_email, subject, to_email, content); // Create mail helper

  // Set up personalizations for the email template using the form data from the parameters
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

  mail.setTemplateId(template_id); // Set the Template ID for the email content

  // Return request to send to the SendGrid API
  return sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
}

/**
 * Sends the SendGrid request to the API
 *
 * @param {Object} req The callback to call
 */
function sendgridRequest(req) {

  sg.API(req, function(error, response) {
    // Log response
    console.log('--RESPONSE BEGIN--');
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    console.log('--RESPONSE END--\n');
  });
}

/**
 * Post the content being passed into the function to Slack through the webhook
 *
 * @param {Object} content The content to populate the Slack post
 */
function slackPost(content) {

  request({
    url: process.env.SLACK_WEBHOOK_URL,
    method: "POST",
    json: true,
    body: content,
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
  });
}

module.exports = router;
