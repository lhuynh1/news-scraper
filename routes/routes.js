var request = require('request');
var cheerio = require('cheerio');

// models
var Article = require('../models/Article.js');
var Comment = require('../models/Comment.js');

module.exports = function(router) {
    // home page
    router.get('/', function(req, res) {
        Article.find({ saved: false }, function(err, doc) {
            if (err) {
                res.send(err);
            } else {
                res.render('index', {article: doc});
            }
        });
    })

    // rendering handlebar page
    router.get('/articles', function(req,res) {
        Article.find({ saved: true }).populate('comments', 'body').exec(function(err, doc) {
            if (err) {
                res.send(err)
            } else {
                res.render('articles', {saved: doc});
            }
        });
    });

    // scraping new articles
    router.get('/scrape', function(req, res) {
        request('https://techcrunch.com/', function(err, res, html) {
            var $ = cheerio.load(html);

            $('post-block__title').each(function(i, element) {
                var result = {};
                console.log(result);

            // grabbing the links and texts of each article
            result.title = $(this).children('a').text();
            result.link = 'https://techcrunch.com/' + $(this).children('a').attr('href');

            var entry = new Article(result);
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else { 
                    console.log (doc)
                }
            });
        });
    });
    res.redirect('/');
  })

// saving articles
  router.post('/articles/comments/:id', function(req, res) {
      Article.update({_id: req.params.id}, {$set: {saved: true}}, function(err, doc) {
          if (err) {
              res.send(err);
          } else {
              res.redirect('/');
          }
      });
  });

// deleting articles
router.post('/delete/:id', function(req, res) {
    Article.update({_id: req.params.id}, {$set: {saved: false}}, function(err, doc) {
        if(err) {
            res.send(err);
        } else {
            res.redirect('/articles');
        }
    });
})

// saving comments
router.post('/articles/comments/:id', function(req, res) {
    var newComment = new Comment(req.body);
    // console.log("newComment");
    newComment.save(function(err, doc) {
        if (err) {
            res.send(err);
        } else {
            Article.findOneAndUpdate({_id: req.params.id}, 
                {$push: {"comments": doc._id}},
                {new: true}).exec(function(err, newdoc) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.redirect('/articles');
                    }
                });
        }
    });
});

// deleting comments
router.post('/articles/delete/:id', function(req, res) {
    Comment.remove({_id: req.params.id}, function(err, doc) {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/articles');
        }
     });
  });
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
