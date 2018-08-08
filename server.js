"use strict";

const express = require('express');

const app = express();

app.use(express.static('public'));

if (require.main === module) {
    app.listen(process.env.PORT || 8080, () => {
        console.info(`Your app is listening on ${this.address().port}`)
    });
}

module.exports = app;