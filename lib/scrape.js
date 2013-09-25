var _ = require('underscore'),
    rest = require('restler'),
    Step = require('step');

config = {

    // Base URL of the App (must be a publically accessible URL)
    //redirect_uri:  'http://184.105.243.209:3000',
    redirect_uri: '',

    // Facebook Application ID
    client_id: '723097297716821',

    // Facebook Application Secret
    client_secret: '3780ed7dbc6e0cded57506a8fa566036',

    // MongoDB endpoint
    //mongoDb:       'mongodb://user:mypass@aaaaaaa.mongolab.com:27847/watchlist',
    mongoDb: 'mongodb://admin:12345678@localhost:27017/shopafter',

    // Session encyption key
    sessionSecret: 'kenta234?@#$ewfdhgsadjfhbasd!@#naomibasyihd',

    appUrl: 'http://m.shopafter.com',
    fbNamespace: 'shopafter',

    rottenTomatoesApiKey: '12341243531425642564356'
};

util = require('./util');
require('./database');


function saveMovies(movies, callback) {

    var movie = movies.pop(),
        exists;

    if (movie) {
        Movie.findOne({ rottenId: movie.rottenId }, function (err, doc) {

            exists = Boolean(doc);

            if (exists) {
                doc.set(movie);
            } else {
                doc = new Movie(movie);
            }
            doc.save(function (err) {
                if (err) {
                    callback(err);
                } else {
                    console.log((exists ? 'Updated ' : 'Saved ') + doc.rottenId);
                    saveMovies(movies, callback);
                }
            });
        });
    } else {
        console.log("Finished saving movies");
        callback();
    }
}

function scrapeRT(url, callback) {
    rest.get(
            url
        ).on('complete',function (data) {

            var response = util.parseMovieResults(data);
            saveMovies(_.values(response.cache), callback);

        }).on('error', function (err) {
            console.log('Error getting movies', err);
        });
}


// Rank update script

function updateRank(movies, callback) {

    var movie = movies.shift();

    if (movie) {
        Movie.findOne({ rottenId: movie.rottenId }, function (err, dbMovie) {
            if (dbMovie) {

                dbMovie.rank = movie.rank;
                dbMovie.save(function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log("Saved " + dbMovie.rottenId);
                        updateRank(movies, callback);
                    }
                });
            } else {
                console.log("Couldn't find " + movie.rottenId + " - skipping.");
                updateRank(movies, callback);
            }
        });
    } else {
        console.log("Finished updating movie ranks");
        callback();
    }
}


function updateRanks(callback) {

    console.log("Updating movie ranks.");

    rest.get(
            "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=edgcj9h8ua3ktus3kg4gv6s5&limit=50"
        ).on('complete',function (data) {

            var response = util.parseMovieResults(data),
                ranks = [];

            for (var i = 0; i < response.idx.length; i++) {
                ranks.push({ rottenId: response.idx[i], rank: i });
            }

            Movie.update({ 'rottenId': { $gt: 0 } }, { $set: { rank: 100 }}, { multi: true }, function (err, ok) {

                if (err) {
                    console.log("Err", err);
                    callback(err);
                } else {
                    console.log("Updated all movies to rank 100");
                    updateRank(ranks, callback);
                }
            });

        }).on('error', function (err) {
            console.log('Error getting movies', err);
            callback(err);
        });
}


// http://api.themoviedb.org/2.1/Movie.getInfo/en/json/c1614707389650a798d71b1b93ad2adb/76726
function parseTmdb(movies, callback) {

    var movie = movies.shift();

    if (movie) {

        rest.get(
            "http://api.themoviedb.org/2.1/Movie.imdbLookup/en/json/c1614707389650a798d71b1b93ad2adb/tt" + movie.imdbId,
            { parser: rest.parsers.json }
        ).on('complete',function (movieIdData) {

                rest.get(
                    "http://api.themoviedb.org/2.1/Movie.getInfo/en/json/c1614707389650a798d71b1b93ad2adb/" + movieIdData[0].id,
                    { parser: rest.parsers.json }
                ).on('complete',function (data) {

                        var director = _.find(data[0].cast, function (c) {
                            return c.job == 'Director'
                        });
                        var writer = _.find(data[0].cast, function (c) {
                            return c.job == 'Writer'
                        });

                        movie.set({
                            genres: _.map(data[0].genres,function (g) {
                                return g.name
                            }).join(', '),
                            studio: _.map(data[0].studios,function (g) {
                                return g.name
                            }).join(', '),
                            director: director ? director.name : null,

                            tagline: data[0].tagline,
                            budget: data[0].budget,
                            revenue: data[0].revenue,
                            homepage: data[0].homepage,
                            trailer: data[0].trailer,
                            writer: writer ? writer.name : null
                        });

                        movie.save(function (err, ok) {
                            if (err) {
                                console.log("Err", err);
                                callback(err);
                            } else {
                                console.log("Updated " + movie.title);
                                parseTmdb(movies, callback)
                            }
                        });
                    }).on('error', function (err) {
                        console.log('Error getting movie', err);
                    });

            }).on('error', function (err) {
                console.log('Error getting movie', err);
                callback(err);
            });

    } else {
        console.log("Finished adding extra movie info");
        callback();
    }
}


function updateMoviesWithTmdb(callback) {

    Movie.find({
        imdbId: { $exists: true },
        tagline: { $exists: false}
    }).limit(50).run(function (err, movies) {

            if (err) {
                console.log("Err", err);
                callback(err);
            } else {
                parseTmdb(movies, callback)
            }
        });

}


Step(
    function () {
        console.log("Scraping Opening movies...");
        scrapeRT("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=edgcj9h8ua3ktus3kg4gv6s5&limit=50", this);
    },
    function (err) {
        if (err) throw(err);
        console.log("Scraping In Theater movies pg 1...");
        scrapeRT("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=edgcj9h8ua3ktus3kg4gv6s5&page_limit=50&page=1", this);
    },
    function (err) {
        if (err) throw(err);
        console.log("Scraping In Theater movies pg 2...");
        scrapeRT("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=edgcj9h8ua3ktus3kg4gv6s5&page_limit=50&page=2", this);
    },
    function (err) {
        if (err) throw(err);
        console.log("Scraping In Theater movies pg 3...");
        scrapeRT("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=edgcj9h8ua3ktus3kg4gv6s5&page_limit=50&page=3", this);
    },
    function (err) {
        if (err) throw(err);
        console.log("Update movie ranks...");
        updateRanks(this);
    },
    function (err) {
        if (err) throw(err);
        console.log("Pull extra anfo from TMDB...");
        updateMoviesWithTmdb(this);
    },
    function (err) {
        if (err) throw(err);
        console.log("Finished.");
        mongoose.disconnect();
    },
    function (err) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            mongoose.disconnect();
        }
    }
);


// var url = req.session.fb.user_id + '/' + config.fbNamespace + ':want_to_watch',
//     body = {
//         movie: 'http://www.watchlistapp.com/graph/movie/' + req.body.movieId
//     };

// graph.batch('post', url, body, function(err, fbRes, nxt) {
//     if (err) {
//         throw(err);
//     }
//     req.viewing.wantToSeeId = fbRes.id;
//     nxt();
// });
