const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /noticia:
 *  get:
 *    summary: Retornar todas noticias
 *    tags: [noticia] 
 *    responses:
 *      200:  
 *        description: Todas noticias.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/noticia'        
 */

router.get("/noticia", async (req, res) => {
    // Receber numero da página, quando não enviado o numero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countNoticia = await db.noticia.count();
    console.log(countNoticia);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countNoticia !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countNoticia / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhuma noticia encontrada."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const noticia = await db.noticia.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','id_liga','portal_noticia','noticia_url'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(noticia){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/noticia',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countNoticia
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            noticia,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhuma noticia encontrada.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /noticia/{id}:
 *  get:
 *    summary: Retornar uma noticia
 *    tags: [noticia]
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
 *              $ref: '#/components/schemas/noticia'        
 */

router.get("/noticia/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const noticia = await db.noticia.findOne({
        attributes: ['id','id_liga','portal_noticia','noticia_url','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(noticia){
        // Pausar o processamento e retornar os dados
        return res.json({
            noticia: noticia.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: noticia não encontrada.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    noticia:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        id_liga:
 *          type: integer
 *          description: FK id_liga
 *        portal_noticia:
 *          type: string
 *          description: portal da noticia
 *        noticia_url:
 *          type: string
 *          description: url da noticia
 *      required:
 *       - id
 *       - id_liga
 *       - portal_noticia
 *       - noticia_url
 *      example:
 *        id: 2
 *        id_liga: 3
 *        portal_noticia: uol
 *        noticia_url: www.noticia.com.br
 */

/**
 * @swagger
 * /noticia:
 *  post:
 *    summary: Cadastrar noticia
 *    tags: [noticia] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/noticia'
 *    responses:
 *      200:  
 *        description: noticia cadastrada com sucesso!  
 */  

router.post('/noticia', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados); 

    // Salvar no banco de dados
    await db.noticia.create(dados).then((dadosNoticia) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "noticia cadastrada com sucesso!",
            dadosNoticia
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar noticia.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /noticia/{id}:
 *  put:
 *    summary: Editar noticia
 *    tags: [noticia]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Editar noticia
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/noticia'
 *    responses:
 *      200:  
 *        description: Editar noticia.      
 */

router.put("/noticia/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.noticia.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "noticia editada com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: noticia não editada.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /noticia/{id}:
 *  delete:
 *    summary: Deletar noticia
 *    tags: [noticia]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar noticias
 *    responses:
 *      200:  
 *        description: Deletar noticia.      
 */

router.delete("/noticia/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar noticia no banco de dados
    await db.noticia.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "noticia apagada com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: noticia não apagada com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;