'use strict';

let when = require('when');
let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;

let Emailer = require('../lib/emailer');

let fakeServiceOptions = {
  sendgrid: {
    apiKey: 'fake'
  },
  mailgun: {
    apiKey: 'fake',
    domain: 'fake'
  },
  amazonses: {
    apiKey: 'fake',
    secret: 'fake'
  }
};

describe('Emailer Errors', () => {

  // Initialize service with fake api key
  let emailer = new Emailer();
  // Set all serviceOptions to value 'fake'
  emailer.serviceOptions = fakeServiceOptions;

  it('Should throw an error when validating email options', () => {

    let fakeOptions = {
      fromEmail: 'from@amandajialixiang.com',
      toEmail: 'to@amandajialixiang',
      subject: ''
    };

    expect(() => emailer.validateEmailOptions(fakeOptions)).to.throw();

  });

  it('Should have tries all services and fail at last', () => {

    let fakeOptions = {
      fromEmail: 'from@amandajialixiang.com',
      toEmail: 'to@amandajialixiang.com',
      subject: 'Test Emailer',
      content: 'Hello World!'
    };

    return emailer.sendEmail(fakeOptions).catch(error => {
      expect(error).to.be.an('error');
    });

  });

});


describe('Emailer Functions', () => {

  // Initialize service with fake api key
  let emailer = new Emailer();
  // Set all serviceOptions to value 'fake'
  emailer.serviceOptions = fakeServiceOptions;

  let expectedResponse = 'success';

  beforeEach(() => {
    sinon.stub(emailer, 'handleSendEmail').returns(when(expectedResponse));
  });

  afterEach(() => {
    emailer.handleSendEmail.restore();
  });

  it('Should update email service and active service index +1', () => {

    emailer.updateService().then(actualResponse => {
      expect(emailer.activeServiceIndex).to.equal(0);
    }, error => {
      expect(error).to.equal(null);
    });

  });

  it('Stub to simulate a successful email sending', () => {

    let fakeOptions = {
      fromEmail: 'from@amandajialixiang.com',
      toEmail: 'to@amandajialixiang.com',
      subject: 'Test Emailer',
      content: 'Hello World!',
    };

    emailer.sendEmail(fakeOptions).then(actualResponse => {
      expect(actualResponse).to.equal(expectedResponse);
    }, error => {
      expect(error).to.equal(null);
    });

  });

});
