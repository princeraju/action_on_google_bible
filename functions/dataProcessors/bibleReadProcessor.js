'use strict';

const constants = require('../constants')
const utils = require('../utils')
const jsonfile = require('jsonfile')


var proc = {};
var internal = {};

proc.getVerse = function(bookName,chapter,verse){
    if(verse<0){
        verse = -1 * verse; //To overcome issue in John 3-16 where verse comes as -16
    }
    const bookNum = internal.getBookSequenceNumber(bookName);
    if(bookNum == -1){
        //TODO; handle it
    }
    const chapterFile = utils.getBibleContentFolderLocation()+"/"+bookNum+constants.CHAPTER_FILE_NAME_SUFFIX+".json";
    
    const data = jsonfile.readFileSync(chapterFile).data;
    const result = data.filter(a => a.c == chapter && a.v == verse );
    if(result.length == 0){
        return "Sorry. This verse does not exist."; //TODO, 1. Add to strings file 2. Give max chapters in the book / max verse in chapter
    }else{
        return result[0].d;
    }
}

proc.getChapter = function(bookName,chapter){
    const bookNum = internal.getBookSequenceNumber(bookName);
    if(bookNum == -1){
        //TODO; handle it
    }
    const chapterFile = utils.getBibleContentFolderLocation()+"/"+bookNum+constants.CHAPTER_FILE_NAME_SUFFIX+".json";

    const data = jsonfile.readFileSync(chapterFile).data;
    const result = data.filter(a => a.c == chapter );
    if(result.length == 0){
        return "Sorry. This chapter does not exist."; //TODO, 1. Add to strings file 2. Give max chapters in the book 
    }else{
        var finalResult=""; //TODO, add SSML
        result.forEach(function(el){
            finalResult += el.d;
        });

        return finalResult;
    }
}

internal.getBookSequenceNumber = function(bookName){
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