'use strict';

const app = require('actions-on-google').dialogflow();

app.intent('readBible', (conv) => {
    conv.ask('It worked.');
});

module.exports = app;