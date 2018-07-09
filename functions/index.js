'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const app = require('./app');

console.log(JSON.stringify(process.env));

express().use(bodyParser.json(), app).listen(process.env.PORT || 5000);