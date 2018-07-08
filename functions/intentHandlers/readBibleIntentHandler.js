'use strict';

const bibleReadProcessor = require("../dataProcessors/bibleReadProcessor");

exports.handle = function(conv){
    const parameters = conv.parameters;

    console.log(JSON.stringify(parameters));
    if(!parameters.book1  && (parameters.chapter1 || parameters.verse1 ) ){
        //TODO, read previous request and do it based on the context
    }else if( parameters.book1 && parameters.chapter1 && parameters.verse1 ){
        conv.ask( 
            bibleReadProcessor.getVerse(parameters.book1 , parameters.chapter1 , parameters.verse1 ) 
        );
    }else if(parameters.book1 && parameters.chapter1){
        //TODO Ask verse
    }else if(parameters.book1){
        //TODO, Ask which chapter or verse with example
    }

};

