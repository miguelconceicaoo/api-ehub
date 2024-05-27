const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /partida:
 *  get:
 *    summary: Retornar todas partidas
 *    tags: [partida] 
 *    responses:
 *      200:  
 *        description: Todas partidas.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/partida'        
 */

router.get("/partida", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countPartida = await db.partida.count();
    console.log(countPartida);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countPartida !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countPartida / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhuma partida encontrada."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const partida = await db.partida.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','data','hora'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(partida){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/partida',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countPartida
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            partida,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhuma partida encontrada.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /partida/{id}:
 *  get:
 *    summary: Retornar partida
 *    tags: [partida]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: id do usuário
 *    responses:
 *      200:  
 *        description: Todas partidas.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/partida'        
 */

router.get("/partida/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const partida = await db.partida.findOne({
        attributes: ['id','data','hora','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(partida){
        // Pausar o processamento e retornar os dados
        return res.json({
            partida: partida.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: partida não encontrada.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    partida:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        data:
 *          type: integer
 *          description: data da partida
 *        hora:
 *          type: integer
 *          description: hora da partida
 *      required:
 *       - id
 *       - data
 *       - hora 
*      example:
 *        data: 12/05/23
 *        hora: 14:13
 */

/**
 * @swagger
 * /partida:
 *  post:
 *    summary: Cadastrar partida
 *    tags: [partida] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/partida'
 *    responses:
 *      200:  
 *        description: partida cadastrada com sucesso!  
 */  

router.post('/partida', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.partida.create(dados).then((dadosPartida) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Partida cadastrada com sucesso!",
            dadosPartida
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar partida.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /partida/{id}:
 *  put:
 *    summary: Editar partida
 *    tags: [partida]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Editar partida
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/partida'
 *    responses:
 *      200:  
 *        description: Editar partida.      
 */

router.put("/partida/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.partida.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Partida editada com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: partida não editada.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /partida/{id}:
 *  delete:
 *    summary: Deletar partida
 *    tags: [partida]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar partida
 *    responses:
 *      200:  
 *        description: Todos partidas.      
 */

router.delete("/partida/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.partida.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "partida apagada com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: partida não apagada com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;