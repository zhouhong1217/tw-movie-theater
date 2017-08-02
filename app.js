'use strict';
const orm = require('orm');
const express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(express.static('public'));
app.use(bodyParser.json({limit: '1mb'}));//解析请求体
let urlencodedParser = bodyParser.urlencoded({extended: true});
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(orm.express("sqlite:///home/zl/sqlites/movies.db", {
    define: function (db,models,next) {
        models.Genre = db.define("genre", {
            id: Number,
            name: String,
        });
        models.Movie = db.define("movie", {
            id: Number,
            alt: String,
            year: String,
            title: String,
            rating: String,
            original_title: String,
            directors: String,
            casts: String,
            image: String
        });
        models.Movie_genre = db.define("movie_genre", {
            id: Number,
            movie_id: Number,
            genre_id: Number
        });
        next();
    }
}));
app.get("/movies/searchByGenreid",function (req, res) {
    let genreid = req.query.genreid;
    // let movieid = req.query.movieid;
    req.models.Movie_genre.find({genre_id:genreid},function (err, movie_genre) {
        if(err) throw err;
        let movie_idArray = movie_genre.map(i => i.movie_id);
        req.models.Movie.find({id:movie_idArray},12,[ "rating", "Z" ],function (err, movie) {
            res.send(movie);
        });
    })

});

app.get("/movies/all",function (req, res) {
    req.models.Movie.find(20,[ "rating", "Z" ],function (err, movie) {
        res.send(movie);
    });
});
app.get("/movies", function (req, res) {
    let id = req.query.id;
    console.log(id);
    req.models.Movie.get(id, function (error, movie) {
        console.log(movie);
        req.models.Movie_genre.find({ movie_id : id }, function (error, movie_genre) {
            let genreIdList = [];
            for (let genres of movie_genre) {
                genreIdList.push(genres.genre_id);
            }
            console.log(genreIdList);
            req.models.Genre.find({ id : genreIdList }, function (error, genres) {
                let s = '';
                for (let genre of genres) {
                    s += genre.name + '/';
                }
                console.log(s.substring(0, s.length-1));
                movie.genres = s.substring(0, s.length-1);
                res.send(movie);
            });
        });
    });
});
app.get("/movies/searchByMovieid",function (req, res) {
    let movieid = req.query.id;
    req.models.Movie_genre.find({movie_id:movieid},function (err, movie_genre) {
        if(err) throw err;
        let genre_idArray = movie_genre.map(i => i.genre_id);
        req.models.Movie_genre.find({genre_id:genre_idArray},function (err, movie_genre) {
            if(err) throw err;
            //console.log(JSON.stringify(movie_genre));
            let movie_idArray = movie_genre.map(i => i.movie_id);
            req.models.Movie.find({id:movie_idArray},20,[ "rating", "Z" ],function (err, movie) {
                res.send(movie);
            });
        });
    });
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});


