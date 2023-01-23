const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({path:".env"});

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
   }).catch((err)=>{
    console.log(err);
   });

app.get("/", (req, res)=> {res.json('API Listening')});

app.post("/api/movies", (req,res) => {
    db.addNewMovie(req.body)
    .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

app.get("/api/movies", (req,res) => {
    db.getAllMovies(req.query.page, req.query.perPage)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

app.get("/api/movies/:id", (req,res) => {
    db.getMovieById(req.params.id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(404).json(err);
        });
});

app.put("/api/movies/:id", (req,res) => {
    db.updateMovieById(req.body, req.params.id)
        .then(() => {
            res.status(200).json(`Movie ${req.body._id} successfully updated`);
        })
        .catch((err) => {
            res.status(404).json(err);
        });
});

app.delete("/api/movies/:id", (req,res) => {
    db.deleteMovieById(req.params.id)
        .then(() => {
            res.status(200).json(`Movie ${req.params.id} successfully deleted`);
        })
        .catch((err) => {
            res.status(404).json(err);
        });
});