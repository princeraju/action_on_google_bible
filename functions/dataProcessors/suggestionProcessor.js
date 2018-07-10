'use strict';

const constants = require('../constants')
const utils = require('../utils')
const jsonfile = require('jsonfile')
const bibleReadProcessor = require('./bibleReadProcessor');

var proc = {};
var internal = {};
internal.suggestionData = jsonfile.readFileSync(utils.getVerseSuggestionsFileLocation());

proc.getMainSuggestionsForApp = function(){
    var res = [];

    var categoriesList = internal.getCategoriesList();
    res.push( 'Read about '+ categoriesList[ utils.getRandomArbitrary(0,categoriesList.length) ] );

    var limit = 5;
    var list = internal.getSuggestionVerseList();
    var p = list.length/limit;
    for(var i=1 ; i<=limit ; i++){
        res.push( bibleReadProcessor.getBibleIdToString(  
            list[ utils.getRandomArbitrary(p*(i-1),p*i) ]
          ) );
    }
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
        result.verse.pos = `${bibleReadProcessor.getBibleIdToString(resultBible[0].id)}`;
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