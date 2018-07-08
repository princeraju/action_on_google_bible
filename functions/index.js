'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const app = require('./app');

express().use(bodyParser.json(), app).listen(process.env.PORT || 5000);