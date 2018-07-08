'use strict';

const constants = require('./constants')

var utils ={};
utils.getBibleContentFolderLocation = function(){
    return constants.BASE_FOLDER + constants.DATA_LOCATION.ENGLISH_ASV_ROOT;
};

utils.getBookKeyFileLocation = function(){
    return constants.BASE_FOLDER + constants.DATA_LOCATION.BOOK_KEY_LOCATION.ENGLISH;
};

module.exports = utils;