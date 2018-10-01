
'use strict';

var moment = require('moment-timezone');

var ejs = require('ejs');
var fs = require('fs');

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

  var templateFile = "";
  var template = "";
  var toEmail = "da.silva.brandon@gmail.com";

  if (req.body['company'] == "pac") {

    templateFile = ejs.compile(fs.readFileSync(__dirname + '/../views/facebook/pac.ejs', 'utf8'));
    template = templateFile({
      name: req.body['name'],
      email: req.body['email'],
      date: req.body['date'],
      phone: req.body['phone'],
      city: req.body['city'],
      jobtype: req.body['jobtype']
    });
    // toEmail = "anthony@pocketacescon.com";

  } else if (req.body['company'] == "pare") {

    templateFile = ejs.compile(fs.readFileSync(__dirname + '/../views/facebook/pare.ejs', 'utf8'));
    template = templateFile({
      name: req.body['name'],
      email: req.body['email'],
      date: req.body['date'],
      phone: req.body['phone'],
      servicetype: req.body['servicetype']
    });
    // toEmail = "amaral_anthony@hotmail.com";

  }

  sendgridRequest(composeMail(req.body['email'], template));

  res.send(req.body);

});

/**
 * Set up the mail information and template to be requested to be sent through SendGrid
 *
 * @param {String} from_email "From" email
 * @param {String} message Template file for email message
 */
function composeMail(from_email, to_email, message) {

  return sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [{
            email: to_email
          }],
          subject: "New Facebook Form Submission"
        }
      ],
      from: { email: from_email },
      content: [{
        type: 'text/html',
        value: message
      }]
    }
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

module.exports = router;
