'use strict';

const {
    Suggestions,
} = require('actions-on-google');


var internal = {}

internal.mainSuggestions=[ //TODO create a suggetsion generator
    'Read John 3:16',
    'Proverbs 1:1'
]

exports.handle = function(conv){
    conv.ask('Hi. What do you want me to read from the bible?');
    conv.ask(new Suggestions(internal.mainSuggestions));
};



