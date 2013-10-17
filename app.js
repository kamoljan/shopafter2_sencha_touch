var _ = require('underscore'),
    express = require('express'),
    connect = require('connect'),
    rest = require('restler'),
    MongoStore = require('connect-mongo')(express),
    fb = require('./lib/facebook'),
    movieIdx = [],
    movieRatingIdx = [],
    movieDateIdx = [],
    movieCache = {};

var AWS = require('aws-sdk'),
    nodeUtil = require('util'),
    async = require('async'),
    crypto = require('crypto');

// Global includes
config = require('./config').config;
handleError = require('./lib/error').handleError;
graph = require('fbgraph');
util = require('./lib/util');
require('./lib/database');

//console.log(config);

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,  //accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.aws.secretAccessKey,  //secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: config.aws.region,  //region: process.env.AWS_REGION
    sslEnabled: config.aws.sslEnabled
});

// App server setup
var app = express();

app.configure('development', function () {
    //app.use(express.logger());
    app.use(connect.static('./public'));
    app.set('appIndex', './public/app.html')
});

app.configure('production', function () {
    // Redirect from www
    app.use(function (req, res, next) {
        if (req.headers['host'] == 'shopafter.com') {
            res.redirect('http://m.showpafter.com' + req.url)
        } else {
            next();
        }
    });

    app.use(connect.static('./public/build/WL/production'));  //align to your path
    app.set('appIndex', './public/build/WL/production/app.html');  //align to your path
});

app.configure(function () {
    // Cors headers
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
    });

    app.use(connect.cookieParser());

    app.use(express.session({
        secret: config.sessionSecret,
        store: new MongoStore({ url: config.mongoDb })
    }));

    app.use(connect.bodyParser());
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true }));

    app.enable('jsonp callback');
    app.set('view engine', 'ejs');
});

var port = process.env.PORT || 9999;

app.listen(port, function () {
    console.log("Listening on " + port);
});

/**
 * Handle requests to the root URL.
 */
app.get('/', function (req, res) {

    var ua = req.headers['user-agent'];

    if (ua.match(/(Android|iPhone|iPod|iPad|Playbook|Silk|Kindle)/)) {
        res.sendfile(app.set('appIndex'));
    } else {
        res.render('web_meta.html.ejs', {
            layout: 'layout.html.ejs',
            title: 'Watch List',
            appUrl: '/app.html?deviceType=Phone',
            showDemo: Boolean(ua.match(/(AppleWebKit)/))
        });
    }
});

app.all('/app.html', function (req, res) {
    res.sendfile(app.set('appIndex'));
});

/**
 * Handle requests from the Facebook app.
 */
app.post('/', function (req, res) {
    var ua = req.headers['user-agent'];
    if (ua.match(/(AppleWebKit)/)) {
        res.sendfile(app.set('appIndex'));
    } else {
        res.render('web_meta.html.ejs', {
            layout: 'layout.html.ejs',
            title: 'Watch List',
            appUrl: '/app.html?deviceType=Phone',
            showDemo: false
        });
    }
});

app.get('/movies', fb.checkSession, fb.getFriendIds, fb.getUserDetails, function (req, res, next) {
    var cache = {}, idx = [],
        sort = movieIdx;

    if (req.query.sort && req.query.sort.match(/Date/i)) {
        sort = movieDateIdx;
    } else if (req.query.sort && req.query.sort.match(/Rating/)) {
        sort = movieRatingIdx;
    }

    util.addViewingData(req, res, next, movieCache, sort);
});

app.get('/movie', fb.checkSession, fb.getFriendIds, fb.getUserDetails, function (req, res, next) {
    var url = "http://api.rottentomatoes.com/api/public/v1.0/movies/" + req.query.rottenId + ".json?apikey=" + config.rottenTomatoesApiKey;
    rest.get(url, {
        parser: rest.parsers.json
    }).on('complete',function (data) {
            if (data.error) {
                res.json({success: false, error: data.error});
                return;
            }
            var response = util.parseMovieResults(data);
            util.addViewingData(req, res, next, response.cache, response.idx)
        }).on('error', function (err) {
            console.log('Error getting movies', err);
        });
});

