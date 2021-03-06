'use strict';

var constants ={
    "BASE_FOLDER":"./data",
    "DATA_LOCATION" : {
        "ENGLISH_ASV_ROOT":"/bible/en/bbe",
        "BOOK_KEY_LOCATION" : {
            "ENGLISH" : "/meta/key_english.json"
        },
        "VERSE_SUGGESTIONS" : "/meta/verse_suggestions.json"
    },
    "INTENTS" : {
        "READ_BIBLE_INTENT" : "readBible",
        "WELCOME_INTET" : "welcomeIntent",
        "NEXT_VERSE_INTENT" : "readNextVerse",
        "PREV_VERSE_INTENT" : "readPrevVerse",
        "READ_RANDOM" : "readRandomVerse",
        "READ_ABOUT" : "readAbout"
    },
    "CHAPTER_FILE_NAME_SUFFIX" : "_content",
    "PARAMETERS" : {
        "BOOK1" : "book1",
        "CHAPTER1" : "chapter1",
        "VERSE1" : "verse1",
        "ANY_NUM" : "anyNum",
        "CATEGORY_NAME" : "categoryName"
    },
    "NEXT" : "next_verse",
    "PREVIOUS" : "prev_verse"
    
};

module.exports = constants;