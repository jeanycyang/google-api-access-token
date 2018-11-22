const { expect } = require('chai');
const { getKey } = require('../index');

describe('getKey', function () {
  describe('it should parse JSON key file correctly', function () {
    const key = getKey('./test/gckey.example.json');
    it('should return an object', function () {
      expect(key).to.be.an('object');
    });
    it('should parse necessary fields', function () {
      expect(key).to.include.all.keys('type', 'client_email', 'project_id', 'private_key');
    });
    it('should be service account', function () {
      expect(key.type).to.equal('service_account');
    });
  });
  describe('it should check key object', function () {
    it('should throw error if some fields missing', function () {
      expect(() => getKey({})).to.throw(Error, 'key is invalid!');
      expect(() => getKey({ type: 'aaa' })).to.throw(Error, 'key is invalid!');
      expect(() => getKey({ type: 'service_account' })).to.throw(Error, 'key is invalid!');
      expect(() => getKey({ type: 'service_account', project_id: 'abc-123' })).to.throw(Error, 'key is invalid!');
      expect(() => getKey({ type: 'service_account', project_id: 'abc-123', private_key: '-----BEGIN PRIVATE KEY-----\nMIIE' })).to.throw(Error, 'key is invalid!');
      expect(() => getKey({
        type: 'service_account', project_id: 'abc-123', private_key: '-----BEGIN PRIVATE KEY-----\nMIIE', client_email: '',
      })).to.throw(Error, 'key is invalid!');
      expect(() => getKey({
        type: 'service_account', project_id: 'abc-123', private_key: '-----BEGIN PRIVATE KEY-----\nMIIE', client_email: 'user-name@gcp-project-1245.iam.gserviceaccount.com',
      })).to.not.throw(Error, 'key is invalid!');
    });
  });
});