app.post('/movie/:id/share', fb.checkSession, fb.getFriendIds, fb.getUserDetails, function (req, res, next) {
    var cache = movieCache[Number(req.params.id)];
    if (cache) {
        var post = {
            link: 'http://m.shopafter.com:9999/movie/' + req.params.id
        };
        if (req.body.message) {
            post.message = req.body.message;
        }
        graph.post(req.session.fb.user_id + '/links', post, function (err, fbRes) {
            if (fbRes.error && fbRes.error.message.match(/#282/)) {
                res.json({ success: false, error: 'permission', scope: 'share_item'})
            } else {
                res.json({ success: true });
            }
        });
    } else {
        res.json({ success: false });
    }
});

app.all('/movie/:id', function (req, res, next) {
    var cache = movieCache[Number(req.params.id)],
        showDemo = req.headers['user-agent'] && Boolean(req.headers['user-agent'].match(/(AppleWebKit)/));
    if (cache) {
        res.render('movie_meta.html.ejs', {
            locals: {
                movie: cache,
                title: cache.title + ' | The Watch List',
                appUrl: app.set('appIndex') + '#movies/' + req.params.id,
                showDemo: showDemo
            },
            layout: 'layout.html.ejs'
        })
    } else {
        Movie.findOne({ rottenId: req.params.id }, function (err, doc) {
            if (doc) {
                res.render('movie_meta.html.ejs', {
                    locals: {
                        movie: doc,
                        title: doc.title + ' | The Watch List',
                        appUrl: app.set('appIndex') + '#movies/' + req.params.id,
                        showDemo: showDemo
                    },
                    layout: 'layout.html.ejs'
                });
            } else {
                res.send("Movie not found", 404);
            }
        });
    }
});

app.get('/search', fb.checkSession, fb.getFriendIds, fb.getUserDetails, function (req, res, next) {
    rest.get(
            "http://api.rottentomatoes.com/api/public/v1.0/movies/" + req.query.rottenId + "?apikey=" + config.rottenTomatoesApiKey + "&page_limit=10&q=" + req.query.q
        ).on('complete',function (data) {
            var response = util.parseMovieResults(data);
            util.addViewingData(req, res, next, response.cache, response.idx)
        }).on('error', function (err) {
            console.log('Error getting movies', err);
        });
});

/**
 * Return a list of viewings for the user and all the user's friends
 */
app.get('/viewings', fb.checkSession, fb.getFriendIds, function (req, res) {
    // Search for all viewings in the database with a profile ID in the friendIds array
    Viewing.where('profileId').in(req.session.fb.friendIds).run(function (err, viewings) {
        if (err) {
            handleError('Could not retrieve list of viewings', viewings, req, res);
            return;
        }
        // Send the list of viewings back to the client
        res.json(viewings);
    });
});

app.get('/activity', fb.checkSession, fb.getFriendIds, function (req, res) {
    Viewing.where('profileId').in(req.session.fb.friendIds).sort('date', -1).limit(20).run(function (err, viewings) {
        if (err) {
            handleError('Could not retrieve list of movies', runs, req, res);
            return;
        }
        var response = [], action;
        _.each(viewings, function (viewing) {
            action = util.viewingAction(viewing);
            if (action) {
                response.push({
                    profileId: viewing.profileId,
                    movieId: viewing.movieId,
                    title: viewing.title,
                    name: viewing.name,
                    date: String(viewing.date),
                    action: action
                });
            }
        });
        res.json({ activity: response });
    });
});

/**
 * Add a new Viewing to the database
 */
app.post('/viewing', fb.checkSession, fb.getUserDetails, util.fetchOrCreateViewing, function (req, res, next) {
    var fbActions = [],
        fbResponses = [];
    if (req.body.wantToSee) {
        req.viewing.wantToSee = req.body.wantToSee == 'true';
        if (req.viewing.wantToSee) {
            fbActions.push({
                method: 'POST',
                relative_url: req.session.fb.user_id + '/' + config.fbNamespace + ':want_to_watch',
                body: 'movie=http://m.shopafter.com:9999/movie/' + req.body.movieId
            });
            fbResponses.push({ key: 'wantToSeeId', value: 'id' });
        } else if (req.viewing.wantToSeeId) {
            fbActions.push({ method: 'DELETE', relative_url: String(req.viewing.wantToSeeId) });
            fbResponses.push({ key: 'wantToSeeId', value: null });
        }
    }
    if (req.body.seen) {
        req.viewing.seen = req.body.seen == 'true';
        if (req.viewing.seen) {
            fbActions.push({
                method: 'POST',
                relative_url: req.session.fb.user_id + '/' + config.fbNamespace + ':watch',
                body: 'movie=http://m.shopafter.com:9999/movie/' + req.body.movieId
            });
            fbResponses.push({ key: 'seenId', value: 'id' });
        } else if (req.viewing.seenId) {
            fbActions.push({ method: 'DELETE', relative_url: String(req.viewing.seenId) });
            fbResponses.push({ key: 'seenId', value: 'null'});
        }
    }
    if (req.body.like && req.viewing.seenId) {
        req.viewing.like = req.body.like == 'true';
        if (req.viewing.like) {
            fbActions.push({
                method: 'POST',
                relative_url: String(req.viewing.seenId),
                body: 'rating=1'
            });
            fbResponses.push();
        }
    }
    if (req.body.dislike && req.viewing.seenId) {
        req.viewing.dislike = req.body.dislike == 'true';
        if (req.viewing.dislike) {
            fbActions.push({
                method: 'POST',
                relative_url: String(req.viewing.seenId),
                body: 'rating=-1'
            });
            fbResponses.push();
        }
    }
    if (fbActions.length) {
        console.log("Posting to Facebook Open Graph...", req.session.fb.access_token, fbActions);
        rest.post("https://graph.facebook.com", {
            data: {
                access_token: req.session.fb.access_token,
                batch: JSON.stringify(fbActions)
            }
        }).on('complete',function (str) {
                console.log("Posting to Facebook Open Graph... str = ", str);
                var data = JSON.parse(str);
                _.each(data, function (batchResponse) {
                    var body = JSON.parse(batchResponse.body),
                        takeAction = fbResponses.shift();
                    if (body.error) {
                        req.fbError = body.error;
                    }
                    if (takeAction) {
                        req.viewing[takeAction.key] = body[takeAction.value] || null;
                    }
                    console.log("Facebook batch complete", body)
                });
                util.saveViewing(req, res, next);
            }).on('error', function (err) {
                console.log('Error with batch request to FB', err);
                util.saveViewing(req, res, next);
            });
    } else {
        util.saveViewing(req, res, next);
    }
});

/**
 * When the app first starts, we cache a list of movies locally as this will cater for the vast majority of requests.
 */
/*
 Movie.where('releaseDate').$lt(Date.now()).sort('rank', 1).limit(200).run(function (err, movies) {

 _.each(movies, function (movie) {
 movieCache[movie.rottenId] = movie._doc;
 movieIdx.push(movie.rottenId);
 });

 _.each(_.sortBy(movies, function (movie) {
 return -Number(new Date(movie.releaseDate));
 }), function (movie) {
 movieDateIdx.push(movie.rottenId);
 });

 _.each(_.sortBy(movies, function (movie) {
 return -movie.criticRating;
 }), function (movie) {
 movieRatingIdx.push(movie.rottenId);
 });

 console.log("Cached " + movies.length + " movies.");
 });
 */

app.get('/ad', function (req, res) {
    // pagination
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    // filter
    var q = new RegExp(req.query.q, 'i');  // 'i' makes it case insensitive
    var category = req.query.category || 0;

    var query = {};
//    if (req.query.sort && req.query.sort.match(/Date/i)) {
//        query['sort'] = 'date';
//    } else if (req.query.sort && req.query.sort.match(/Location/)) {
//        query['sort'] = 'price';
//    }

    console.log('server page is = ' + page);
    console.log('server limit is = ' + limit);

    console.log('server q is = ' + q);
    console.log('server category is = ' + category);


    if (q) {
        query['description'] = q;
    }
    if (category) {
        query['category'] = category;
    }
    console.log('server query is = %j', query);

    Ad.paginate(query, page, limit, function (error, pageCount, paginatedResults) {
        if (error) {
            console.error(error);
        } else {
            console.log('server pageCount ' + pageCount);
            res.send({ "ads": paginatedResults, "pageCount": pageCount });
        }
    });
});

var s3 = new AWS.S3();
/**
 * Put image into s3 & an Ad into db
 */
app.post('/ad', fb.checkSession, function (req, res, next) {

    console.log("(ad.post): Start user_id = " + req.session.fb.user_id + "...");

    // Retrieve the currently logged in user details from Facebook
    graph.get("/me", function (err, user) {

        console.log("(ad.post): user_id = " + req.session.fb.user_id + "...");

        if (err) {
            handleError('Could not retrieve user info', user, req, res);
            return;
        }
        if (!req.body.image) {
            console.log('No file is uploaded!');
            return;
        }

        async.waterfall([

            function (callback) {
                var data = req.body.image;
                var key = crypto.createHash('md5').update(data).digest("hex");
                var base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
                base64Data += base64Data.replace('+', ' ');
                var binaryData = new Buffer(base64Data, 'base64');
                var obj = {
                    Bucket: config.aws.s3_bucket,
                    ACL: 'public-read',
                    Key: key,
                    Body: binaryData,
                    ContentType: 'image/jpeg'
                };
                var imgUrl = nodeUtil.format('https://s3-%s.amazonaws.com/%s/%s',
                    config.aws.region, config.aws.s3_bucket, key);
                callback(null, obj, data, imgUrl);
            },

            function (obj, data, imgUrl, callback) {
                s3.client.putObject(obj, function (err, data, next) {
                    if (err) {
                        console.log("Got error:", err.message);
                        console.log("Request:");
                        console.log(this.request.httpRequest);
                        console.log("Response:");
                        console.log(this.httpResponse);
                        return;  // exit if err
                    } else {
                        console.log("(ad.post): waterfall no err ");
                        console.log("(ad.post): user.id = " + user.id);
                        console.log("(ad.post): imgUrl = " + imgUrl);
                        console.log("(ad.post): req.body.category = " + req.body.category);
                        console.log("(ad.post): req.body.description = " + req.body.description);
                        console.log("(ad.post): req.body.price = " + req.body.price);
                        console.log("(ad.post): req.body.phone = " + req.body.phone);
                        console.log("(ad.post): req.body.latitude = " + req.body.latitude);
                        console.log("(ad.post): req.body.longitude = " + req.body.longitude);
                        // Construct a new Ad using the post data
                        var ad = new Ad({
                            profileId: user.id,
                            image: imgUrl,
                            thumb: imgUrl,
                            category: req.body.category,
                            description: req.body.description,
                            price: req.body.price,
                            phone: req.body.phone,
                            loc: [req.body.longitude, req.body.latitude],
                            date: new Date
                        });

                        // Save the ad to the database
                        ad.save(function (err) {
                            if (err) {
                                handleError('Could not save ad', err, req, res);
                                return;
                            }
                            console.log("Successfully saved new ad");
                            res.json({ success: true });
                        })
                    }
                    console.log("(ad.post): waterfall end of s3 ");
                })
            }
        ], function (err, result) {
                console.log("(ad.post): async.waterfall function (err, result)-> result " + result);
                console.log("(ad.post): async.waterfall function (err, result)-> err " + err);
            }
        );  //end async
    });  //end graph
});

/**
 * Ad view
 */
app.get('/ad/:id', function (req, res, next) {
    return Ad.find({ "_id": req.params.id }, function (err, ads) {
        if (!err) {
            res.send({ "ads": ads, "total": 1 });
        } else {
            res.send("Ad not found", 404);
        }
    });
});

