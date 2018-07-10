'use strict';

const bibleReadProcessor = require("../dataProcessors/bibleReadProcessor");
const constants = require("../constants");
const intentUtils = require("../intentUtils");

exports.handle = function(conv){
    const parameters = conv.parameters;

    console.log("readbibleIntentHandler Parameters:"+JSON.stringify(parameters));
    console.log("readbibleIntentHandler Previous Data:"+JSON.stringify(conv.data));

    var book1 = parameters[constants.PARAMETERS.BOOK1];
    var chapter1 = parameters[constants.PARAMETERS.CHAPTER1];
    var verse1 = parameters[constants.PARAMETERS.VERSE1];
    var anyNum = parameters[constants.PARAMETERS.ANY_NUM];

    if(conv.data.bibleReadFollowUpParameters){

        //Updating variables based on previous values
        if(!book1 && conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.BOOK1]){
            book1 = conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.BOOK1];
        }
        if(!chapter1 && conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.CHAPTER1]){
            chapter1 = conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.CHAPTER1];
        }
        if(!verse1 && conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.VERSE1]){
            verse1 = conv.data.bibleReadFollowUpParameters[constants.PARAMETERS.VERSE1];
        }

        if(anyNum){ //Case the response can be chapter or verse
            if(!chapter1){
                chapter1 = anyNum;
            }else if(!verse1){
                verse1 = anyNum;
            }
        }
    }
    

    var result = bibleReadProcessor.getVerse(book1 , chapter1, verse1 ) ;
    intentUtils.readBible(conv,result);

};



