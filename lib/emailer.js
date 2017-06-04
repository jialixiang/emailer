'use strict';

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
        apiKey: process.env.SES_ACESSS_KEY,
        secret: process.env.SES_SECRET_KEY
      }
    };

    this.currentService = null;
    this.currentServiceIndex = -1;

  }
  
  /**
   * updateService
   *   plus 1 to currentServiceIndex (by default, it's -1)
   *   to update currentService to next service in ordered list
   *   
   *   this will only be called when currentService is null or 
   *   currentService fails to send email
   *
   *   if currentServiceIndex exceed ordered list length
   *   it means no more available services, so reset currentService to null
   */

  updateService() {

    ++this.currentServiceIndex;

    return new Promise((resolve, reject) => {

      if (this.currentServiceIndex >= this.serviceOrderedList.length) {
        console.log('no more service provider available!');
        this.currentService = null;
        return resolve(this.currentService);
      }

      let serviceKey = this.serviceOrderedList[this.currentServiceIndex];

      // TODO: logging
      try {
        this.currentService = new this.services[serviceKey](
          this.serviceOptions[serviceKey]
        );
      } catch (error) {
        console.log(error);
        return reject(error);
      }

      return resolve(this.currentService);

    });
  }

  /**
   * handleUpdateService
   *   keep updating email service provider until there is a successful one
   */

  handleUpdateService() {

   return this.updateService().then(
     (val) => {
       if (!val) {
         throw new Error('all services are down!');
       } else {
         console.log(`service updated: ${val.serviceKey}`);
       }
       return val;
     },
     (err) => {
       console.log(`error when updating service: ${err}\n`);
       return this.handleUpdateService();
     });

  }

  /**
   * sendEmail
   * @param {Object} options
   * send email using service provider
   *   if current provider fails, update email service and send email again
   */

  recursivelySendEmail(options) {

    let email = {
      'fromEmail': options.fromEmail,
      'toEmail': options.toEmail,
      'subject': options.subject,
      'content': options.content,
      'contentType': options.contenType
    };

    let promise = this.currentService.sendEmail(email);

    promise.then(
      (val) => {
        console.log(`fulfilled by ${this.currentService.serviceKey}`);
      },
      (err) => {
        console.log(`rejected:\n ${err}`);
        this.handleUpdateService().then(
          () => {
            console.log('sending email....');
            this.recursivelySendEmail(options);
          },
          () => {
            console.log('all services are done!');
          });
      });

  }

  /**
   * handleSendEmail
   * @param {Object} options
   */

  handleSendEmail(options) {
    if (!this.currentService) {

      this.handleUpdateService().then(
        () => {
          console.log('sending email....');
          this.recursivelySendEmail(options);
        },
        () => {
          console.log('all services are down!');
        });

    } else {
      this.recursivelySendEmail(options);
    }
  }
}

// Export
module.exports = Emailer;
