'use strict';

const functions = require('firebase-functions');
const app = require('./functions/app');

module.exports.bibleIntentHandler = functions.https.onRequest(app);