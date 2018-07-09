'use strict';

const constants = require('../constants')
const utils = require('../utils')
const jsonfile = require('jsonfile')


var proc = {};
var internal = {};

proc.getVerse = function(bookName,chapter,verse){
    //result.followUpMessage eg: What chapter do you want to read
    //result.followUpCurrentParameters
    //result.followUpSuggestions
    //result.verse
    //result.verse.pos eg: John 3:16
    //result.id eg: 1001001
    //result.verse.words eg: For God so loved....
    var result={};

    const bookNum = internal.getBookSequenceNumber(bookName);
    result.followUpCurrentParameters = {};
    if(bookNum == -1){
        result.followUpMessage = "Please tell me a valid book in bible.";
        result.followUpSuggestions=['1 John','Psalms','Ruth']; //TODO, add to suggestion generator
        return result;
    }else{
        result.followUpCurrentParameters[constants.PARAMETERS.BOOK1] = bookName;
    }

    if(!chapter){
        result.followUpMessage = "What chapter would you like to hear?";
        result.followUpSuggestions=['Chapter 5','Chapter 2','Chapter 1']; //TODO, add to suggestion generator
        return result;
    }else{
        result.followUpCurrentParameters[constants.PARAMETERS.CHAPTER1] = chapter;
    }

    if(!verse){
        result.followUpMessage = "and what verse?";
        result.followUpSuggestions=['Verse 5','Verse 2','Verse 1']; //TODO, add to suggestion generator
        return result;
    }

    if(verse<0){
        verse = -1 * verse; //To overcome issue in John 3-16 where verse comes as -16
    }

    const chapterFile = utils.getBibleContentFolderLocation()+"/"+bookNum+constants.CHAPTER_FILE_NAME_SUFFIX+".json";
    
    const data = jsonfile.readFileSync(chapterFile).data;
    const resultBible = data.filter(a => a.c == chapter && a.v == verse );
    if(resultBible.length == 0){
        result.followUpMessage = `Sorry. ${bookName} ${chapter}:${verse} is not available in the holy bible`;
        result.followUpCurrentParameters= {};//Clearing follow up parameters
        result.followUpSuggestions=['1 John 3:16','Proverbs 1:1']; //TODO, add to suggestion generator
        return result;
    }else{
        result.verse = {};
        result.verse.pos = `${bookName} ${chapter}:${verse}`;
        result.verse.id = resultBible[0].id;
        result.verse.words = resultBible[0].d;
        return result;
    }
}

proc.getPrevNextVerse = function(id,type){
    var temp = parseInt(id);
    const verse = parseInt(temp%1000); temp = parseInt(temp/1000);
    const chapter = parseInt(temp%1000); temp = parseInt(temp/1000);
    const bookNum = parseInt(temp%1000);

    var result={};
    const chapterFile = utils.getBibleContentFolderLocation()+"/"+bookNum+constants.CHAPTER_FILE_NAME_SUFFIX+".json";
    const data = jsonfile.readFileSync(chapterFile).data;
    const resultBibleIndex = data.findIndex(a => a.c == chapter && a.v == verse );

    if(type == constants.PREVIOUS && resultBibleIndex == 0 ){
        result.errormessage = `You previously heard ${internal.convertBibleIdToString(id)} which is the first verse of the book`;
    }else if( type == constants.NEXT &&  resultBibleIndex == data.length-1 ){
        result.errormessage = `You just heard ${internal.convertBibleIdToString(id)} which is the last verse of the book`;
    }else{
        if(type == constants.PREVIOUS){
            var returnResVerse = data[resultBibleIndex-1];
        }else if(type == constants.NEXT){
            var returnResVerse = data[resultBibleIndex+1];
        }
        result.verse = {};
        result.verse.pos = internal.convertBibleIdToString(returnResVerse.id);
        result.verse.id = returnResVerse.id;
        result.verse.words = returnResVerse.d;
    }
    return result;
};

internal.convertBibleIdToString = function(id){
    var temp = parseInt(id);
    const verse = parseInt(temp%1000); temp = parseInt(temp/1000);
    const chapter = parseInt(temp%1000); temp = parseInt(temp/1000);
    const bookNum = parseInt(temp%1000);

    const keyEnglish = utils.getBookKeyFileLocation();
    const keys = jsonfile.readFileSync(keyEnglish).resultset.keys;
    const resultKey = keys.filter( arr => arr.b == bookNum );

    if(resultKey.length == 0){
        return -1;
    }
    return `${resultKey[0].n} ${chapter}:${verse}`;
    
};

internal.getBookSequenceNumber = function(bookName){
    if(!bookName){
        return -1;
    }
    const keyEnglish = utils.getBookKeyFileLocation();
    const keys = jsonfile.readFileSync(keyEnglish).resultset.keys;
    const result = keys.filter( arr => arr.n == bookName );
    if(result.length == 0){
        return -1;
    }else{
        return result[0].b;
    }
};


module.exports = proc;