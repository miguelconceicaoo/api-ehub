const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /jogador_time:
 *  get:
 *    summary: Retornar registros jogador_time
 *    tags: [jogador_time] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/jogador_time'        
 */

router.get("/jogador_time", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countJogadorTime = await db.jogador_time.count();
    console.log(countJogadorTime);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countJogadorTime !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countJogadorTime / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhum jogador_time encontrado."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const jogadorTime = await db.jogador_time.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','id_jogador',],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(jogadorTime){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/jogador_time',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countJogadorTime
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            jogadorTime,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum jogador_time encontrado.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /jogador_time/{id}:
 *  get:
 *    summary: Retornar jogador_time
 *    tags: [jogador_time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: id do usuário
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/jogador_time'        
 */

router.get("/jogador_time/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const jogadorTime = await db.jogador_time.findOne({
        attributes: ['id','id_jogador','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(jogadorTime){
        // Pausar o processamento e retornar os dados
        return res.json({
            jogadorTime: jogadorTime.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: jogador_time não encontrado.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    jogador_time:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        id_jogador:
 *          type: integer
 *          description: FK jogador
 *      required:
 *       - id
 *       - id_jogador
 *      example:
 *        id_jogador: 1
 */

/**
 * @swagger
 * /jogador_time:
 *  post:
 *    summary: Cadastrar registro jogador_time
 *    tags: [jogador_time] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/jogador_time'
 *    responses:
 *      200:  
 *        description: jogador_time cadastrado com sucesso!  
 */ 

router.post('/jogador_time', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.jogador_time.create(dados).then((dadosJogadorTime) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "jogador_time cadastrado com sucesso!",
            dadosJogadorTime
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar jogador_time.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /jogador_time/{id}:
 *  put:
 *    summary: Editar registro jogador_time
 *    tags: [jogador_time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Editar usuário
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/jogador_time'
 *    responses:
 *      200:  
 *        description: Editar usuário.      
 */

router.put("/jogador_time/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.jogador_time.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "jogador_time editado com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: jogador_time não editado.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /jogador_time/{id}:
 *  delete:
 *    summary: Deletar registro jogador_time
 *    tags: [jogador_time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar usuário
 *    responses:
 *      200:  
 *        description: Todos usuários.      
 */

router.delete("/jogador_time/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.jogador_time.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "jogador_time apagado com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: jogador_time não apagado com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;