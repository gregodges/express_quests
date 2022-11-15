const { sendStatus } = require("express/lib/response");
const database = require("./database");
const getMovies = (req, res) => {
  let sql = "select * from movies ";
  const sqlValue = [];

  if (req.query.color != null && req.query.duration != null) {
    sql += "where color = ? AND duration = ?"
    sqlValue.push(req.query.color, req.query.duration)
  } else if ( req.query.color != null ){
    sql += "where color = ?"
    sqlValue.push(req.query.color)
  } else if (req.query.duration != null){
    sql += "where duration < ?"
    sqlValue.push(req.query.duration)
  }

  

    

  database
    .query(sql, sqlValue)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies])=>{
if(movies[0] != null) {
  res.json(movies)
} else {
  res.status(404).send('not foun G')
}
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
});
}
const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  database 
  .query("INSERT INTO movies (title, director, year, color, duration) VALUES (?,?,?,?,?)",
  [title, director, year, color, duration] 
  )
  .then(([result])=> {
    res.location(`/api/movies/${result.insertId}`).sendStatus(201); 
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error saving the movie");
  });
}
const putMovie =(req, res)=>{
  const id = parseInt(req.params.id);
  const {title, director, year, color, duration} = req.body
  database
  .query('UPDATE movies SET title = ? , director = ?, year = ?, color = ?, duration = ? where id = ?',
  [title, director, year, color, duration, id]
  )
  .then(([result])=>{
    if (result.affectedRows === 0) {
      res.status(404).send('Not Found')
    } else {
      res.status(204)
    }
  })
  .catch((err)=>{
     console.log(err)
    res.status(405).send('method not allowed')
  })
}
const deleteMovie = (req,res) => {
  const { id } = req.params;
  database
  .query("DELETE FROM movies WHERE id = ?", id)
  .then(([result])=>{
    console.log('movie deleted')
    res.status(200)
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).send('erro deleting movie')
  })
  
}
module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  putMovie,
  deleteMovie
};
