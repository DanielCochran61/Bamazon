const express = require('express');
const path = require('path');

const db = require('./models');
const seed = require('./seeds/db-seeds');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);



db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log(`App is listening on PORT ${PORT}`)
    });
});