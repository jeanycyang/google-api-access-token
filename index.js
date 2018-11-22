/* REF:
* https://developers.google.com/identity/protocols/OAuth2ServiceAccount
* https://developers.google.com/identity/protocols/googlescopes
*/

const fs = require('fs');

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

exports.default = function getAccessToken(pathOrObject) {
  const key = getKey(pathOrObject);
  return key;
};
