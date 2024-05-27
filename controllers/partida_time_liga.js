const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /partida_time_liga:
 *  get:
 *    summary: Retornar todos registros partida_time_liga
 *    tags: [partida_time_liga] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/partida_time_liga'        
 */

router.get("/partida_time_liga", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countPartidaTimeLiga = await db.partida_time_liga.count();
    console.log(countPartidaTimeLiga);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countPartidaTimeLiga !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countPartidaTimeLiga / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhuma partida_time_liga encontrada."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const partidaTimeLiga = await db.partida_time_liga.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','id_liga','id_time1','id_time2'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(partidaTimeLiga){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/partida_time_liga',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countPartidaTimeLiga
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            partidaTimeLiga,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhuma partida_time_liga encontrada.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /partida_time_liga/{id}:
 *  get:
 *    summary: Retornar registro partida_time_liga
 *    tags: [partida_time_liga]
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
 *              $ref: '#/components/schemas/partida_time_liga'        
 */

router.get("/partida_time_liga/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const partidaTimeLiga = await db.partida_time_liga.findOne({
        attributes: ['id','id_liga','id_time1','id_time2','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(partidaTimeLiga){
        // Pausar o processamento e retornar os dados
        return res.json({
            partidaTimeLiga: partidaTimeLiga.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: partida_time_liga não encontrada.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    partida_time_liga:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        id_liga:
 *          type: integer
 *          description: FK id_liga
 *        id_time2:
 *          type: integer
 *          description: FK id_time2
 *        id_time1:
 *          type: integer
 *          description: FK id_time1
 *      required:
 *       - id
 *       - id_liga
 *       - id_time2
 *       - id_time1
 *      example:
 *        id_liga: 2 
 *        id_time2: 3
 *        id_time1: 4
 */

/**
 * @swagger
 * /partida_time_liga:
 *  post:
 *    summary: Cadastrar registro partida_time_liga
 *    tags: [partida_time_liga] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/partida_time_liga'
 *    responses:
 *      200:  
 *        description: partida_time_liga cadastrado com sucesso!  
 */

router.post('/partida_time_liga', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.partida_time_liga.create(dados).then((dadosPartidaTimeLiga) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "partida_time_liga cadastrada com sucesso!",
            dadosPartidaTimeLiga
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar partida_time_liga.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /partida_time_liga/{id}:
 *  put:
 *    summary: Editar registro partida_time_liga
 *    tags: [partida_time_liga]
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
 *            $ref: '#/components/schemas/partida_time_liga'
 *    responses:
 *      200:  
 *        description: Editar partida_time_liga.      
 */ 

router.put("/partida_time_liga/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.partida_time_liga.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Partida_time_liga editada com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: partida_time_liga não editada.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /partida_time_liga/{id}:
 *  delete:
 *    summary: Deletar registro partida_time_liga
 *    tags: [partida_time_liga]
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

router.delete("/partida_time_liga/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar partida_time_liga no banco de dados
    await db.partida_time_liga.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Partida_time_liga apagada com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: partida_time_liga não apagada com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;