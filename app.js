require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const movies = require('./movie-data.js')
const app = express();


app.use(morgan('common'));
app.use(helmet())
app.use(cors());


app.use(function validateBearerToken(req, res, next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
 
    }
    next()
})


app.get('/movie', (req, res) => {

    const genre = req.query.genre;
    const country = req.query.country;
    const avg_vote = req.query.avg_vote;

    let results = [...movies]
    
    if(genre){
        results = results
            .filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));

        return res.send(results)
    }

    if (country){
        results = results
            .filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
        return res.send(results)
    }

    if (avg_vote){
        results = results
            .filter(movie => movie.avg_vote >= avg_vote)
        return res.send(results)
    }
    res.json(results)

})


app.listen(8000, () => {
    console.log('listening on port 8000')
})