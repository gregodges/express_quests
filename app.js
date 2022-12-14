require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json()); 

const port = process.env.APP_PORT ?? 3009;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require('./userHandlers')


app.post("/api/movies", movieHandlers.postMovie);
app.put('/api/movies/:id', movieHandlers.putMovie);
app.get('/api/movies', movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.delete('/api/movies/:id', movieHandlers.deleteMovie);
app.post('/api/users', userHandlers.postUser);
app.get('/api/users', userHandlers.getUsers);
app.get('/api/users/:id', userHandlers.getUsersById);
app.put('/api/users/:id', userHandlers.updateUser)
app.delete('/api/users/:id', userHandlers.deleteUser)



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
