'use strict';

const app = require('actions-on-google').dialogflow();
const constants = require('./constants');
const readBibleIntentHandler = require('./intentHandlers/readBibleIntentHandler');
const welcomeIntentHandler = require('./intentHandlers/welcomeIntentHandler');
const prevNextIntentHandler = require('./intentHandlers/prevNextIntentHandler');
const readFromCategoriesIntentHandler = require('./intentHandlers/readFromCategoriesIntentHandler');

app.intent( constants.INTENTS.READ_BIBLE_INTENT , (conv) => {
    readBibleIntentHandler.handle(conv);
});

app.intent(  constants.INTENTS.WELCOME_INTET ,(conv)=> {
    welcomeIntentHandler.handle(conv);
});

app.intent(  constants.INTENTS.NEXT_VERSE_INTENT ,(conv)=> {
    prevNextIntentHandler.handle(conv,constants.NEXT);
});

app.intent(  constants.INTENTS.PREV_VERSE_INTENT ,(conv)=> {
    prevNextIntentHandler.handle(conv,constants.PREVIOUS);
});

app.intent( constants.INTENTS.READ_RANDOM , (conv)=>{
    readFromCategoriesIntentHandler.handle(conv);
});

app.intent( constants.INTENTS.READ_ABOUT , (conv)=>{
    readFromCategoriesIntentHandler.handle(conv);
});

module.exports = app;