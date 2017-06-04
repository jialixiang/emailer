'use strict';

/**
 * MailgunService
 *
 *   https://github.com/bojand/mailgun-js
 *   
 */

class MailgunService {

  /**
   * class constructor
   *   apiKey - your Mailgun API key
   *   domain - your Mailgun domain
   */
  constructor(options) {
    if (!options.apiKey || !options.domain) {
      throw new Error('apiKey & domain value must be defined!');
    }

    this.serviceKey = 'mailgun';
    this.apiKey = options.apiKey;
    this.domain = options.domain;
    this.MailgunSDK = require('mailgun-js');
  }

  /**
   * Send an email through Mailgun
   * @param {Object} options
   */
  sendEmail(options) {
    let mail = {
      from: options.fromEmail,
      to: options.toEmail,
      subject: options.subject,
      text: options.content,
      // html: 
      // attachment: 
    }
     
    let client = this.MailgunSDK({
      apiKey: this.apiKey,
      domain: this.domain
    });

    return new Promise((resolve, reject) => {

      client.messages().send(mail, function (error, response) {
        if (error) {
          return reject(error);
        }
        return resolve(response);
      })

    })
  }

}

// Export
module.exports = MailgunService;
