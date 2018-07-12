'use strict';

const {
    Suggestions,
    SimpleResponse,
} = require('actions-on-google');
const suggestionProcessor = require("../dataProcessors/suggestionProcessor");

var intentUtils = {};

intentUtils.readBible = function(conv,result){
    //result.followUpMessage eg: What chapter do you want to read
    //result.followUpCurrentParameters
    //result.verse
    //result.verse.pos eg: John 3:16
    //result.id eg: 1001001
    //result.verse.words eg: For God so loved....
    //result.followUpSuggestions
    //result.errormessage
    //result.additionalSuccessPrefixText

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
        var prefix="";
        if(result.additionalSuccessPrefixText){
            prefix = `${result.additionalSuccessPrefixText} <break time="800ms"> `;
        }
        conv.ask(new SimpleResponse({
            speech: ssml`<speak>${prefix} ${result.verse.pos}<break time="500ms"/> ${result.verse.words}</speak>`, 
            text: `${result.verse.pos}\n ${result.verse.words}`,
        }));
        if( !conv.data.isFirstRead ){
            conv.data.isFirstRead=true;
            conv.ask(suggestionProcessor.getAfterFirstBibleReadSuggestion());
        }else{
            conv.ask(suggestionProcessor.getAfterSuccessiveBibleReadSuggestion());
        }
        conv.ask(new Suggestions( suggestionProcessor.getMainSuggestionsForApp(true) ));
    }else if(result.errormessage){
        conv.ask(result.errormessage);
        conv.ask(new Suggestions( suggestionProcessor.getMainSuggestionsForApp(true) )); 
    }else{
        conv.data.bibleReadFollowUpParameters = {};
        conv.ask(`Oh hoo..There's some issue. Can I help you in some other way?`);
        conv.ask(new Suggestions( suggestionProcessor.getMainSuggestionsForApp() ));
    }
};

module.exports=intentUtils;