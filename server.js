// Depedencies 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express = require('express');
var exphbs = require('express-handlebars');
var db = mongoose.connection;
// var routes = require('./routes/routes');

// require models
// var Comment = require('./models/Comment');
// var Article = require('./models/Article');


// port setup
var PORT = process.env.PORT || 8080;

// initialize express app
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


require('./routes/routes')(router);

app.use(router);

// handlebars setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

mongoose.Promise = Promise;
// mongoose connection
// mongoose.connect('mongodb://heroku_5lvr0ftp:e0e2m50qkmoqkijn0fkbasbpp8@ds259620.mlab.com:59620/heroku_5lvr0ftp');
if (process.env.MONGODB_URI){
        mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect('mongodb://localhost/news-scraper')
};

db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
  });

db.once('open', function() {
    console.log('Mongoose is connected!')
});

app.listen(PORT, function() {
    console.log('App is listening on PORT: ' + PORT);
});
