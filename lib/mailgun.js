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
    this.MailgunSDK = require('mailgun-js');
    this.client = this.MailgunSDK({
      apiKey: options.apiKey,
      domain: options.domain
    }).messages();

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
      // TODO add html & attachment support
    }
     
    return new Promise((resolve, reject) => {

      this.client.send(mail, (error, response) => {
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
