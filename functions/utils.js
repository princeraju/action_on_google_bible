'use strict';

const constants = require('./constants')

var utils ={};
utils.getBibleContentFolderLocation = function(){
    return constants.BASE_FOLDER + constants.DATA_LOCATION.ENGLISH_ASV_ROOT;
};

utils.getBookKeyFileLocation = function(){
    return constants.BASE_FOLDER + constants.DATA_LOCATION.BOOK_KEY_LOCATION.ENGLISH;
};

utils.getVerseSuggestionsFileLocation = function() {
    return constants.BASE_FOLDER + constants.DATA_LOCATION.VERSE_SUGGESTIONS;
};

utils.getRandomArbitrary = function(min, max) { //Returns a random number between min (inclusive) and max (exclusive)
    return parseInt(Math.random() * (max - min) + min);
};


module.exports = utils;