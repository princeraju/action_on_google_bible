'use strict';

const constants = require('../constants')
const utils = require('../utils')
const jsonfile = require('jsonfile')
const bibleReadProcessor = require('./bibleReadProcessor');
const processorUtils = require('./processorUtils');

var proc = {};
var internal = {};
internal.suggestionData = jsonfile.readFileSync(utils.getVerseSuggestionsFileLocation());

proc.getMainSuggestionsForApp = function(addPrevNextSuggestion){
    var res = [];

    var categoriesList = internal.getCategoriesList();
    res.push( 'Read about '+ categoriesList[ utils.getRandomArbitrary(0,categoriesList.length) ] );

    if(addPrevNextSuggestion){
        var limit = 1 ; 
    }else{
        var limit = 5;
    }
    var list = internal.getSuggestionVerseList();
    var p = list.length/limit;
    for(var i=1 ; i<=limit ; i++){
        res.push( processorUtils.getBibleIdToString(  
            list[ utils.getRandomArbitrary(p*(i-1),p*i) ]
          ) );
    }

    res = res.concat(proc.getReadPrevNextSuggestions());

    return res;
};

proc.getBibleVerseForCategory = function(category){
    var list = internal.getSuggestionVerseList(category);

    var temp = parseInt(list[ utils.getRandomArbitrary(0,list.length) ]);
    const verse = parseInt(temp%1000); temp = parseInt(temp/1000);
    const chapter = parseInt(temp%1000); temp = parseInt(temp/1000);
    const bookNum = parseInt(temp%1000);

    return internal.getBibleVerseForSuggestion(bookNum,chapter,verse);
};


proc.getCategorySuggestionForApp = function(noMetaInfo){
    var res=[];
    var categoriesList = internal.getCategoriesList();
    var limit = 5;
    var p = categoriesList.length/limit;
    for(var i=1 ; i<=limit ; i++){
        var data = categoriesList[ utils.getRandomArbitrary(p*(i-1),p*i) ];
        if(!noMetaInfo){
            data = `Read about `+ data; 
        }
        res.push(data);    
    }
    return res;
};

proc.isValidVerseCategory = function(category) {
    if( category && internal.suggestionData[category] ){
        return true;
    }
    return false;
};

proc.getReadPrevNextSuggestions = function(){
    return [
        'Read the next verse',
        'Read the previous verse'
    ];
};

proc.getAfterFirstBibleReadSuggestion = function(){
    var available = [
        "I can read the previous or next verse. Just ask me.",
        `I would be really happy if you ask me to read about ${proc.getCategorySuggestionForApp(true).slice(0,3)}.`,
        `I really liked that. Want to read something else?`,
        `I may be having something special for you. Ask me if you want to hear it.`
    ];
    return available[ utils.getRandomArbitrary(0,available.length) ];
};

proc.getAfterSuccessiveBibleReadSuggestion = function(){
    var available = [
        "Want to read anything else?",
        "Try something else?",
        "Want to read next verse? Just ask me",
        "Ask me to read something sepcial. I'll not disappoint you.",
    ];
    return available[ utils.getRandomArbitrary(0,available.length) ];
};

internal.getBibleVerseForSuggestion = function(bookNum , chapter , verse){
    var result={};
    const chapterFile = utils.getBibleContentFolderLocation()+"/"+bookNum+constants.CHAPTER_FILE_NAME_SUFFIX+".json";
    
    const data = jsonfile.readFileSync(chapterFile).data;
    const resultBible = data.filter(a => a.c == chapter && a.v == verse );
    if(resultBible.length == 0){
        return null;
    }else{
        result.verse = {};
        result.verse.pos = `${processorUtils.getBibleIdToString(resultBible[0].id)}`;
        result.verse.id = resultBible[0].id;
        result.verse.words = resultBible[0].d;
        return result;
    }
};

internal.getSuggestionVerseList = function(category){
    var result = [];
    if(!category){
        const suggestionData = internal.suggestionData;
        for( var key in suggestionData ){
            if(suggestionData.hasOwnProperty(key)){
                result = result.concat( suggestionData[key] );
            }
        }
    }else{
        if( internal.suggestionData[category] ){
            result =  internal.suggestionData[category];
        }
    }
    return result;
};

internal.getCategoriesList = function(){
    var result = [];
    const suggestionData = internal.suggestionData;
        for( var key in suggestionData ){
            if(suggestionData.hasOwnProperty(key)){
                //console.log(key);
                result.push( key );
            }
    }
    return result;
};



module.exports = proc;