const express = require('express'); // importando express
const app = express(); // const app recebendo a função express 
app.use(express.json()); // Criar middleware - permite receber os dados no corpo da requisição
const cors = require("cors"); // Importando cors, permite conexão externa
const swaggerUI = require('swagger-ui-express'); //importando swaggerUI
const swaggerJsDoc = require('swagger-jsdoc'); //importando swaggerJsDoc
const path = require('path');

// Middleware para permitir requisição externa
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");   
    app.use(cors());
    next();
});

//incluindo as controllers
const usuario = require('./controllers/usuario'); 
const usuario_time = require('./controllers/usuario_time'); 
const usuario_liga = require('./controllers/usuario_liga'); 
const time = require('./controllers/time'); 
const time_liga = require('./controllers/time_liga'); 
const regiao = require('./controllers/regiao'); 
const partida = require('./controllers/partida'); 
const partida_time_liga = require('./controllers/partida_time_liga'); 
const noticia_liga = require('./controllers/noticia_liga'); 
const liga = require('./controllers/liga'); 
const jogador = require('./controllers/jogador'); 
const jogador_time = require('./controllers/jogador_time'); 
const noticia = require('./controllers/noticia'); 

// Rotas
app.use('/', usuario);
app.use('/', usuario_time);
app.use('/', usuario_liga);
app.use('/', time);
app.use('/', time_liga);
app.use('/', regiao);
app.use('/', partida);
app.use('/', partida_time_liga);
app.use('/', noticia_liga);
app.use('/', liga);
app.use('/', jogador);
app.use('/', jogador_time);
app.use('/', noticia);

//swagger
const swaggerSpec = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: "API E-hub", 
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:8080/"
            }
        ]
    },
    apis: [`${path.join(__dirname, "./controllers/*.js")}`],
}

app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

// Rodando servidor
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080/");
})




