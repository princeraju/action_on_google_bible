'use strict';

const {
    Suggestions,
} = require('actions-on-google');

const constants = require("../constants");
const intentUtils = require("../intentUtils");
const suggestionProcessor = require("../dataProcessors/suggestionProcessor");

var internal = {};

exports.handle = function(conv){

    var categoryName = conv.parameters[ constants.PARAMETERS.CATEGORY_NAME ];
    console.log(conv.parameters);
    if(categoryName){
        if(!suggestionProcessor.isValidVerseCategory(categoryName)){
            conv.ask(`Sorry. I do not remember anything about ${categoryName}. 
            Maybe you can ask me to read about ${suggestionProcessor.getCategorySuggestionForApp(true).join(',')}`);
        }else{
            var result = suggestionProcessor.getBibleVerseForCategory(categoryName);
            internal.readBible(conv,result);
        }
    }else{

    }
    conv.ask(new Suggestions( suggestionProcessor.getCategorySuggestionForApp() ));
};

internal.readBible = function(conv,result){
    if(result){
        intentUtils.readBible(conv,result);
    }else{
        conv.ask("Ohh. There seems to be an issue. Can you ask me again?");
    }
};