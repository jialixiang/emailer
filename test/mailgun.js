'use strict';

let sinon = require('sinon');
let chai = require('chai');
let expect = chai.expect;

let MailgunService = require('../lib/mailgun');

// Initialize service with fake api key
let service = new MailgunService({apiKey: 'fake-key', domain: 'fake-domain'});

let fakeOptions = {
  fromEmail: 'from@amandajialixiang.com',
  toEmail: 'to@amandajialixiang.com',
  subject: 'Test Emailer - MailgunService',
  content: 'Hello World!',
};

describe('MailgunService Functions', function() {

  let expectedResponse = {
    statusCode: 202,
    body: '',
    headers: '',
  };

  beforeEach(function() {
    sinon.stub(service.client, 'send').yields(null, expectedResponse);
  });

  afterEach(function () {
    service.client.send.restore();
  });

  it("Stub to simulate a succeeded call of client API", function () { 
    // Call the method and run the assertion
    return service.sendEmail(fakeOptions).then(
      actualResponse => { 
        expect(actualResponse).to.equal(expectedResponse);
      },
      error => {
        expect(error).to.equal(null);
      });
  });

});


describe('MailgunService Errors', function() {

  let expectedError = new Error("Sending email failed!");
  let expectedResponse = {
    statusCode: 401,
    body: '',
    headers: '',
  };

  beforeEach(function() {
    sinon.stub(service.client, 'send').yields(expectedError, expectedResponse);
  });

  afterEach(function () {
    service.client.send.restore();
  });

  it("Stub to simulate a failed call of client API", function () { 
    // Call the method and run the assertion
    return service.sendEmail(fakeOptions).then(
      actualResponse => { 
        expect(actualResponse).to.equal(expectedResponse);
      },
      error => {
        expect(error).to.equal(expectedError);
      });
  });

});
