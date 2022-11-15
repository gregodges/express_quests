const { sendStatus } = require("express/lib/response");
const database = require("./database");
const getUsers = (req, res) => {
  let sql = "select * from users ";
  const sqlValues = [];

  if (req.query.language != null && req.query.city != null) {
    sql = sql + "where language = ? AND city = ?"
    sqlValues.push(req.query.language, req.query.city)
  } else if (req.query.language != null) {
    sql = sql + "where language = ?"
    sqlValues.push(req.query.language)
  }else if (req.query.city != null) {
    sql = sql + "where city = ?"
    sqlValues.push(req.query.city)
  }
  database
  .query(sql, sqlValues)
  .then(([users]) => {
    res.status(200).json(users);



  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error retrieving data from database my G");
  });
};
const getUsersById = (req, res) => {
  const id = parseInt(req.params.id)
  database
  .query('select * from users where id = ?', [id] )
  .then(([users])=> {
    if(users[0] != null) {
    res.status(200).json(users);
    } else {
      res.status(404).send('page not found G')
    }
  })
  .catch((err) => {
    res.status(500).send('error retriving shit bruh')
  })

}

const postUser = (req,res) => {
  const {firstname, lastname, email, city, language} = req.body;
  database
  .query('INSERT INTO users (firstname, lastname, email, city, language) VALUES (?,?,?,?,?)',
    [firstname, lastname, email, city, language]
  )
  .then(([result])=>{
    res.location(`/api/users/${result.insertId}`).sendStatus(201)
  })
  .catch((err)=>{
    res.status(500).send('Error saving new user')
  })
}
const updateUser = (req,res) => {
  const id  = parseInt(req.params.id);
  const {firstname, lastname, email, city, language} = req.body;
  database 
  .query('update users set firstname = ? , lastname = ?, email = ?, city = ?, language = ? where id = ?',
  [firstname, lastname, email, city, language, id]
  )
  .then(([result])=>{
    if(result.affectedRows === 0){
      res.status(404).send('not FOund')
    } else {
      res.status(204)
    }
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).send('method not allowed')
  })

}
const deleteUser = (req,res) =>{
  const {id} = req.params;
  database
  .query('DELETE FROM users WHERE id = ?', id)
  .then((result)=>{
    res.status(201)
  })
  .catch((err)=>{
    console.log(err)
    res.status(500)
  })
}
module.exports= {
  getUsers,
  getUsersById,
  postUser,
  updateUser,
  deleteUser
}