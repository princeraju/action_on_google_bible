'use strict';

const {
    Suggestions,
} = require('actions-on-google');
const suggestionProcessor = require("../dataProcessors/suggestionProcessor");

exports.handle = function(conv){
    conv.ask('Hi. What do you want me to read from the bible?');
    conv.ask(new Suggestions(suggestionProcessor.getMainSuggestionsForApp() ));
};



