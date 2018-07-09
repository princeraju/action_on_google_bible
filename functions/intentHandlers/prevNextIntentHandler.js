'use strict';

const {
    Suggestions,
    SimpleResponse,
} = require('actions-on-google');

const bibleReadProcessor = require("../dataProcessors/bibleReadProcessor");

var internal = {}

internal.mainSuggestions=[ //TODO create a suggetsion generator
    'Read John 3:16',
    'Proverbs 1:1'
];

internal.sucessBibleReadSuggestions=[
    'Read the next verse',
    'Read the previous verse'
];

exports.handle = function(conv,type){
    conv.data.bibleReadFollowUpParameters = {};
    console.log("prevNextIntentHandler previous data:"+JSON.stringify(conv.data));
    if(type){
        if(conv.data.previousBibleVerse && conv.data.previousBibleVerse.id){
            var result = bibleReadProcessor.getPrevNextVerse(conv.data.previousBibleVerse.id);
            internal.sayBibleVerse(conv,result);
        }else{
            conv.ask('Ohh.. I don\'t remember you asking me anything to read. Can you help me by telling what exactly you need?');
            conv.ask(new Suggestions(internal.mainSuggestions));
        }
    }else{
        conv.ask('Somethings not right. Can you tell me exactly what you want me to read?');
        conv.ask(new Suggestions(internal.mainSuggestions));
    }
    
};

internal.sayBibleVerse = function(conv,result) {
    //result.texerrormessaget
    //result.verse
    //result.verse.pos eg: John 3:16
    //result.id eg: 1001001
    //result.verse.words eg: For God so loved....

    if(result.errormessage){
        conv.ask(result.errormessage);
        conv.ask(new Suggestions(internal.sucessBibleReadSuggestions));
    }else if(result.verse){
        conv.data.previousBibleVerse = result.verse;
        conv.ask(new SimpleResponse({
            speech: `<speak>${result.verse.words}  <break strength="weak"/> ${result.verse.pos} </speak>`,
            text: `${result.verse.pos}\n ${result.verse.words}`,
          }));
        conv.ask(new Suggestions(internal.sucessBibleReadSuggestions));
    }else{
        conv.data.bibleReadFollowUpParameters = {};
        conv.ask(new SimpleResponse({
            speech: `<speak>There seems to be issue. Can I help you in some other way?</speak>`,
            text: `How can I help you?`,
          }));
        conv.ask(new Suggestions(internal.mainSuggestions));
    }
};



