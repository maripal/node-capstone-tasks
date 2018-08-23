"use strict";

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/posts-list-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-posts-list-db';
exports.PORT = process.env.PORT || 8080;