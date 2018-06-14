var request = require('request');
var cheerio = require('cheerio');

// models
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');

module.exports = function(router) {
    router.get('/', function(req, res) {
        Article.find({ saved: false }, function(err, doc) {
            if (err) {
                res.send(err);
            } else {
                res.render('index', {article: doc});
            }
        });
    })

    // rendering handlebar pages
    router.get('/articles', function(req,res) {
        Article.find({ saved: true }).populate('comments', body).exec(function(err, doc) {
            if (err) {
                res.send(err)
            } else {
                res.render('articles', {saved: doc});
            }
        });
    });

    router.get('/scrape', function(req, res) {
        request('https://techcrunch.com/', function(err, res, html) {
            var $ = cheerio.load(html);

            $('post-block__title').each(function(i, element) {
                var result = {};

            // grabbing the links and texts of each article
            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            var entry = new Article





















        })
    })
}


// home page
// app.get('/', function(req, res) {
//     res.redirect('/articles');
// });

// app.get('/scrape', function(req, res) {
//     request('https://techcrunch.com/', function(err, res, html) {
//         var $ = cheerio.load(html);
//         var articleArray = [];

//         $('post-block__title').each(function(i, element) {
//             var result = {};

//             // grabbing the links and texts of each article
//             result.title = $(this).children('a').text();
//             result.link = $(this).children('a').attr('href');

//             articleArray.push(result.title);

//             var entry = new Article(result);

//             entry.save(function (err, doc) {
//                 if (err) {
//                     throw err;
//                 } else {
//                     console.log(doc);
//                 }
//             });

//         });
//         res.redirect('/');
//     });
// });

// // throwing articles to the DOM
// app.get('/articles', function(req, res) {
//     Article.find().sort({_id: -1})

//     // handlebars
//     .exec
// })
