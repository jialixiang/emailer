# Email Service API

npm package for sending email through multiple service provider
If one of the services goes down, it can quickly failover to a another provider without affecting customers

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

```
nodejs
```

### Setup Environment Variables

Update the development environment with your email service API keys
e.g. [SENDGRID_API_KEY] on (https://app.sendgrid.com/settings/api_keys)

```bash
echo "
export SENDGRID_API_KEY='YOUR_SENDGRID_API_KEY'

export MAILGUN_API_KEY='YOUR_MAILGUN_API_KEY'
export MAILGUN_DOMAIN='YOUR_MAILGUN_DOMAIN'

export SES_ACCESS_KEY='YOUR_SES_ACCESS_KEY'
export SES_SECRET_KEY='YOUR_SES_SECRET_KEY'
" > emailer.env
echo "emailer.env" >> .gitignore
source ./emailer.env
```

### Installing

```
npm install --save email-js
```

## Running the tests

```
npm test
```

## Usage
```javascript
'use strict';

let Emailer = require('./index');

let emailer = new Emailer();

let options = {
  fromEmail: 'from@example.com',
  toEmail: 'to@email.com',
  subject: 'Test Emailer',
  content: 'Hello World'
};

emailer.sendEmail(options).then((val) => {
 console.log('==== email sent sucessfully ====');
 console.log(val);
 // ...
,(err) => {
 console.log('==== failed ====');
 console.log(err);
 // ...
});

```

## TODO

* [Add Mailchimp/Mandrill Support] - On April 27, Mandrill became a paid MailChimp add-on. Keep receiving "Acceptable Use Violation Detected"...
* [Rate Limit of Sending Emails]
* [Support More Complex Email] - html body, cc, bcc, attachment, etc
* [More Test Cases]

## Authors

* **Amanda Xiang** - *Initial work* - [Amanda Xiang](https://github.com/jialixiang)

## License

