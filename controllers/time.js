const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /time:
 *  get:
 *    summary: Retornar todos os times
 *    tags: [time] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/time'        
 */

router.get("/time", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countTime = await db.time.count();
    console.log(countTime);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countTime !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countTime / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhum time encontrado."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const time = await db.time.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','nome_time'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(time){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/time',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countTime
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            time,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum time encontrado.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /time/{id}:
 *  get:
 *    summary: Retornar um time
 *    tags: [time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: id do time
 *    responses:
 *      200:  
 *        description: Todos os times.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/time'        
 */

router.get("/time/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const time = await db.time.findOne({
        attributes: ['id','nome_time','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(time){
        // Pausar o processamento e retornar os dados
        return res.json({
            time: time.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: time não encontrado.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    time:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        nome_time:
 *          type: string
 *          description: Nome do time
 *      required:
 *       - id
 *       - nome_time
 *      example:
 *        nome_time: pain
 */

/**
 * @swagger
 * /time:
 *  post:
 *    summary: Cadastrar novo time
 *    tags: [time] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/time'
 *    responses:
 *      200:  
 *        description: time cadastrado com sucesso!  
 */

router.post('/time', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.time.create(dados).then((dadosTime) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Time cadastrado com sucesso!",
            dadosTime
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar time.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /time/{id}:
 *  put:
 *    summary: Editar time
 *    tags: [time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Editar time
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/time'
 *    responses:
 *      200:  
 *        description: Time editado com sucesso.      
 */

router.put("/time/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.time.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Time editado com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: time não editado.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /time/{id}:
 *  delete:
 *    summary: Deletar time
 *    tags: [time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar time
 *    responses:
 *      200:  
 *        description: Todos time.      
 */

router.delete("/time/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.time.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Time apagado com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: time não apagado com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;