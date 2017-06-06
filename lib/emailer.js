'use strict';

let validator = require('validator');

let SendGridService = require('./sendgrid');
let MailgunService = require('./mailgun');
let AmazonSESService = require('./amazonses');

/**
 * Emailer
 *   an abstraction between multiple email service providers
 *
 * If one of the services goes down, it can quickly failover to a another provider without affecting your customers.
 *
 */

class Emailer {

  constructor() {

    this.services = {
      sendgrid: SendGridService,
      mailgun: MailgunService,
      amazonses: AmazonSESService
    };

    this.serviceOrderedList = ['sendgrid', 'mailgun', 'amazonses'];

    this.serviceOptions = {
      sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY
      },
      mailgun: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      },
      amazonses: {
        apiKey: process.env.SES_ACCESS_KEY,
        secret: process.env.SES_SECRET_KEY
      }
    };

    this.activeService = null;
    this.activeServiceIndex = -1;

  }
  
  /**
   * validateEmailOptions
   *   if email address in options is in correct format
   *   if subject / content in options is not empty
   * @param {Object} options
   *
   */

  validateEmailOptions(options) {

    let fromEmail = options.fromEmail;
    let toEmail = options.toEmail;
    let subject = options.subject;
    let content = options.content;

    if (typeof fromEmail !== 'string' || !validator.isEmail(fromEmail)) {
      throw new Error(`invalid FROM email: ${fromEmail}`);
    }

    if (typeof toEmail !== 'string' || !validator.isEmail(toEmail)) {
      throw new Error(`invalid TO email: ${toEmail}`);
    }

    if (typeof subject !== 'string' || validator.isEmpty(subject)) {
      throw new Error(`invalid SUBJECT: ${subject}`);
    }

    // TODO: actually Amazon SES allows empty content
    // Not allow empty content for now but may need to change based on service
    if (typeof content !== 'string' || validator.isEmpty(content)) {
      throw new Error(`invalid CONTENT: ${content}`);
    }

  }

  /**
   * handleUpdateService
   *   plus 1 to activeServiceIndex (by default, it's -1)
   *   to update activeService to next service in ordered list
   *   
   *   this will only be called when activeService is null or
   *   activeService fails to send email
   *
   *   if activeServiceIndex exceed ordered list length
   *   it means no more available services, so reset activeService to null
   */

  handleUpdateService() {

    ++this.activeServiceIndex;

    return new Promise((resolve, reject) => {

      if (this.activeServiceIndex >= this.serviceOrderedList.length) {
        console.log('no more service provider available!');
        this.activeService = null;
        return resolve(this.activeService);
      }

      let serviceKey = this.serviceOrderedList[this.activeServiceIndex];

      try {
        // If serviceOptions is invalid, it will throw an error
        this.activeService = new this.services[serviceKey](
          this.serviceOptions[serviceKey]
        );
      } catch (error) {
        console.log(`${serviceKey} - ${error}`);
        return reject(error);
      }

      return resolve(this.activeService);

    });
  }

  /**
   * handleSendEmail
   *   send email using current service provider
   * @param {Object} options
   */

  handleSendEmail(options) {

    // Validate if options are in correct email format
    this.validateEmailOptions(options);

    let email = {
      'fromEmail': options.fromEmail,
      'toEmail': options.toEmail,
      'subject': options.subject,
      'content': options.content,
    };

    if (!this.activeService) {
      return Promise.reject(new Error('there is no active email service provider!'));
    }

    console.log('sending email....');
    return this.activeService.sendEmail(email);

  }

  /**
   * updateService
   *   keep updating email service provider until there is a successful one
   *   or all services are down
   */

  updateService() {

   return this.handleUpdateService().then((val) => {
     if (!val) {
       return Promise.reject(new Error('all services are down!'));
     }
     console.log(`service updated: ${val.serviceKey}`);
     return Promise.resolve(val);
   }, (err) => {
     return this.updateService();
   });

  }

  /**
   * sendEmail
   *   try sending email, if succeeded => resolve
   *   otherwise update email service and try again
   * @param {Object} options
   */

  // TODO: Set Rate Limits ?
  sendEmail(options) {

    return new Promise((resolve, reject) => {

      this.handleSendEmail(options).then((val) => {
        console.log(`fulfilled by: ${this.activeService.serviceKey}`);
        return resolve(val);
      }, (err) => {
        console.log(err);
        // Error happens when sending email, update service and retry...
        this.updateService().then((val) => {
            return resolve(this.sendEmail(options));
        }, (err) => {
          return reject(err);
        });
      });

    });

  }

}

// Export
module.exports = Emailer;
