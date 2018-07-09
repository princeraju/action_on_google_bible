'use strict';

const {
    Suggestions,
    SimpleResponse,
} = require('actions-on-google');

const bibleReadProcessor = require("../dataProcessors/bibleReadProcessor");
const constants = require("../constants");

exports.handle = function(conv){
    const parameters = conv.parameters;

    console.log("readbibleIntentHandler Parameters:"+JSON.stringify(parameters));
    console.log("readbibleIntentHandler Previous Data:"+JSON.stringify(conv.data));

    var book1 = parameters[constants.PARAMETERS.BOOK1];
    var chapter1 = parameters[constants.PARAMETERS.CHAPTER1];
    var verse1 = parameters[constants.PARAMETERS.VERSE1];

    if(conv.data.bibleReadFollowUpParameters){
        if(!book1 && conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.BOOK1]){
            book1 = conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.BOOK1];
        }
        if(!chapter1 && conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.CHAPTER1]){
            chapter1 = conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.CHAPTER1];
        }
        if(!verse1 && conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.VERSE1]){
            verse1 = conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.VERSE1];
        }
    }
    

    var result = bibleReadProcessor.getVerse(book1 , chapter1, verse1 ) ;
    internal.sayBibleVerse(conv,result);

};

var internal = {}

internal.mainSuggestions=[ //TODO create a suggetsion generator
    'Read John 3:16',
    'Proverbs 1:1'
];

internal.sucessBibleReadSuggestions=[
    'Read the next verse',
    'Read the previous verse'
];

internal.sayBibleVerse = function(conv,result) {
    //result.followUpMessage eg: What chapter do you want to read
    //result.followUpCurrentParameters
    //result.verse
    //result.verse.pos eg: John 3:16
    //result.id eg: 1001001
    //result.verse.words eg: For God so loved....
    //result.followUpSuggestions

    if(result.followUpMessage){
        conv.ask(result.followUpMessage);
        if(result.followUpCurrentParameters){
            conv.data.bibleReadFollowUpParameters = result.followUpCurrentParameters;
        }
        if(result.followUpSuggestions){
            conv.ask(new Suggestions(result.followUpSuggestions));
        }
    }else if(result.verse){
        conv.data.bibleReadFollowUpParameters = {};
        conv.data.previousBibleVerse = result.verse;
        conv.ask(new SimpleResponse({
            speech: `<speak>${result.verse.pos}<break strength="weak"/> ${result.verse.words}</speak>`, //put to central loc
            text: `${result.verse.pos}\n ${result.verse.words}`,
          }));
        conv.ask(new Suggestions(internal.sucessBibleReadSuggestions));
    }else{
        conv.data.bibleReadFollowUpParameters = {};
        conv.ask(new SimpleResponse({
            speech: `<speak>Oh hoo..There's some issue. Can I help you in some other way?</speak>`,
            text: `How can I help you?`,
          }));
        conv.ask(new Suggestions(internal.mainSuggestions));
    }
};
