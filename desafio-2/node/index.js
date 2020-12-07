const { uniqueNamesGenerator, Config, starWars } = require('unique-names-generator');

const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db-mysql',
    user: 'root',
    password: 'root',
    database:'nodedb'
};
const mysql = require('mysql')
const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    //Criar tabela people se não existir
    const sqlCreateTable = `CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))`;
    connection.query(sqlCreateTable, (err, result) => {
      if (err) throw err;
      console.log("Table created");
    });
  }
);

app.get('/', (req,res) => {
    //Tratamento para não inserir dados quando o dockerize requisitar no docker-compose up
    if(req.header('host') === "app-node:3000") {
        res.send("Ok");
        return;
    }
    let connection = mysql.createConnection(config);
    const randomName = uniqueNamesGenerator({ dictionaries: [starWars] });
    const sqlInsert = `INSERT INTO people(name) values('${randomName}')`
    connection.query(sqlInsert, (err, result) => {
        if (err) throw err;
        console.log(`Inserted ${randomName}`);
        const sqlSelect = `SELECT * FROM people`;
        connection.query(sqlSelect, (err, result) => {
            if (err) throw err;
            let namesListHTML = ``;
            result.forEach(person => {
                namesListHTML += `<li>${person.name}</li>`
            });
            let responseHTML = `<h1>Full Cycle Rocks!</h1><ul>${namesListHTML}</ul>`
            res.send(responseHTML);
        })
    });
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})