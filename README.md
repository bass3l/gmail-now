# gmail-now
A dead-simple gmail REST client.

* Do you need to send an email when your silly Node script finishes executing?
* Do you need to send an email or two per day using a gmail account (gSuit or gmail)?
* Did you try using gmail SMTP and needed to always check the `less secure app` option and forget it all the time?
* Other enterprise-ready email providers are not suitable for your in a way or another?

This is for you.

### Getting Started

1- Install the package:

`npm install --save gmail-now`

2- Create your Google project, enable Gmail API, create your `web application` OAuth2 credentials and fetch the refresh and access tokens. (I'll put up a wiki page about that later)

3- Use the following code sample to send a mail:

```javascript
'use strict';

const fs = require('fs');
const GmailClient = require('gmail-now');

const TOKENS_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';

const gmailClient = new GmailClient(CREDENTIALS_PATH, TOKENS_PATH);

gmailClient.sendMail(
    'Bassel Shmali <bass3l@gmail.com>', //from
    'Bassel Shmali <bass3l@gmail.com>', //to
    'YEA!!1',  //subject
    'This is a nice email body!' // <- email body, takes HTML too
);

```