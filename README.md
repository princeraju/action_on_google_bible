# Actions on Google: Holy Bible using Node.js 

This is the webhook code used to serve the Holy Bible, an Action for the Google Assistant.
Actions on Google lets you extend the functionality of the Google Assistant with Actions.

## Actions supported
Ok Google,ask Holy Bible
* Read John 3:16
* Tell me about family (ask the topic you want)
* Talk something
* Read next verse
* Read previous verse
* Psalms Chapter 1

Actions uses advanced Natural Language Undertanding (NLU) and Machine Learning to understand the queries and map it to the corresponding intents.


## Setup Instructions

See the developer guide and release notes at [https://developers.google.com/actions/](https://developers.google.com/actions/) for more details.

### Deployment
This project is served like a normal web server which servers REST APIs. But you can also make changes to function/index.js file to put the project in services like Google Cloud Functions or AWS Labda.
The action-on-google npm package [https://www.npmjs.com/package/actions-on-google] (https://www.npmjs.com/package/actions-on-google) have sufficient information about this.

## References and How to report bugs
* Actions on Google documentation: [https://developers.google.com/actions/](https://developers.google.com/actions/).
* If you find any issues, please open a bug here on GitHub.


### Contributing
You can contribute in two ways
#### Contribute to the code
* Raise questions/feature requests in GitHub. This would help in tracking who is doing what.
* Fork the repo, develop and test your code changes.
* Ensure that the code adheres to the existing style.
* Ensure that your code has an appropriate set of unit tests which all pass.
* Submit a pull request
#### Contributing to the bible content
##### Prior knowledge required
* This invloves adding new categories, or add to existing categories at data/meta/verse_suggestions.json
* An example bible id would be like 9012002, the last three letters form the verse, the three before form the chapter, and the digits before it forms the book id. Book Id can be traced from data/meta/key_english.json
##### Steps
* Fork the repo, make the changes.
* Verify the JSON file created is valid and the bible verses are added to the correc category.
* Submit a pull request
* If a new category is added to the file, create an issue on Github mentioning that a new category is created. ( This would be used to update info in diagflow console )

## License
See [LICENSE](LICENSE).