'use strict';

/**
 * AmazonSESService
 *   
 *   https://www.npmjs.com/package/node-ses
 *
 */

class AmazonSESService {

  /**
   * class constructor
   *   apiKey - your Amazon SES API key
   *   secret - your Amazon SES secret
   */ 
  constructor(options) {
    if (!options.apiKey || !options.secret) {
      throw new Error('apiKey & secret value must be defined!');
    }

    this.serviceKey = 'amazonses';
    this.AmazonSESSDK = require('node-ses');
    this.client = this.AmazonSESSDK.createClient({
      key: options.apiKey,
      secret: options.secret
    });

  }  


  /**
   * Send an email through Mailgun
   * @param {Object} options
   */

  sendEmail(options) {

    // Give SES the details and let it construct the message for you. 
    let altText = 'plain text'

    let mail = {
      to: options.toEmail, 
      from: options.fromEmail,
      // TODO: add cc and bcc support
      subject: options.subject,
      message: options.content,
      altText: altText
    };

    return new Promise((resolve, reject) => {

      this.client.sendEmail(mail, (error, data, response) => {
        if (error) {
          return reject(error);
        }
        return resolve(response);
      })

    })
  }
}
   
// Export
module.exports = AmazonSESService;
