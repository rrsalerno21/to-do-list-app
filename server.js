const express = require('express');
const app = express();
const db = require('./models');
const PORT = process.env.PORT || 3000;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set Routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// Use Routes
app.use('/api', apiRoutes);
app.use(htmlRoutes)

// Sync sequelize db then listen to server
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port: ${PORT}`);
    });
});