'use strict';

const {
    Suggestions,
} = require('actions-on-google');

const constants = require("../constants");
const intentUtils = require("./intentUtils");
const suggestionProcessor = require("../dataProcessors/suggestionProcessor");

var internal = {};

exports.handle = function(conv){
    var categoryName = conv.parameters[ constants.PARAMETERS.CATEGORY_NAME ];
    if(categoryName){
        if(!suggestionProcessor.isValidVerseCategory(categoryName)){
            conv.ask(`Sorry. I do not remember anything about ${categoryName}. 
            Maybe you can ask me to read about ${suggestionProcessor.getCategorySuggestionForApp(true).slice(0,3).join(',')}`);
        }else{
            var result = suggestionProcessor.getBibleVerseForCategory(categoryName);
            if(!result){//Incase the data stored is wrong, a single step failover.
                result = suggestionProcessor.getBibleVerseForCategory(categoryName);
            }
            intentUtils.readBible(conv,result);
        }
    }else{
        var result = suggestionProcessor.getBibleVerseForCategory(null);
        if(!result){ //Incase the data stored is wrong, a single step failover.
            result = suggestionProcessor.getBibleVerseForCategory(null);
        }
        conv.ask(`I know a lot about ${suggestionProcessor.getCategorySuggestionForApp(true).slice(0,3).join(',')} etc. Right now I've something for you.`);
        internal.readBible(conv,result);
    }
    conv.ask(new Suggestions( suggestionProcessor.getCategorySuggestionForApp() ));
};
