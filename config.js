"use strict";

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/node-postslist';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-node-postslist';
exports.PORT = process.env.PORT || 8080;