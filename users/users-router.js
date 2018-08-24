"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const userRouter = express.Router();

const { User } = require('./users-models');



module.exports = userRouter;