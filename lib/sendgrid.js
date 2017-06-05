'use strict';

/**
 * class SendGridService
 *   using SendGrid's v3 Node.js Library
 *   https://github.com/sendgrid/sendgrid-nodejs
 */

class SendGridService {

  /**
   * class constructor
   *   apiKey - your SendGrid API key
   */
  constructor(options) {
    if (!options.apiKey) {
      throw new Error('apiKey value must be defined!');
    }

    this.serviceKey = 'sendgrid';
    this.SendGridSDK = require('sendgrid');
    this.client = this.SendGridSDK(options.apiKey);
  }

  /**
   * Send an email through SendGrid
   * @param {Object} options
   */
  sendEmail(options) {

    let helper = this.SendGridSDK.mail;
    let contentType = options.contentType || 'text/plain';

    let fromEmail = new helper.Email(options.fromEmail);
    let toEmail = new helper.Email(options.toEmail);
    let subject = options.subject;
    let content = new helper.Content(contentType, options.content);
    let mail = new helper.Mail(fromEmail, subject, toEmail, content)

    let request = this.client.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    return new Promise((resolve, reject) => {

      this.client.API(request, (error, response) => {
        if (error) {
          return reject(error);
        }
        return resolve(response);
      })

    })
  }

}

// Export
module.exports = SendGridService;
