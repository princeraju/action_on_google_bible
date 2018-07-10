'use strict';

const {
    Suggestions,
    SimpleResponse,
} = require('actions-on-google');

const bibleReadProcessor = require("../dataProcessors/bibleReadProcessor");
const suggestionProcessor = require("../dataProcessors/suggestionProcessor");
const intentUtils = require("../intentUtils");

var internal = {}

exports.handle = function(conv,type){
    conv.data.bibleReadFollowUpParameters = {};
    console.log("prevNextIntentHandler previous data:"+JSON.stringify(conv.data));
    if(type){
        if(conv.data.previousBibleVerse && conv.data.previousBibleVerse.id){
            var result = bibleReadProcessor.getPrevNextVerse(conv.data.previousBibleVerse.id,type);
            intentUtils.readBible(conv,result);
        }else{
            conv.ask('Ohh.. I don\'t remember you asking me anything to read. Can you help me by telling what exactly you need?');
            conv.ask(new Suggestions( suggestionProcessor.mainSuggestions() ));
        }
    }else{
        conv.ask('Somethings not right. Can you tell me exactly what you want me to read?');
        conv.ask(new Suggestions( suggestionProcessor.mainSuggestions() ));
    }
    
};





