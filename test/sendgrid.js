'use strict';

let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;

let SendGridService = require('../lib/sendgrid');

// Initialize service with fake api key
let service = new SendGridService({apiKey: 'fake-key'});

let fakeOptions = {
  fromEmail: 'from@amandajialixiang.com',
  toEmail: 'to@amandajialixiang.com',
  subject: 'Test Emailer - SendGridService',
  content: 'Hello World!',
};

describe('SendGridService Functions', () => {

  let expectedResponse = {
    statusCode: 202,
    body: '',
    headers: '',
  };

  beforeEach(() => {
    sinon.stub(service.client, 'API').yields(null, expectedResponse);
  });

  afterEach(() => {
    service.client.API.restore();
  });

  it('Stub to simulate a succeeded call of client API', () => {
    // Call the method and run the assertion
    return service.sendEmail(fakeOptions).then(actualResponse => {
      expect(actualResponse).to.equal(expectedResponse);
    }, error => {
      expect(error).to.equal(null);
    });
  });

});


describe('SendGridService Errors', () => {

  let expectedError = new Error('Sending email failed!');
  let expectedResponse = {
    statusCode: 401,
    body: '',
    headers: '',
  };

  beforeEach(() => {
    sinon.stub(service.client, 'API').yields(expectedError, expectedResponse);
  });

  afterEach(() => {
    service.client.API.restore();
  });

  it('Stub to simulate a failed call of client API', () => {
    // Call the method and run the assertion
    return service.sendEmail(fakeOptions).then(actualResponse => {
      expect(actualResponse).to.equal(expectedResponse);
    }, error => {
      expect(error).to.equal(expectedError);
    });
  });

});
