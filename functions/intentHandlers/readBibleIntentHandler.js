'use strict';

const {
    Suggestions,
    SimpleResponse,
} = require('actions-on-google');

const bibleReadProcessor = require("../dataProcessors/bibleReadProcessor");
const constants = require("../constants");

exports.handle = function(conv){
    const parameters = conv.parameters;

    console.log(JSON.stringify(parameters));
    if(!parameters[constants.PARAMETERS.BOOK1]  && (parameters[constants.PARAMETERS.chapter1] || parameters[constants.PARAMETERS.VERSE1] ) ){
        //TODO, read previous request and do it based on the context
    }else if( parameters[constants.PARAMETERS.BOOK1] && parameters[constants.PARAMETERS.CHAPTER1] && parameters[constants.PARAMETERS.VERSE1] ){
        conv.data.parameters = parameters
        conv.ask( 
            bibleReadProcessor.getVerse(parameters[constants.PARAMETERS.BOOK1] , parameters[constants.PARAMETERS.CHAPTER1], parameters[constants.PARAMETERS.VERSE1] ) 
        );
    }else if(parameters.book1 && parameters.chapter1){
        //TODO Ask verse
    }else if(parameters.book1){
        //TODO, Ask which chapter or verse with example
    }

};

var internal = {}

internal.mainSuggestions=[ //TODO create a suggetsion generator
    'Read John 3:16',
    'Proverbs 1:1'
]

internal.sucessBibleReadSuggestions=[
    'Read the next verse',
    'Read the previous verse'
]

internal.sayBibleVerse = function(conv,result) {
    //result.followUpMessage eg: What chapter do you want to read
    //result.followUpCurrentParameters
    //result.verse
    //result.verse.pos eg: John 3:16
    //result.id eg: 1001001
    //result.verse.words eg: For God so loved....

    if(result.followUpMessage){
        conv.ask(result.followUpMessage);
        if(result.followUpCurrentParameters){
            conv.data.bibleReadFollowUpParameters = result.followUpCurrentParameters;
        }
    }else if(result.verse){
        conv.data.previousBibleVerse = result.verse
        conv.ask(new SimpleResponse({
            speech: `<speak>${result.verse.words}</speak>`,
            text: `*${result.verse.pos}*\n ${result.verse.words}`,
          }));
        conv.ask(new Suggestions(internal.sucessBibleReadSuggestions));
    }else{
        conv.ask(new SimpleResponse({
            speech: `<speak>There does not seem to be any response. Can I help you in some other way?</speak>`,
            text: `How can I help you?`,
          }));
        conv.ask(new Suggestions(internal.mainSuggestions));
    }
};
