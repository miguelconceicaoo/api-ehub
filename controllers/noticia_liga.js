const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /noticia_liga:
 *  get:
 *    summary: Retornar registros noticia_liga
 *    tags: [noticia_liga] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/noticia_liga'        
 */

router.get("/noticia_liga", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countNoticiaLiga = await db.noticia_liga.count();
    console.log(countNoticiaLiga);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countNoticiaLiga !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countNoticiaLiga / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhuma noticia_liga encontrada."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const noticiaLiga = await db.noticia_liga.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','id_noticia','id_liga'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(noticiaLiga){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/noticia_liga',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countNoticiaLiga
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            noticiaLiga,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum noticia_liga encontrada.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /noticia_liga/{id}:
 *  get:
 *    summary: Retornar registro noticia_liga
 *    tags: [noticia_liga]
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
 *              $ref: '#/components/schemas/noticia_liga'        
 */

router.get("/noticia_liga/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const noticiaLiga = await db.noticia_liga.findOne({
        attributes: ['id','id_noticia','id_liga','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(noticiaLiga){
        // Pausar o processamento e retornar os dados
        return res.json({
            noticiaLiga: noticiaLiga.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: noticia_liga não encontrada.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    noticia_liga:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: Id
 *        id_noticia:
 *          type: integer
 *          description: id noticia
 *        id_liga:
 *          type: integer
 *          description: id liga
 *      required:
 *       - nome_usuario
 *       - email
 *      example:
 *        id_noticia:
 *        id_liga: 
 */

/**
 * @swagger
 * /noticia_liga:
 *  post:
 *    summary: Cadastrar registro noticia_liga
 *    tags: [noticia_liga] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/noticia_liga'
 *    responses:
 *      200:  
 *        description: noticia_liga cadastrado com sucesso!  
 */

router.post('/noticia_liga', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.noticia_liga.create(dados).then((dadosNoticiaLiga) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Noticia_liga cadastrada com sucesso!",
            dadosNoticiaLiga
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar noticia_liga.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /noticia_liga/{id}:
 *  put:
 *    summary: Editar registro noticia_liga
 *    tags: [noticia_liga]
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
 *            $ref: '#/components/schemas/noticia_liga'
 *    responses:
 *      200:  
 *        description: Editar usuário.      
 */ 

router.put("/noticia_liga/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.noticia_liga.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Noticia_liga editada com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: noticia_liga não editado.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /noticia_liga/{id}:
 *  delete:
 *    summary: Deletar registro noticia_liga
 *    tags: [noticia_liga]
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

router.delete("/noticia_liga/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.noticia_liga.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Noticia_liga apagada com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: noticia_liga não apagada com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;