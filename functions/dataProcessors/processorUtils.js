'use strict';

const utils = require('../utils')
const jsonfile = require('jsonfile')


var internal={};
var proc={};

internal.bibleBookKeys = jsonfile.readFileSync(utils.getBookKeyFileLocation()).resultset.keys;


proc.getBibleIdToString = function(id){
    var temp = parseInt(id);
    const verse = parseInt(temp%1000); temp = parseInt(temp/1000);
    const chapter = parseInt(temp%1000); temp = parseInt(temp/1000);
    const bookNum = parseInt(temp%1000);

    const keys = internal.bibleBookKeys;
    const resultKey = keys.filter( arr => arr.b == bookNum );

    if(resultKey.length == 0){
        console.log("Id to string conversion failed for: "+id);
        return -1;
    }
    return `${resultKey[0].n} ${chapter}:${verse}`;
    
};

internal.RANDOM_MAX = 9;
proc.getRandomChapters = function(max){
    if(!max){
        limit = internal.RANDOM_MAX;
    }
    return internal.randomTextGen("Chapter",max);
};

proc.getRandomVerses = function(max){
    if(!max){
        limit = internal.RANDOM_MAX;
    }
    return internal.randomTextGen("Verse",max);
};

internal.randomTextGen = function(text,max){
    var result = [];
    var sections = 3;
    if(max<sections){
        for(var i=1;i<=max;i++){
            result.push(`${text} ${i}`);    
        }
        return result;
    }
    var division = parseInt(max/sections);
    var p = division;
    for(var i=0 ; i<sections ; i++){
        var data = p;
        p = p+division;
        result.push(`${text} ${data}`);    
    }
    return result;
};

module.exports=proc;