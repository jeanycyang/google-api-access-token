const { expect } = require('chai');
const sinon = require('sinon');
const { getJWTClaim } = require('../index');

describe('getJWTClaim', function () {
  it('should throw error if argument(s) missing', function () {
    expect(() => getJWTClaim()).to.throw();
    expect(() => getJWTClaim('user-name@gcp-project-1245.iam.gserviceaccount.com')).to.throw(Error, 'must provide scope');
    expect(() => getJWTClaim(null, 'https://www.googleapis.com/auth/prediction')).to.throw(Error, 'must provide clientEmail');
  });
  it('should encode claim to base64 correctly', function () {
    // example from: https://developers.google.com/identity/protocols/OAuth2ServiceAccount
    this.clock = sinon.useFakeTimers(new Date(1328550785).getTime());
    expect(getJWTClaim('761326798069-r5mljlln1rd4lrbhg75efgigp36m78j5@developer.gserviceaccount.com', 'https://www.googleapis.com/auth/prediction')).to.equal('eyJpc3MiOiI3NjEzMjY3OTgwNjktcjVtbGpsbG4xcmQ0bHJiaGc3NWVmZ2lncDM2bTc4ajVAZGV2ZWxvcGVyLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzY29wZSI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcHJlZGljdGlvbiIsImF1ZCI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92NC90b2tlbiIsImV4cCI6MTMyODU1NDM4NSwiaWF0IjoxMzI4NTUwNzg1fQ');
    this.clock.restore();
  });
});
