/* REF:
* https://developers.google.com/identity/protocols/OAuth2ServiceAccount
* https://developers.google.com/identity/protocols/googlescopes
*/

const fs = require('fs');

function getBase64From(string) {
  return Buffer.from(string).toString('base64')
    .replace(/={1,2}$/, ''); // remove padding(s)
}

function getKey(pathOrObject) {
  let key;
  if (typeof pathOrObject === 'string') {
    key = JSON.parse(fs.readFileSync(pathOrObject, 'utf8'));
  } else if (typeof pathOrObject === 'object') {
    key = pathOrObject;
  } else {
    throw Error('no google cloud service-account key found!');
  }
  if (!key || key.type !== 'service_account' || !key.project_id || !key.private_key || !key.client_email) {
    throw Error('key is invalid!');
  }
  return key;
}

exports.getKey = getKey;

// Same as: getBase64From('{"alg":"RS256","typ":"JWT"}');
const JWTHeader = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9';

function getJWTClaim(clientEmail, scope) {
  if (!clientEmail) throw Error('must provide clientEmail');
  if (!scope) throw Error('must provide scope');
  const unixEpochTime = Math.floor((new Date()).getTime() / 1000);
  const payload = {
    iss: clientEmail,
    scope,
    aud: 'https://www.googleapis.com/oauth2/v4/token',
    exp: unixEpochTime + 60 * 60,
    iat: unixEpochTime,
  };
  return getBase64From(JSON.stringify(payload));
}

exports.getJWTClaim = getJWTClaim;

exports.default = function getAccessToken(pathOrObject, scope) {
  const key = getKey(pathOrObject);
  const jwt = `${JWTHeader}.${getJWTClaim(key.client_email, scope)}`;
  return jwt;
};
