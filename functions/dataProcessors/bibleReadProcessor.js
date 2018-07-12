'use strict';

const constants = require('../constants')
const utils = require('../utils')
const jsonfile = require('jsonfile')
const processorUtils = require('./processorUtils');


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
        result.followUpMessage = "I'm not clear about the name of the book. Can you say a book name like 'Psalms' or 'Matthew'?";
        result.followUpSuggestions=['1 John','Psalms','Ruth']; //TODO, add to suggestion generator
        return result;
    }else{
        result.followUpCurrentParameters[constants.PARAMETERS.BOOK1] = bookName;
    }

    const chapterFile = utils.getBibleContentFolderLocation()+"/"+bookNum+constants.CHAPTER_FILE_NAME_SUFFIX+".json";
    var data = jsonfile.readFileSync(chapterFile).data;

    var chapterCountAvailable = [...new Set(data.map(item => item.c ))].length; //only unique chapters
    if(!chapter){
        result.followUpMessage = `From ${bookName} what chapter would you like to hear?`;
        result.followUpSuggestions=processorUtils.getRandomChapters(chapterCountAvailable);
        return result;
    }else{
        
        data = data.filter( a => a.c == chapter ); //data reduced to inside chapters
        if(data.length == 0){
            result.followUpMessage = `${bookName} contains only ${chapterCountAvailable} chapters. Can you tell me one from that?`;
            result.followUpSuggestions=processorUtils.getRandomChapters(chapterCountAvailable);
            return result;
        }
        result.followUpCurrentParameters[constants.PARAMETERS.CHAPTER1] = chapter;
    }

    var verseCountAvailable = data.length; 

    if(!verse){
        result.followUpMessage = `and what verse from chapter ${chapter}?`;
        result.followUpSuggestions=processorUtils.getRandomVerses(verseCountAvailable);
        return result;
    }

    if(verse<0){
        verse = -1 * verse; //To overcome issue in John 3-16 where verse comes as -16
    }

    data = data.filter( a=> a.v == verse ); //data reduced to correct verse
    if(data.length == 0){
        result.followUpMessage = `${bookName} chapter ${chapter} contains only ${verseCountAvailable} verses. Which verse to read?`;
        result.followUpSuggestions=processorUtils.getRandomChapters(verseCountAvailable);
        return result;
    }

    result.verse = {};
    result.verse.pos = `${bookName} ${chapter}:${verse}`;
    result.verse.id = data[0].id;
    result.verse.words = data[0].d;
    return result;

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
        result.errormessage = `You previously heard ${processorUtils.getBibleIdToString(id)} which is the first verse of the book. I'll be able to help you if you ask me to read the next verse.`;
    }else if( type == constants.NEXT &&  resultBibleIndex == data.length-1 ){
        result.errormessage = `You just heard ${processorUtils.getBibleIdToString(id)} which is the last verse of the book. I'll be able to help you if you ask me to read the previous verse.`;
    }else{
        if(type == constants.PREVIOUS){
            var returnResVerse = data[resultBibleIndex-1];
        }else if(type == constants.NEXT){
            var returnResVerse = data[resultBibleIndex+1];
        }
        result.verse = {};
        result.verse.pos = processorUtils.getBibleIdToString(returnResVerse.id);
        result.verse.id = returnResVerse.id;
        result.verse.words = returnResVerse.d;
    }
    return result;
};

internal.bibleBookKeys = jsonfile.readFileSync(utils.getBookKeyFileLocation()).resultset.keys;



internal.getBookSequenceNumber = function(bookName){
    if(!bookName){
        return -1;
    }
    const keys = internal.bibleBookKeys;
    const result = keys.filter( arr => arr.n == bookName );
    if(result.length == 0){
        return -1;
    }else{
        return result[0].b;
    }
};


module.exports = proc;