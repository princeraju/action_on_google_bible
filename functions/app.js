'use strict';

const app = require('actions-on-google').dialogflow();
const constants = require('./constants');
const readBibleIntentHandler = require('./intentHandlers/readBibleIntentHandler');

app.intent( constants.INTENTS.READ_BIBLE_INTENT , (conv) => {
    //console.log(JSON.stringify(conv));
    readBibleIntentHandler.handle(conv);
});

module.exports = app;