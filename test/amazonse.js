'use strict';

let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;

let AmazonSESService = require('../lib/amazonses');

// Initialize service with fake api key
let service = new AmazonSESService({apiKey: 'fake-key', secret: 'fake-secret'});

let fakeOptions = {
  fromEmail: 'from@amandajialixiang.com',
  toEmail: 'to@amandajialixiang.com',
  subject: 'Test Emailer - AmazonSESService',
  content: 'Hello World!',
};

describe('AmazonSESService Functions', () => {

  let expectedResponse = {
    statusCode: 202,
    body: '',
    headers: '',
  };

  beforeEach(() => {
    sinon.stub(service.client, 'sendEmail').yields(null, null, expectedResponse);
  });

  afterEach(() => {
    service.client.sendEmail.restore();
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


describe('AmazonSESService Errors', () => {

  let expectedError = new Error('Sending email failed!');
  let expectedResponse = {
    statusCode: 401,
    body: '',
    headers: '',
  };

  beforeEach(() => {
    sinon.stub(service.client, 'sendEmail').yields(expectedError, null, expectedResponse);
  });

  afterEach(() => {
    service.client.sendEmail.restore();
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
