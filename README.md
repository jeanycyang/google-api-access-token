# Google API Access Token

[![npm version](https://badge.fury.io/js/%40jeanycyang%2Fgoogle-api-access-token.svg)](https://badge.fury.io/js/%40jeanycyang%2Fgoogle-api-access-token)
[![Build Status](https://travis-ci.org/jeanycyang/google-api-access-token.svg?branch=master)](https://travis-ci.org/jeanycyang/google-api-access-token)
<!-- [![Test Coverage][coveralls-image]][coveralls-url] -->

Get Google API access token from Google Cloud service account file/object.

## Features
- zero dependency
<!-- - 100% test coverage -->

## Install

```bash
npm install --save @jeanycyang/google-api-access-token
```

## Usage

```javascript
const getAccessToken = require('@jeanycyang/google-api-access-token');

// from file path
const accessToken = getAccessToken('./config/gckey.json', 'https://www.googleapis.com/drive/v2/files');
```
or
```javascript
// from google cloud key object
const accessToken = getAccessToken({
    "type": "service_account",
  "project_id": "gcp-project-1245",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----....",
  "client_email": "user-name@gcp-project-1245.iam.gserviceaccount.com",
  "client_id": "1234874585712327208344",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/user-name%40gcp-project-1245.iam.gserviceaccount.com"
}, 'https://www.googleapis.com/drive/v2/files');
```

## License

MIT