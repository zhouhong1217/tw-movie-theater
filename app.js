/**
 * Created by ggbond on 17-8-1.
 */
'use strict';

let express = require('express');
let orm = require('orm');
let app = express();
let bodyPaser = require('body-parser');
let urlencodedParser = bodyPaser.urlencoded({extended:true});
const dbsrc = '/home/lovegood/WebstormProjects/tw-movie-theater/DB/movies.db';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(orm.express(`sqlite://${dbsrc}`, {
    define: function (db, models, next) {
        models.Movie = db.define("movie", {
            id : String,
            title: String,
            alt: String,
            year: String,
            rating: String,
            directors: String,
            casts: String,
            image: String,
            original_title: String
        });

        models.Genre = db.define("genre", {
            id : String,
            name : String
        });

        models.Movie_genre = db.define("movie_genre", {
            movie_id: String,
            genre_id: String
        });

        next();
    }
}));

app.get("/movies", function (req, res) {
    let id = req.query.id;
    req.models.Movie.get(id, function (error, movie) {
        if (error) {
            res.status(400).send(error);
            return;
        }
        console.log(movie);
        req.models.Movie_genre.find({ movie_id : id }, function (error, movie_genre) {
            if (error) {
                res.status(400).send(error);
                return;
            }
            let genreIdList = [];
            for (let genres of movie_genre) {
                genreIdList.push(genres.genre_id);
            }
            console.log(genreIdList);
            req.models.Genre.find({ id : genreIdList }, function (error, genres) {
                if (error) {
                    res.status(400).send(error);
                    return;
                }
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

app.get("/movies/search",function (req, res) {
    let genreid = req.query.genreid;
    let movietitle = req.query.movietitle;
});

app.listen(8081,function () {
    console.log("App is listening on port 8080!");
})