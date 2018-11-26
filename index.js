/* REF:
* https://developers.google.com/identity/protocols/OAuth2ServiceAccount
* https://developers.google.com/identity/protocols/googlescopes
*/

const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

function fromBase64(string) {
  return string
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getBase64From(string) {
  return fromBase64(Buffer.from(string, 'utf8').toString('base64'));
}

function SHA256withRSA(privateKey, string) {
  const signer = crypto.createSign('SHA256');
  signer.update(string);
  const sig = signer.sign(privateKey, 'base64');
  return fromBase64(sig);
}

exports.SHA256withRSA = SHA256withRSA;

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

function getAccessTokenFromGoogle(jwt) {
  const postData = querystring.stringify({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  });
  const options = {
    method: 'POST',
    hostname: 'www.googleapis.com',
    port: 443,
    path: '/oauth2/v4/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
    },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
    req.write(postData);
    req.on('error', (e) => {
      reject(e);
    });
    req.end();
  });
}

exports.default = async function getAccessToken(pathOrObject, scope) {
  const key = getKey(pathOrObject);
  const data = `${JWTHeader}.${getJWTClaim(key.client_email, scope)}`;
  const signature = SHA256withRSA(key.private_key, data);
  const jwt = `${data}.${signature}`;
  const accessToken = await getAccessTokenFromGoogle(jwt).then(resp => resp.access_token);
  return accessToken;
};
