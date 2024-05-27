//criar conexão com o banco de dados MySQL

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '250cinco',
    database: 'app',
});

connection.connect(function (err) {
    console.log("Conexão com o banco de dados realizada com sucesso!");
});

connection.query("SELECT * FROM usuarios", function(err, rows, fields){
    if(!err){
        console.log(rows);
    }else{
        console.log("ERRO: Consulta não realizada com sucesso");
    }
});

