const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /time_liga:
 *  get:
 *    summary: Retornar todos registros time_liga
 *    tags: [time_liga] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/time_liga'        
 */

router.get("/time_liga", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countTimeLiga = await db.time_liga.count();
    console.log(countTimeLiga);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countTimeLiga !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countTimeLiga / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhum time_liga encontrado."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const timeLiga = await db.time_liga.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','id_time','id_liga'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(timeLiga){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/time_liga',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countTimeLiga
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            timeLiga,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum time_liga encontrado.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /time_liga/{id}:
 *  get:
 *    summary: Retornar um registro time_liga
 *    tags: [time_liga]
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
 *              $ref: '#/components/schemas/time_liga'        
 */

router.get("/time_liga/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const timeLiga = await db.time_liga.findOne({
        attributes: ['id','id_time','id_liga','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(timeLiga){
        // Pausar o processamento e retornar os dados
        return res.json({
            timeLiga: timeLiga.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: time_liga não encontrado.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    time_liga:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        id_time:
 *          type: integer
 *          description: FK id_time
 *        id_liga:
 *          type: string
 *          description: FK id_liga
 *      required:
 *       - id
 *       - id_time
 *       - id_liga
 *      example:
 *        id_time: 4
 *        id_liga: 6
 */

/**
 * @swagger
 * /time_liga:
 *  post:
 *    summary: Cadastrar registro time_liga
 *    tags: [time_liga] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/time_liga'
 *    responses:
 *      200:  
 *        description: time_liga cadastrado com sucesso!  
 */  

router.post('/time_liga', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.time_liga.create(dados).then((dadosTimeLiga) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Time_liga cadastrado com sucesso!",
            dadosTimeLiga
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar time_liga.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /time_liga/{id}:
 *  put:
 *    summary: Editar registro time_liga
 *    tags: [time_liga]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Editar time_liga
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/time_liga'
 *    responses:
 *      200:  
 *        description: Editar time_liga.      
 */

router.put("/time_liga/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.time_liga.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "time_liga editado com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: time_liga não editado.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /time_liga/{id}:
 *  delete:
 *    summary: Deletar registro time_liga
 *    tags: [time_liga]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar time_liga
 *    responses:
 *      200:  
 *        description: Todos registros time_liga.      
 */

router.delete("/time_liga/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.time_liga.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "time_liga apagado com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: time_liga não apagado com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;