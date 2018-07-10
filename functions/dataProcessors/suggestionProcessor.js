'use strict';

const constants = require('../constants')
const utils = require('../utils')
const jsonfile = require('jsonfile')
const bibleReadProcessor = require('./bibleReadProcessor');

var proc = {};
var internal = {};
internal.MAIN_SUGGESTION_LIMIT = 2 ;
internal.suggestionData = jsonfile.readFileSync(utils.getVerseSuggestionsFileLocation());

proc.getMainSuggestionsForApp = function(){
    var res = [];
    var list = internal.getSuggestionVerseList();
    var p = list.length/internal.MAIN_SUGGESTION_LIMIT;
    for(var i=1 ; i<=internal.MAIN_SUGGESTION_LIMIT ; i++){
        res.push( bibleReadProcessor.getBibleIdToString(  
            list[ utils.getRandomArbitrary(p*(i-1),p*i) ]
          ) );
    }
    var categoriesList = internal.getCategoriesList();
    res.push( 'Read about '+ categoriesList[ utils.getRandomArbitrary(0,categoriesList.length) ] );
    return res;
};

proc.getBibleVerseForCategory = function(category){
    var list = internal.getSuggestionVerseList();

    var temp = parseInt(list[ utils.getRandomArbitrary(0,list.length) ]);
    const verse = parseInt(temp%1000); temp = parseInt(temp/1000);
    const chapter = parseInt(temp%1000); temp = parseInt(temp/1000);
    const bookNum = parseInt(temp%1000);

    return internal.getBibleVerseForSuggestion(bookNum,chapter,verse);
};

proc.getCategorySuggestionForApp = function(noMetaInfo){
    var res=[];
    var categoriesList = internal.getCategoriesList();
    var p = categoriesList.length/internal.MAIN_SUGGESTION_LIMIT;
    for(var i=1 ; i<=internal.MAIN_SUGGESTION_LIMIT ; i++){
        var data = categoriesList[ utils.getRandomArbitrary(p*(i-1),p*i) ];
        if(!noMetaInfo){
            data = `Read about `+data; 
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

internal.getBibleVerseForSuggestion = function(bookNum , chapter , verse){
    var result={};
    const chapterFile = utils.getBibleContentFolderLocation()+"/"+bookNum+constants.CHAPTER_FILE_NAME_SUFFIX+".json";
    
    const data = jsonfile.readFileSync(chapterFile).data;
    const resultBible = data.filter(a => a.c == chapter && a.v == verse );
    if(resultBible.length == 0){
        return null;
    }else{
        result.verse = {};
        result.verse.pos = `${bookName} ${chapter}:${verse}`;
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