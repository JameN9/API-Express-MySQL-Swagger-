const express = require("express");
const debug = require("debug")("app");
const mysql = require('mysql2');
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const YAML = require('yaml')
const file = fs.readFileSync('./swagger.yaml','utf8')
const swaggerDocument = YAML.parse(file)

const app = express();
const cors = require('cors')
const path = require("path");

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'mydb_1',
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.get('/attractions', (req, res) => {
  connection.query(
    'SELECT * FROM `attractions`',
    function (err, results){
      res.status(200).json(results)
    } 
  )
});

app.post('/attractions',(req,res) => {
  const {name , detail, coverimage, latitude, longitude} = req.body
  connection.query(
    'INSERT INTO attractions (name , detail, coverimage, latitude, longitude) VALUES(?,?,?,?,?)',
    [name , detail, coverimage, latitude, longitude],
    function(err, results){
      res.json(results)
    }
  )
})

app.put('/attractions',(req,res) => {
  const {id, name , detail, coverimage, latitude, longitude} = req.body
  connection.query(
    'UPDATE attractions SET name=? , detail=?, coverimage=?, latitude=?, longitude=? WHERE id = ?',
    [name , detail, coverimage, latitude, longitude, id],
    function(err, results){
      res.json(results)
    }
  )
})

app.delete('/attractions/:id',(req,res) => {
  const id = req.params.id
  connection.query(
    'DELETE FROM attractions WHERE id = ?',
    [id],
    function(err, results){
      res.json(results)
    }
  )
})

app.get('/attractions/:id',(req,res) => {
  const id = req.params.id
  connection.query(
    'SELECT * FROM `attractions` WHERE id = ? ',
    [id],
    function(err,results){
      if(results.length > 0){
        res.status(200).json(results)
      }else{
        res.status(404).json("Not fund this page")
      }
    },
  )
})

app.listen(port, () => {
  debug("Server is online" + port);
});

//credit
//ฝึกทำ API Express.js จากช่องทาง https://www.youtube.com/watch?v=c-z-O-Bb73s