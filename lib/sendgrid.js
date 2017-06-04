'use strict';

/**
 * class SendGridService
 *   using SendGrid's v3 Node.js Library
 *   https://github.com/sendgrid/sendgrid-nodejs
 * 
 *
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
    this.apiKey = options.apiKey;
    this.SendGridSDK = require('sendgrid');
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

    let client = this.SendGridSDK(this.apiKey);
    let request = client.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    return new Promise((resolve, reject) => {

      client.API(request, function (error, response) {
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
